# Wecard Thief — Guide pour Claude Code

## Description du projet

Application web de modération pour les groupes Facebook d'échange de cartes Weward.
Elle permet aux modérateurs et admins de consulter et alimenter une base de données
de membres signalés comme voleurs ou mauvais échangeurs.

## Stack technique

- **Frontend + API** : Next.js 14 (App Router)
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth (email + mot de passe)
- **Styles** : Tailwind CSS + shadcn/ui (https://ui.shadcn.com/)
- **Déploiement** : Vercel (gratuit) + Supabase (free tier)
- **Langue de l'UI** : Français

## Design & UX

- **Mobile-first** — l'application est principalement utilisée sur smartphone. Concevoir d'abord pour mobile, puis adapter pour tablette et desktop.
- **Responsive** : breakpoints `sm` (tablette) et `lg` (desktop) avec Tailwind
- **Style** : sobre, simple, efficace — pas de fioriture. Utiliser les composants shadcn/ui (Button, Card, Table, Badge, Dialog, Input, Select, etc.)
- **Navigation mobile** : menu hamburger ou barre de navigation en bas de l'écran
- **Typographie** : claire et lisible sur petit écran
- **Couleurs des statuts** :
  - `confirmed` → rouge (`destructive` dans shadcn)
  - `suspected` → jaune/orange (`warning`)
  - `pending` → gris (`muted`)

## Structure des rôles utilisateurs

### Admin
- Ajouter, modifier, supprimer des entrées (voleurs)
- Valider ou rejeter les signalements soumis par les users
- Gérer les comptes utilisateurs (créer, désactiver)
- Voir l'historique complet des actions

### User (Modérateur)
- Consulter la liste des voleurs confirmés
- Rechercher un pseudo/nom dans la base
- Soumettre un nouveau signalement (en attente de validation admin)
- Voir ses propres signalements et leur statut

## Architecture des pages

```
/                     → Redirige vers /login ou /dashboard
/login                → Page de connexion
/dashboard            → Vue principale : liste des voleurs confirmés + recherche
/signalements         → Liste des signalements en attente (admin uniquement)
/signalements/nouveau → Formulaire de soumission d'un signalement (tous)
/voleurs/[id]         → Fiche détaillée d'un voleur
/admin/utilisateurs   → Gestion des comptes (admin uniquement)
/admin/logs           → Historique des actions (admin uniquement)
```

## Schéma de la base de données

Voir le fichier `schema.sql` à la racine du projet pour le SQL complet.

### Tables principales :
- `profiles` — comptes utilisateurs liés à `auth.users` de Supabase
- `thieves` — base des voleurs confirmés
- `reports` — signalements soumis (en attente de validation ou archivés)
- `activity_logs` — journal des actions de modération

### Données enregistrées sur chaque voleur :
- `facebook_first_name` + `facebook_last_name` — prénom et nom Facebook (affichés avec lien cliquable vers le profil)
- `facebook_url` — lien cliquable vers la page Facebook de la personne
- `weward_pseudos` — tableau des pseudos Weward connus (la plateforme principale)
- `arnaque_type` — catégorie d'arnaque (ex: "Prend sans envoyer", "Fausses cartes"…)
- `description` — description détaillée de l'arnaque
- `infraction_urls` — liens vers les posts/preuves de signalement (posts Facebook, screenshots hébergés)
- `status` — `suspected` ou `confirmed`

## Composants shadcn/ui à utiliser en priorité

- `Button`, `Input`, `Textarea`, `Select` — formulaires
- `Card` — fiches voleurs et signalements
- `Badge` — statuts (confirmed / suspected / pending)
- `Table` — liste des voleurs sur desktop
- `Dialog` / `AlertDialog` — confirmations (suppression, validation)
- `Sheet` — panneau latéral pour le menu mobile
- `Separator`, `Label`, `Form` — structure des formulaires
- `Skeleton` — états de chargement

## Conventions de code

- TypeScript strict
- Composants React dans `src/components/`
- Pages dans `src/app/` (App Router Next.js)
- Logique Supabase dans `src/lib/supabase/`
- Types dans `src/types/`
- Nommer les fichiers en kebab-case
- Tous les textes de l'interface en **français**

## Variables d'environnement requises

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Sécurité — points importants

- Row Level Security (RLS) activé sur toutes les tables Supabase
- Les policies RLS doivent vérifier le rôle via `profiles.role`
- Ne jamais exposer le `service_role_key` côté client
- Les routes `/admin/*` doivent vérifier le rôle côté serveur (middleware Next.js)

## Flux de validation des signalements

1. Un user soumet un signalement → statut `pending`
2. Un admin consulte la file `/signalements`
3. Admin valide → le signalement devient une entrée dans `thieves` avec statut `confirmed`
4. Admin rejette → statut `rejected` avec note optionnelle
5. Chaque action est enregistrée dans `activity_logs`

## Commandes utiles

```bash
npm run dev       # Démarrer en développement
npm run build     # Build de production
npm run lint      # Vérification ESLint
```
