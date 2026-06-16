# 📋 SMATCH — Notes de référence projet

> Fichier mémo pour le développement. À relire au début de chaque session.
> Projet : **Smatch** (SnowMatch ❄️ / SunMatch ☀️) — "AdopteUnMec de l'aventure".
> App de matching pour partir en crew (ski, surf, rando, etc.). Front pur (HTML/Tailwind CDN/JS natif).

---

## 🚨 RÈGLES IMPÉRATIVES (ne jamais oublier)

1. **DASHBOARDS = TOUJOURS LES DEUX.** Toute action touchant un dashboard (style, logique, structure, bug) doit être appliquée ET vérifiée sur `dashboard_hiver.html` **ET** `dashboard_ete.html`. Faire une vérif côte-à-côte des deux avant de livrer. L'utilisateur paie au quota → un oubli = du budget gaspillé.

2. **RECHECK DE BOUT EN BOUT.** Tester le **scénario complet** (ex: envoi → acceptation → affichage), pas juste l'étape modifiée. Bug typique attrapé ainsi : "10 demandes créées ✅ mais seulement 2 acceptées ❌".

3. **AUDIT SYSTÉMATIQUE À CHAQUE MODIF :**
   - Accolades équilibrées (`{` = `}`)
   - Syntaxe JS valide (`node --check` sur le script extrait)
   - Chargement sans erreur (eval trip_data.js + nav.js dans Node)
   - Fonctions définies vs appelées
   - ⚠️ Échappement apostrophes : `\'` simple, JAMAIS `\\'` (casse tout)

4. **TITRES DE COMMIT À CHAQUE LIVRAISON.** ≤ 50 caractères, sans accents, convention Conventional Commits (`feat:` / `fix:` / `style:` / `refactor:`). Détail dans la description (accents OK).

5. **RESYNCHRONISER `index.html`** quand `accueil.html` change (`index.html` = copie exacte d'accueil, point d'entrée Netlify).

6. **Claude N'A PAS de navigateur.** Les bugs visuels/CSS sont signalés par captures de l'utilisateur. Claude teste logique/braces/parsing en Node/Python.

---

## 🎨 Charte graphique (OBLIGATOIRE)

