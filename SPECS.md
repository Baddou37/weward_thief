# Spécifications fonctionnelles — Wecard Thief

## Vue d'ensemble

Application de modération permettant aux admins et utilisateurs de groupes Facebook
d'échange de cartes Weward de signaler et consulter des membres malveillants.

**Stack** : Next.js 14 + Supabase + Tailwind CSS — déployé sur Vercel (gratuit)
**Auth** : Email + mot de passe, comptes créés uniquement par un admin

---

## Données enregistrées sur un voleur

| Champ               | Type     | Description                                                   |
|---------------------|----------|---------------------------------------------------------------|
| facebook_first_name | text     | Prénom Facebook (optionnel)                                   |
| facebook_last_name  | text     | Nom Facebook (optionnel)                                      |
| facebook_url        | text     | Lien cliquable vers la page Facebook (s'ouvre dans un onglet) |
| weward_pseudos      | text[]   | Pseudo(s) Weward connus — champ principal de recherche        |
| arnaque_type        | text     | Catégorie : "Prend sans envoyer", "Envoie fausses cartes"…    |
| description         | text     | Description détaillée de ce qui s'est passé                   |
| infraction_urls     | text[]   | Liens vers les preuves (posts Facebook, screenshots…)         |
| status              | enum     | `suspected` (suspecté) ou `confirmed` (confirmé)              |

---

## Fonctionnalités

### 1. Authentification

- [ ] Page de connexion avec email + mot de passe
- [ ] Redirection automatique vers `/dashboard` si déjà connecté
- [ ] Déconnexion
- [ ] Message d'erreur clair si identifiants incorrects
- [ ] Pas d'inscription publique — comptes créés uniquement par un admin

### 2. Dashboard (tous les rôles)

- [ ] Liste des voleurs avec : pseudo(s) Weward, nom Facebook (cliquable), statut, date d'ajout
- [ ] Barre de recherche sur le pseudo Weward ET le nom/prénom Facebook
- [ ] Filtre par statut : Suspecté / Confirmé
- [ ] Tri par date d'ajout (plus récent en premier)
- [ ] Pagination (20 entrées par page)
- [ ] Badge coloré : 🔴 Confirmé / 🟡 Suspecté
- [ ] Clic sur une ligne → fiche détaillée du voleur

### 3. Fiche d'un voleur (`/voleurs/[id]`)

- [ ] Prénom + Nom Facebook — cliquable → ouvre la page Facebook dans un nouvel onglet
- [ ] Pseudo(s) Weward connus (liste)
- [ ] Type d'arnaque + description détaillée
- [ ] Liens vers les infractions/preuves (liste de liens cliquables)
- [ ] Statut avec badge coloré
- [ ] Date du premier signalement + auteur
- [ ] Bouton **Modifier** (admin uniquement)
- [ ] Bouton **Supprimer** avec confirmation (admin uniquement)

### 4. Soumettre un signalement (`/signalements/nouveau`)

Accessible à tous les utilisateurs connectés.

- [ ] Champs : prénom Facebook, nom Facebook, URL profil Facebook
- [ ] Pseudo(s) Weward (champ multi-valeurs — on peut en ajouter plusieurs)
- [ ] Type d'arnaque (liste déroulante + option "Autre")
- [ ] Description de l'arnaque
- [ ] Liens vers les preuves (on peut en ajouter plusieurs — posts Facebook, etc.)
- [ ] Message de confirmation après soumission
- [ ] Le signalement apparaît avec le statut "En attente" dans l'espace de l'utilisateur

### 5. Validation des signalements — admin (`/signalements`)

- [ ] Liste des signalements en attente, triés par date
- [ ] Aperçu rapide : pseudos Weward, nom Facebook, type d'arnaque, date
- [ ] Bouton **Valider** → ouvre un formulaire pré-rempli pour créer l'entrée dans `thieves`
- [ ] Bouton **Rejeter** → archivage avec note optionnelle envoyée au signalant
- [ ] Badge dans le menu indiquant le nombre de signalements en attente
- [ ] Lors de la validation : possibilité de modifier/enrichir les données avant confirmation

### 6. Gestion des utilisateurs — admin (`/admin/utilisateurs`)

- [ ] Liste des comptes : email, nom affiché, rôle, statut (actif/désactivé), date de création
- [ ] Créer un nouvel utilisateur (email, nom, rôle admin ou user)
- [ ] Désactiver un compte (sans le supprimer)
- [ ] Modifier le rôle d'un utilisateur
- [ ] L'admin ne peut pas se désactiver lui-même

### 7. Journal des actions — admin (`/admin/logs`)

- [ ] Liste chronologique : qui a fait quoi, quand, sur quel enregistrement
- [ ] Actions tracées : ajout/modif/suppression d'un voleur, validation/rejet d'un signalement, gestion users
- [ ] Filtre par utilisateur et par type d'action

---

## Types d'arnaque suggérés (liste déroulante)

- Prend les cartes sans envoyer en retour
- Envoie de fausses cartes / cartes sans valeur
- Bloque après réception
- Double échange frauduleux
- Autre (à préciser)

---

## Priorités de développement

### Phase 1 — MVP
1. Auth (login/logout)
2. Dashboard avec liste + recherche
3. Fiche détaillée d'un voleur
4. Formulaire de signalement
5. File de validation admin

### Phase 2 — Complet
6. Gestion des utilisateurs
7. Journal des actions
8. Filtres avancés
