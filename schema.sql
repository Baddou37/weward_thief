-- ============================================================
-- Wecard Thief — Schéma Supabase (PostgreSQL)
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================================

-- Activer l'extension UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE : profiles
-- Étend auth.users de Supabase avec rôle et infos affichées
-- ============================================================
create type user_role as enum ('admin', 'user');

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  display_name  text not null,
  role          user_role not null default 'user',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Créer automatiquement un profil à chaque inscription Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TABLE : thieves
-- Base des voleurs signalés et confirmés
-- ============================================================
create type thief_status as enum ('suspected', 'confirmed');

create table public.thieves (
  id                   uuid primary key default uuid_generate_v4(),

  -- Identité Facebook
  facebook_first_name  text,                        -- Prénom Facebook (optionnel)
  facebook_last_name   text,                        -- Nom Facebook (optionnel)
  facebook_url         text,                        -- Lien cliquable vers le profil Facebook

  -- Identité Weward
  weward_pseudos       text[] not null default '{}', -- Pseudos Weward connus (principal identifiant)

  -- Détails de l'arnaque
  arnaque_type         text,                        -- Catégorie : "Prend sans envoyer", "Fausses cartes", etc.
  description          text,                        -- Description détaillée de l'arnaque

  -- Preuves et liens
  infraction_urls      text[] not null default '{}', -- Liens vers posts Facebook ou images hébergées

  -- Statut
  status               thief_status not null default 'suspected',

  -- Métadonnées
  created_at           timestamptz not null default now(),
  created_by           uuid references public.profiles(id) on delete set null,
  updated_at           timestamptz not null default now(),
  updated_by           uuid references public.profiles(id) on delete set null
);

-- Colonne calculée : nom complet affiché (ex: "Jean Dupont")
-- Utilisée pour la recherche et l'affichage
create or replace function public.thief_full_name(t public.thieves)
returns text as $$
  select trim(coalesce(t.facebook_first_name, '') || ' ' || coalesce(t.facebook_last_name, ''));
$$ language sql stable;

-- Mise à jour automatique du champ updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_thieves_updated_at
  before update on public.thieves
  for each row execute procedure public.update_updated_at();

-- Index pour la recherche rapide par pseudo Weward
create index thieves_weward_pseudos_idx on public.thieves using gin(weward_pseudos);

-- Index pour la recherche par nom Facebook
create index thieves_facebook_name_idx on public.thieves
  using btree (lower(coalesce(facebook_first_name, '') || ' ' || coalesce(facebook_last_name, '')));

-- ============================================================
-- TABLE : reports
-- Signalements soumis par les users, en attente de validation
-- ============================================================
create type report_status as enum ('pending', 'approved', 'rejected');

create table public.reports (
  id                   uuid primary key default uuid_generate_v4(),

  -- Identité Facebook signalée
  facebook_first_name  text,
  facebook_last_name   text,
  facebook_url         text,

  -- Identité Weward signalée
  weward_pseudos       text[] not null default '{}',

  -- Détails de l'arnaque
  arnaque_type         text,
  description          text,

  -- Preuves et liens
  infraction_urls      text[] not null default '{}',

  -- Statut du signalement
  status               report_status not null default 'pending',

  -- Modération
  submitted_by         uuid references public.profiles(id) on delete set null,
  reviewed_by          uuid references public.profiles(id) on delete set null,
  reviewed_at          timestamptz,
  review_note          text,                        -- Note de l'admin en cas de rejet

  -- Lien vers le voleur créé si approuvé
  thief_id             uuid references public.thieves(id) on delete set null,

  created_at           timestamptz not null default now()
);

-- ============================================================
-- TABLE : activity_logs
-- Journal de toutes les actions de modération
-- ============================================================
create type log_action as enum (
  'thief_created',
  'thief_updated',
  'thief_deleted',
  'report_submitted',
  'report_approved',
  'report_rejected',
  'user_created',
  'user_updated',
  'user_deactivated'
);

create table public.activity_logs (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles(id) on delete set null,
  action       log_action not null,
  target_type  text,                                -- 'thief', 'report', 'user'
  target_id    uuid,
  details      jsonb,                               -- Données contextuelles (ex: ancien/nouveau statut)
  created_at   timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Activer RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.thieves enable row level security;
alter table public.reports enable row level security;
alter table public.activity_logs enable row level security;

-- Helper : récupérer le rôle de l'utilisateur connecté
create or replace function public.get_my_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- Helper : vérifier si l'utilisateur est actif
create or replace function public.is_active_user()
returns boolean as $$
  select is_active from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- ---- PROFILES ----
create policy "profiles_select" on public.profiles
  for select using (
    auth.uid() = id or public.get_my_role() = 'admin'
  );

create policy "profiles_update_admin" on public.profiles
  for update using (public.get_my_role() = 'admin');

-- ---- THIEVES ----
-- Lecture : tous les utilisateurs actifs connectés
create policy "thieves_select" on public.thieves
  for select using (auth.uid() is not null and public.is_active_user());

-- Écriture : admins uniquement
create policy "thieves_insert_admin" on public.thieves
  for insert with check (public.get_my_role() = 'admin');

create policy "thieves_update_admin" on public.thieves
  for update using (public.get_my_role() = 'admin');

create policy "thieves_delete_admin" on public.thieves
  for delete using (public.get_my_role() = 'admin');

-- ---- REPORTS ----
-- Lecture : admin voit tout, user voit uniquement ses propres signalements
create policy "reports_select" on public.reports
  for select using (
    public.get_my_role() = 'admin'
    or (auth.uid() = submitted_by and public.is_active_user())
  );

-- Insertion : tous les utilisateurs actifs
create policy "reports_insert" on public.reports
  for insert with check (auth.uid() is not null and public.is_active_user());

-- Validation/rejet : admins uniquement
create policy "reports_update_admin" on public.reports
  for update using (public.get_my_role() = 'admin');

-- ---- ACTIVITY LOGS ----
create policy "logs_select_admin" on public.activity_logs
  for select using (public.get_my_role() = 'admin');

create policy "logs_insert" on public.activity_logs
  for insert with check (auth.uid() is not null);

-- ============================================================
-- STORAGE — Bucket pour les preuves (screenshots uploadés)
-- À configurer dans l'interface Supabase Storage :
--   Nom du bucket : "proofs"
--   Accès public : non (authentifié uniquement)
-- Les URLs générées sont stockées dans infraction_urls[]
-- ============================================================