- Dark mode · Frosted glass (`backdrop-blur-xl bg-slate-900/70`)
- Dégradés **cyan→bleu (hiver)** / **ambre→orange (été)**
- Fond montagne en CSS/SVG (pas d'images externes)
- Logo SN❄️WMATCH / S☀️NMATCH · ton décalé avec émojis · animations pulsation
- Tailwind v4 via CDN navigateur
- **Couleurs accent : hiver `#22d3ee` · été `#fbbf24`**
- Marque : **Smatch** (global) · **SnowMatch** (hiver ❄️) · **SunMatch** (été ☀️)

---

## 📁 Fichiers de production (11)

| Fichier | Rôle |
|---|---|
| `index.html` | Point d'entrée = copie d'accueil.html (Netlify) |
| `accueil.html` | Landing, modal connexion |
| `recherche.html` | Formulaire, autocomplétion villes, dispo par saison, tranche d'âge |
| `resultats.html` | Matchs, moteur compat, "Inviter tout le monde", filtre âge |
| `dashboard_hiver.html` | Dashboard SnowMatch ❄️ (data-driven) |
| `dashboard_ete.html` | Dashboard SunMatch ☀️ (data-driven, harmonisé avec hiver) |
| `nav.js` (~2000+ l) | Navbar, messagerie, notifs, tunnel fusion, simulateur de vie |
| `trip_data.js` | SOURCE DE VÉRITÉ : données + moteurs (compat, merge, membres, chat) |
| `cities.js` | 320 villes taguées par terrain + filtrage par activité |
| `store.js` | Module SmatchStore (localStorage centralisé) |
| `mobile.css` | Optimisations mobile |

**Ordre chargement scripts :** `trip_data.js` → `store.js` → `cities.js` (recherche only) → `nav.js`

---

## 🧠 Architecture clé (trip_data.js)

- **SMATCH_TRIPS** : dh1 (Chamonix hiver), dh0 (Méribel archivé), de1 (Hossegor été).
- **smatchGetActiveTrip()** : URL `?trip` > localStorage. Applique overrides (`snm_trip_overrides`) + hydrate fresh trips.
- **_applyTripOverrides** : applique les modifs user (nom/spot/dates/roadmap) aux trips officiels.
- **_hydrateFreshTrip** : crew créé → station réaliste aléatoire, dates cohérentes.
- **SMATCH_MEMBERS** : 9 profils base. `smatchAllMembers()` = base + enregistrés (inclut inc_/val_).
- **smatchComputeCompat** : score pondéré (niveau, dispo+overlap dates, intensité, budget, kiffs, géo).
- **smatchRegisterMember** / **smatchAllMembers** : enregistre profils fusionnés (résout "crew vide").
- **smatchGetCrewChat / smatchAddCrewChatMessage / smatchSaveCrewChat** : chat de crew PERSISTANT unifié (`snm_crewchat_{tripId}`). Source unique partagée dashboard + simulateur. Messages AJOUTÉS jamais écrasés.
- **SmatchMerge** (tunnel) : send/update/get/createCrew/addMemberToCrew/isUnited.
  - Statuts : pending → accepted → negotiating → united (+ left, rejected)
  - **IDs uniques** : `'mr_' + Date.now().toString(36) + '_' + random` (sinon collision en boucle = "Inviter tout le monde" bloqué)
  - **send() refuse** si déjà demande active OU déjà membre d'un crew actif (`_smatchAlreadyInActiveCrew`)
  - createCrew : memberKeys = ['R', key] (2 membres), dates passées → reportées année suivante, flag `fromMerge:true`
- **_smatchAlreadyInActiveCrew(key, name)** : bloque réinvitation d'un membre existant (par clé ou nom).

---

## 🧭 Architecture clé (nav.js)

- **navResolvePendingMerges()** : accepte auto les demandes pending > 4s. Appelé 3× : au load (800ms), interval 8s, ouverture demandes. (Robuste : ne dépend pas du setTimeout de la page résultats.)
- **navUnionChoice(id)** : 3 options — ✨ Créer crew / ➕ Intégrer à mon crew / 🚪 Rejoindre son crew.
- **Notifications** : cloche 🔔 + pastille. navPushNotif(type, title, body, action). Types : match|message|merge|chat|crew|system. Anti-doublon.
- **Pastilles rouges** : nav mobile (Matchs→demandes pending, Crews→validations), pill Matchs desktop.
- **navMergeFromProfile(name, mkey)** : merge depuis n'importe quel profil (messages/dashboard/matchs/demandes).
- **navViewMemberProfile** : cherche dans annuaire complet + incoming matches → fiche toujours avec Merger+Message.
- **navAddCrewChatMessage** : message d'un VRAI membre du crew, ajouté au chat persistant, LIMITÉ (max 4 auto récents = pas de discussion infinie).
- **navAddIncomingMatch / navAddIncomingMessage** : alimentent vraiment "Mes Matchs" / la messagerie (notifs cohérentes).
- **navCreateValidationRequest / navOpenValidationModal / navResolveValidation** : un membre propose un nouveau venu → notif → tu valides/refuses.
- **Simulateur de vie** (navStartLifeSimulator) : événements 45-90s (nouveaux matchs, messages, activité crew, validations).
- **_navLatestDashboard** : "Dashboard actif" = dernier visité (`snm_active_trip_id`), sinon 1er de la saison.
- **navIsSouvenir(d)** : souvenir = passé ET pas fromMerge (sauf archived).
- **navToggleSeason** : sur Matchs → charge `snm_search_{saison}` ou redirige Accueil ; sur dashboard → Accueil.
- **navDeleteNotif / navDeleteConv / navClearAllDemandes / navDeleteReq** : suppressions individuelles.

---

## 🔑 localStorage (préfixe snm_)

`mode, auth, pseudo, status, active_trip_id, dashboards, fresh_trips, registered_members, notifs, date_from/to, search_hiver/search_ete, age_range, incoming_matches, validation_reqs, crewchat_{tripId}, crewlog_{tripId}, trip_overrides, merge_requests, messages, lieu, dispo_type, photos_{tripId}`

---

## ✨ Fonctionnalités dashboards (DOIVENT être identiques hiver/été)

- **Header data-driven** : nom, membres, dates, bouton ✏️ Modifier le crew (titre/lieu/dates)
- **Membres data-driven** : liste depuis `TRIP.memberKeys`, avatars via `avatarLetter()` (gère clés longues inc_/val_)
- **Chat persistant** : `smatchGetCrewChat`, bulles avec `word-break/overflow-wrap/white-space:pre-wrap`
- **Roadmap éditable** : ajout/suppression d'étapes, **picker d'icônes (14)**, zone Documents, **pièces jointes supprimables**
- **Onglet Journal (Log)** : trace modifs (titre/lieu/dates), ajout/retrait roadmap, arrivées/départs membres
- **Liste de courses data-driven** : avatars suivent les vrais membres
- **Station/météo** : valeurs réalistes pour crews frais

---

## 🌿 Workflow Git/Netlify

- Repo : `github.com/AkaglitchTV/SMATCH` · Site : `smatchs.netlify.app`
- Fichiers dans sous-dossier **`Smatch`** (S MAJUSCULE) sur GitHub → Netlify Base directory = `Smatch`
- Branches : `main` (prod) + `test` (bac à sable). Netlify "Branch deploys: All" activé.
- URL test : `test--smatchs.netlify.app`
- ⚠️ **Toujours uploader DANS le dossier `Smatch`** (entrer dedans avant Add file→Upload), sinon Netlify ne voit pas.
- Push test→main via Pull Request sur GitHub.
- Tout se fait dans le NAVIGATEUR (pas de Git installé, pas de droits admin).
- Note : l'antivirus du PC pro flagge le zip (FAUX POSITIF heuristique `MalUri.A!cl`). Code vérifié propre (aucun eval/document.write/atob/iframe). GitHub via navigateur contourne le problème.

---

## 🐛 Bugs résolus (pièges à retenir)

- **IDs Date.now() en boucle** → collision (même ms) → seulement 2/10 traités. Toujours ajouter un suffixe aléatoire.
- **overflow-x:hidden sur body** → casse `position:sticky` de la navbar. Utiliser `overflow-x:clip`.
- **Avatars inc_/val_** débordaient → `avatarLetter()` affiche l'initiale du nom.
- **Dashboards en Souvenirs** (dates passées) → createCrew reporte + flag fromMerge + navIsSouvenir.
- **Apostrophe double-échappée** (`\\'`) cassait nav.js → reformuler avec `\'`.
- **Chat notif écrasait l'historique** → chat persistant unifié smatchGetCrewChat.
- **Dashboard été pré-rempli** à la création → était hardcodé → rendu data-driven (renderMembersEte, renderChatEte, getMembersShop).
- **"Inviter tout le monde" cosmétique** → n'appelait pas SmatchMerge.send → corrigé.

---

*Dernière mise à jour : voir l'historique de conversation. Garder ce fichier synchro avec l'état réel du projet.*
