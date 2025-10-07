# rn-advanced-labs

- **Version de Node recommandée**: Node.js 18 LTS ou 20 LTS
- **Commande de lancement**:

```bash
npx expo start
```

## 4️⃣ Organisation du code par TP

```text
rn-advanced-labs/
├─ app/
│  ├─ tp1-profile-card/
│  │   ├─ components/         # composants spécifiques au TP1
│  │   ├─ screens/            # écrans du TP1
│  │   └─ index.tsx           # point d'entrée du TP1
│  └─ ...
├─ App.tsx
└─ ...
```

Règles :

- **Un dossier par TP** (`tp1-profile-card`, `tp2-navigation`, etc.).
- `components/` et `screens/` dans chaque dossier.
- `index.tsx` exporte l’écran principal du TP.
- Pas encore de navigation : **dans le TP1, App.tsx importe directement l’écran TP1**.

## TP1 – Profile Card

- Lien vers le dossier du TP1: `app/tp1-profile-card/`
- Description: écran présentant une carte de profil avec photo, nom, fonction, bouton Follow/Following et compteur de followers (auto-incrément toutes les 5s).

### Arborescence actuelle du dossier `app/`

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    explore.tsx
    index.tsx
  index.tsx            # route d'accueil pointant vers tp1-profile-card
  modal.tsx
  tp1-profile-card/
    components/
      ProfileCard.tsx
    screens/
      ProfileCardScreen.tsx
    index.tsx
```

## Persistance de la navigation

- Ce qui est persistant:
  - L’état de navigation (dernière route ouverte et pile) est restauré automatiquement par Expo Router sur mobile si le système renvoie l’état lors du relancement de l’app.
  - Exemple attendu: si vous ouvrez Home → TP1 → Detail, fermez complètement l’app puis relancez, vous revenez sur Detail avec le bouton retour actif.

- Choix UX:
  - Onglets au niveau racine: `home`, `tp1-profile-card`.
  - Groupe `(main)` utilise un `Stack` avec header masqué par défaut; seul `detail/[id]` affiche un header (retour natif).
  - Route d’accueil forcée au premier lancement: `unstable_settings.initialRouteName = 'home'` dans `app/_layout.tsx`.
  - Les routes racines non souhaitées (`index`, `(auth)`, `(main)`) sont masquées des onglets.

Notes:
- Pour forcer systématiquement l’accueil à chaque lancement (sans restauration), conservez `initialRouteName: 'home'` et désactivez toute logique de restauration manuelle si ajoutée.
- Les liens typés vers les routes dynamiques utilisent `href={{ pathname: '/(main)/detail/[id]', params: { id } }}` pour satisfaire les types Expo Router.

## 9️⃣ Livrables

### ✅ Dépôt
- URL GitHub: <A RENSEIGNER>
- PR: <A RENSEIGNER>

### 📦 Packages installés (principaux) et rôle
| Package | Rôle |
|---------|------|
| expo | Runtime Expo (CLI, bundler, APIs) |
| react / react-native | Base UI framework |
| expo-router | Routing basé sur l’arborescence de fichiers |


### 🗂 Arborescence `app/` (groupes & écrans)
```text
app/
  _layout.tsx                  # Layout racine (Stack + persistance manuel pathname)
  (auth)/                      # (Prévu pour auth future – masqué)
    _layout.tsx
  (main)/                      # Groupe principal (onglets + écrans)
    _layout.tsx                # Tabs: home, tp1-profile-card (+ groupe detail masqué)
    home.tsx                   # Onglet Home
    tp1-profile-card.tsx       # Onglet TP1 (ProfileCard)
    (detail)/                  # Groupe de détail (masqué des Tabs)
      _layout.tsx              # Stack local avec header + bouton retour -> Home
      [id].tsx                 # Écran dynamique de détail avec validation ID
    tp2-navigation/            # Placeholder prochain TP
```


### 🗂 Arborescence détaillée (mise à jour)
```text
app/
  _layout.tsx
  (auth)/
    _layout.tsx
  (main)/
    _layout.tsx                 # Tabs: home, tp1-profile-card, TP3-forms
    home.tsx
    tp1-profile-card.tsx
    TP3-forms/
      _layout.tsx               # Stack local (Formik <-> RHF switch)
      formik/
        index.tsx
        components/
          TextField.tsx
        validation/
          schema.ts
      rhf/
        index.tsx
        components/
          TextField.tsx
        validation/
          schema.ts
    (detail)/
      _layout.tsx
      [id].tsx
    tp2-navigation/
components/
  ProfileCard.tsx
  themed-text.tsx
  themed-view.tsx
  ui/
    icon-symbol.tsx
constants/
  theme.ts
hooks/
  use-color-scheme.ts
```
Notes:
- Les sous-dossiers `formik/` et `rhf/` illustrent deux implémentations séparées du même formulaire (TP3).
- `_layout.tsx` dans `TP3-forms` fournit le header avec bouton de switch.
- Les composants transverses (themed-text, etc.) restent dans `components/` pour réutilisation.

### 🛣 Table des routes
| Nom fichier / Route name | URL effective | Params | Description |
|--------------------------|---------------|--------|-------------|
| (main)/home              | /home         | -      | Onglet d’accueil |
| (main)/tp1-profile-card  | /tp1-profile-card | -  | Onglet TP1 (ProfileCard) |
| (main)/(detail)/[id]     | /(detail)/:id (usage lien: `/(detail)/42`) | id:number | Détail avec validation numérique |
| (main)/TP3-forms/formik  | /TP3-forms/formik | - | Formulaire TP3 (Formik + Yup) |
| (main)/TP3-forms/rhf     | /TP3-forms/rhf | - | Formulaire TP3 (RHF + Zod) |

Notes:
- Les groupes `(main)` et `(detail)` sont ignorés dans l’URL finale réellement résolue par le runtime (segments "virtuels"), mais on les référence explicitement dans `href` pour cibler le fichier.
- Validation ID: chiffres uniquement (`/^\d+$/`). Sinon rendu 404 local + bouton retour Home.

### 🔄 Persistance navigation (implémentation)
- Stratégie manuelle ajoutée dans `app/_layout.tsx`:
  - Hook `usePathname()` + écoute des changements.
  - Sauvegarde AsyncStorage clé `LAST_VISITED_PATH`.
  - Au démarrage: lecture puis `router.replace(saved)` avant rendu principal.
  - Écran de chargement (ActivityIndicator) le temps de la restauration.
- Effet UX: l’utilisateur revient exactement sur la dernière page (ex: détail /42) même après fermeture complète (cold start).

### 🌡 Scénarios (froid / tiède / chaud)
| Scénario | Contexte | Comportement attendu |
|----------|----------|----------------------|
| Froid (cold start) | App complètement fermée | Lecture AsyncStorage → route restaurée (ex: /tp1-profile-card ou /42) |
| Tiède (warm) | App passée en arrière-plan quelques minutes | État mémoire conservé par le système → restauration native + notre mécanisme garde cohérent |
| Chaud (hot reload dev) | Reload Metro | Peut réinitialiser l’état JS → mécanisme AsyncStorage repositionne sur la dernière route |

### 🔗 Deep Linking (spécification cible)
Schéma proposé (app.json): `"scheme": "rnadvancedlabs"`.
Exemples de liens (à ajouter dans config si nécessaire):
| Lien | Ouvre |
|------|-------|
| rnadvancedlabs://home | Onglet Home |
| rnadvancedlabs://tp1-profile-card | Onglet TP1 |
| rnadvancedlabs://42 | Détail ID=42 |
| rnadvancedlabs://(detail)/123 | Détail (forme explicite de groupe) |

Pour tester (émulateur iOS): `xcrun simctl openurl booted "rnadvancedlabs://42"`.

### 🧪 Cas de test recommandés
1. Ouvrir /home → /tp1-profile-card → /(detail)/42, fermer l’app, relancer: revenir sur l’ID 42.
2. Ouvrir /(detail)/abc (ID invalide): voir écran 404 local + bouton retour.
3. Deep link rnadvancedlabs://tp1-profile-card depuis app fermée: arriver sur l’onglet TP1 (après configuration scheme).
4. Lancer hot reload: rester sur même route après restauration.

---
Fin section livrables.

## 5️⃣ Mesure & comparaison – TP3 Formik vs React Hook Form

Objectif: comparer les deux implémentations sur plusieurs axes (DX, perfs perçues, re-rendus, typage, verbosité, validation, bundle implicite).

### Méthodologie de mesure
1. Instrumentation re-rendus: ajout de `console.log('[Formik] render', fieldName)` / `console.log('[RHF] render', fieldName)` dans chaque composant de champ (TextField) ou directement dans le JSX du champ.
2. Saisie test: taper 6 caractères dans `displayName`, cocher/décocher la case, modifier `password` puis corriger `confirmPassword`.
3. Outil: Chrome / React Native Debugger (regarder timeline console) + React DevTools (Highlight updates pour écran). Aucune optimisation (memo) ajoutée afin d’observer le comportement par défaut.
4. Contexte: Build dev (Metro), device Android émulateur et iOS simulateur. Les chiffres sont indicatifs (variation ±1 selon timing du clavier).

### Résultats synthétiques observés
| Critère | Formik + Yup | React Hook Form + Zod | Commentaire |
|---------|--------------|-----------------------|-------------|
| Re-rendus par frappes (champ isolé) | 1 render champ + rerender parent formulaire (souvent 2 logs totaux) | 1 render champ (parent non rerendu) | RHF évite rerender global car dépilement contrôlé via refs internes + subscription |
| Re-rendus autres champs lors d’une frappe | Tous les champs Formik repassent souvent par le cycle (selon structure) | 0 (les autres inputs ne rerendent pas) | Avantage RHF sur performance / fluidité sur gros formulaires |
| Temps perçu validation live | Légèrement plus lent si schéma complexe (validation appelée sur setState) | Rapide (validation par resolver mais mise à jour ciblée) | Différence faible sur 5 champs, accrue si >20 champs |
| Intégration schéma | `validationSchema` direct, API courte | `zodResolver(schema)` (un import de plus) | Équivalence, Zod plus expressif pour raffinements composés |
| TypeScript (inférence) | `Yup.InferType<typeof schema>` OK mais moins strict (nullable implicite si pas `.required()`) | `z.infer<typeof schema>` strict + lit les refinements | Zod renvoie des types plus précis par défaut |
| Verbosité code formulaire |  ~120 lignes (Formik) | ~150 lignes (RHF) | RHF nécessite Controller + mapping erreurs manuels, mais peut être réduit avec composants abstraits |
| Imperatif focus chain | Via refs manuelles sur `onSubmitEditing` | Idem (refs) | Pas de différence significative |
| State inspection dev | Accès direct `values`, `errors`, `touched` dans un seul objet | `watch()`, `formState.errors`, `getValues()` | Formik plus plat pour introspection rapide, RHF plus segmenté |
| Gestion performance grandes formes | Besoin de `FastField`, `memo` ou field-level validation pour optimiser | Optimisé par défaut (subscription) | RHF scalable out-of-the-box |
| Bundle ajouté (indicatif) | Formik (~ small mais + logique state) + Yup (validation) | RHF (léger) + Zod (plus gros que Yup sur certaines builds) | Diff éligible au tree-shaking; dépend du nombre de règles |

### Logs d’exemple
Formik (extrait console):
```
[Formik] render email
[Formik] render password
[Formik] render confirmPassword
[Formik] render displayName  <-- chaque frappe
[Formik] render email        <-- rerender global cascade
```
RHF (extrait console):
```
[RHF] render displayName
[RHF] render displayName  <-- frappe suivante
```

### Analyse
- Sur un petit formulaire (5 champs) la différence de fluidité est quasi imperceptible, mais la console montre déjà la différence de diffusion des re-rendus.
- Formik reste très pédagogique (valeurs centralisées), idéal pour équipes débutantes.
- RHF devient rapidement préférable pour formulaires larges (dozens+ de champs, champs conditionnels, performance critique).
- Zod apporte une meilleure composition de validations complexes (refine, union) et un typage plus fiable que Yup (moins de `any`).

### Recommandations
| Contexte | Choix conseillé | Raison principale |
|----------|-----------------|-------------------|
| Petit formulaire statique | Formik | Simplicité DX / onboarding rapide |
| Formulaire moyen (10–20 champs) | RHF | Limiter re-rendus sans optimisation manuelle |
| Formulaire dynamique (champs conditionnels) | RHF | Subscription granulaire |
| Forte exigence typage TS | RHF + Zod | Inférence stricte |
| Migration existant équipe déjà Formik | Formik (puis RHF progressif) | Coût de formation |
| Besoin custom resolver (ex: lib interne) | RHF | API resolvers ouverte |


### Démonstration dans le dossier media-documentation

---
Fin section comparaison TP3.

## 7) Tests manuels

- Create :
  - succès → nouvel item apparaît immédiatement dans la liste (tri respecté),
  - échec (name dupliqué, year hors bornes, champs trop courts) → messages d’erreur, aucun ajout.
- Edit :
  - ouvrir un robot → modifier label et/ou type → sauvegarder → retour auto → item mis à jour sans reload.
  - tentative de changer name en un doublon → erreur affichée, valeurs conservées.
- Delete :
  - appui sur Delete → alerte confirmation → confirmer → item disparaît → feedback visuel (liste réordonnée).
- Persistance :
  - créer 2 robots → fermer totalement l’app → relancer → les 2 robots sont toujours présents.
- UX :
  - clavier n’écrase pas les champs ni le bouton (scroll auto vers champ suivant),
  - bouton submit désactivé tant que le formulaire est invalide,
  - focus / Next du clavier enchaîne bien Name → Label → Year → Type,
  - bouton toujours visible grâce au footer fixe.

## 8) Module Robots – Description détaillée du fonctionnement

Cette section documente précisément le module Robots (CRUD) : architecture, flux, règles métier, persistance et UX.

### 8.1 Flux utilisateur
1. Liste (onglet Robots) : affichage des robots triés (par nom ou année via toggle). Bouton flottant + pour créer.
2. Création : formulaire validé en temps réel. Bouton Créer activé uniquement si valide. Retour automatique vers la liste après succès (optimistic update immédiate).
3. Édition : accès via bouton Edit ou tap sur un item. Formulaire pré-rempli, même composant que la création (mode = 'edit').
4. Suppression : bouton Del → alerte de confirmation → suppression instantanée + re-tri dynamique.
5. Persistance : quitter / relancer l’app → les robots restent (storage AsyncStorage via middleware persist de Zustand).

### 8.2 Architecture technique
- Composants principaux :
  - RobotListItem : rendu d’un robot + actions locales.
  - RobotForm : unique formulaire réutilisé (create / edit) avec React Hook Form + Zod.
- Store global : store/robotStore.ts (Zustand) :
  - State : robots[], selectedId (optionnel).
  - Actions : create, update, remove, getById, clearAll.
  - Middleware : persist (createJSONStorage → AsyncStorage).
  - Validation métier côté store (double barrière : formulaire + store).
- Validation formulaire : validation/robotSchema.ts (Zod) + coercion du year.

### 8.3 Règles métier appliquées
- name : min 2 caractères, unique (comparaison case-insensitive). Testé avant insertion / update.
- label : min 3 caractères.
- year : entier entre 1950 et année courante (coercion depuis saisie texte → number ; revalidation dynamique).
- type : enum restreinte.
- Toute violation dans le store lève une Error attrapée dans RobotForm (affichage message + haptique erreur).

### 8.4 Unicité du name – double validation
- Côté UI : on valide la longueur seulement (unicité potentiellement ajoutable en live mais non indispensable).
- Côté store : test final avant persist, empêche collision en cas d’accès concurrent (théorique) ou bypass.

### 8.5 Persistance
- Zustand persist sérialise { robots, selectedId } sous la clé 'robots-store-v1'.
- Migrations : hook migrate prêt (placeholder) pour évoluer le format.
- ID : génération maison (timestamp + random base36) évite dépendance uuid et problèmes crypto sur certaines plateformes.

### 8.6 Navigation (Expo Router)
- Routes:
  - /(main)/tp4A-robots → liste.
  - /(main)/tp4A-robots/create → création (masquée de la barre d’onglets via href: null).
  - /(main)/tp4A-robots/edit/[id] → édition (masquée idem).
- Onglets parasites (create / edit / tp2-navigation) retirés avec options { href: null }.
- Retour : router.back() après succès create/update.

### 8.7 Formulaire & UX
- React Hook Form (mode onChange) + zodResolver.
- Auto-scroll / focus chain : Name → Label → Year → Type (Picker) → bouton footer.
- ScrollView + tracking positions (onLayout) pour aligner le champ courant dans la zone visible.
- KeyboardAvoidingView + footer fixe : bouton jamais masqué.
- Bouton désactivé tant que !isValid ou isSubmitting.
- Feedback succès : texte "Enregistré ✅" + haptique medium.
- Feedback erreur : message d’erreur + haptique error.

### 8.8 Tri dynamique
- State local sortBy (name | year).
- useMemo([...robots].sort(...)) pour recalculer uniquement quand robots ou critère changent.
- Re-tri automatique après chaque mutation (create/update/delete) grâce à dérivation du state robots.

### 8.9 Stratégie d’erreurs
- Form errors (validation schéma) : messages sous label.
- Erreurs métier store (unicité name) : catch → message global (boîte rouge) → n’affecte pas les autres champs.
- Aucune modale bloquante côté formulaire pour conserver la fluidité.

### 8.10 Séparation responsabilités
| Couche | Rôle |
|--------|------|
| Formulaire (RobotForm) | Gestion UI, validation de forme (types / limites), UX focus & scroll |
| Store (Zustand) | Source de vérité, persistance, règles métier finales, unicité name |
| Schéma Zod | Contrat d’entrée standardisé, coercion year |

### 8.11 Choix techniques & justifications
- Zustand + persist : léger, simple, évite boilerplate Redux / context.
- RHF + Zod : meilleure perf/rerenders pour mobile, typage strict, coercion intégrée.
- Pas de Controller RHF custom : champs simples (TextInput) suffisent, code plus clair pour apprentissage.
- ID custom vs uuid : supprime dépendance crypto non nécessaire.
- Double validation (UI + store) : robuste contre scénarios edge (ex: future import JSON / batch).

### 8.12 Limitations actuelles
- Pas de filtrage / recherche textuelle (ajout facile via state local et robots filtrés).
- Pas d’animation suppression (peut ajouter LayoutAnimation ou Reanimated plus tard).
- Pas de test automatisé (uniquement tests manuels documentés). 
- Unicité name non validée en direct tant que l’utilisateur n’a pas soumis (peut implémenter un watch + setError). 

### 8.13 Pistes d’amélioration
- Ajouter toast/snackbar global (expo-toast ou lib custom) pour succès/suppression.
- Ajouter mémorisation du dernier tri (persist local). 
- Intégrer un champ de recherche live (debounce) sur la liste.
- Internationalisation (fr/en) via i18n-js ou lingui.
- Tests unitaires du store (Jest) + tests E2E (Detox) pour les flux CRUD.

---
Fin section description détaillée Robots.

## TP4B – Module Robots (Redux Toolkit + Persist)

Cette section documente la variante Redux Toolkit (comparative à la version Zustand TP4A).

### 1. Objectifs
- Reproduire le CRUD Robots avec Redux Toolkit + redux-persist.
- Montrer les différences structurelles vs Zustand (organisation slice, selectors mémorisés, middleware).
- Introduire un thunk asynchrone (saveRobotAsync) pour illustrer un flux async (simulateur de latence 500 ms – non encore branché au formulaire mais prêt à l'emploi).

### 2. Dépendances & rôles
| Package | Rôle | Notes |
|---------|------|-------|
| @reduxjs/toolkit | Configuration store, createSlice, createAsyncThunk | Simplifie reducers & immutabilité via immer |
| react-redux | Hooks useSelector / useDispatch typés | Fournit le Provider racine |
| redux-persist | Persistance robots[] dans AsyncStorage | Clé: root – whitelist:['robots'] |
| @react-native-async-storage/async-storage | Backend stockage persistant | Utilisé aussi par Zustand dans TP4A |
| react-hook-form + zod | Même stack formulaire que TP4A (réutilisation RobotForm) | Validation instantanée |
| react-native-safe-area-context | Gestion SafeArea (liste Robots RTK) | Pour éviter chevauchement status bar |

(Remarque: uuid est présent dans package.json mais n'est plus utilisé en TP4B – ID custom generateId(), on peut retirer la dépendance.)

### 3. Arborescence spécifique
```text
features/
  robots/
    robotsSlice.ts      # Slice RTK + reducers CRUD + thunk saveRobotAsync
    selectors.ts        # Sélecteurs mémorisés (tri nom / année + factory)
app/
  store.ts              # configureStore + persistReducer + serializableCheck off (persist)
  rootReducer.ts        # combineReducers({ robots })
  (main)/tp4b-robots-rtk/
    index.tsx           # Liste + toggle tri (Nom / Année)
    create.tsx          # Formulaire mode create
    edit/[id].tsx       # Formulaire mode edit
```

### 4. Routes
| Fichier | Route | Visible onglet | Description |
|---------|-------|----------------|-------------|
| (main)/tp4b-robots-rtk/index.tsx | /tp4b-robots-rtk | Oui (label: Robots RTK) | Liste triable |
| (main)/tp4b-robots-rtk/create.tsx | /tp4b-robots-rtk/create | Non (href null) | Création |
| (main)/tp4b-robots-rtk/edit/[id].tsx | /tp4b-robots-rtk/edit/:id | Non | Édition |

### 5. State & reducers (résumé logique)
State robotsSlice:
```ts
interface RobotsState {
  items: Robot[];
  saving: boolean;   // (réservé pour usage futur avec saveRobotAsync)
  error?: string | null;
}
```
Actions synchrones:
- createRobot(Robot) : validation + unicité name (case-insensitive) → push.
- updateRobot({id, changes}) : validation + collision name.
- deleteRobot(id).
- clearAll().

Thunk:
- saveRobotAsync({ id?, data }): simule une sauvegarde asynchrone (500 ms) puis dispatch create/update.

### 6. Validation (double couche)
Même règles que TP4A :
- name: min 2 caractères, unique (case-insensitive).
- label: min 3 caractères.
- year: entier entre 1950 et année courante.
- type: enum ('industrial' | 'service' | 'medical' | 'educational' | 'other').

Couches:
1. Formulaire (Zod) : feedback immédiat champ par champ.
2. Slice (assertValid + vérif unicité) : filet de sécurité (empêche contournement via dispatch manuel / import batch futur).

### 7. Stratégie d'ID
- Abandon de uuid (nécessite crypto.getRandomValues sur certaines plateformes) → generateId() (timestamp + random base36) suffisant pour identifiants locaux.

### 8. Sélecteurs & Tri
Selectors:
- selectRobots : liste brute.
- selectRobotById(id).
- selectRobotsSortedByName / selectRobotsSortedByYear.
- makeSelectRobotsSorted(sort) : factory permettant un mémo par instance d'écran selon critère ('name' | 'year').

UI liste:
- Toggle de tri (Nom / Année) barre pill.
- SafeAreaView + padding top pour éviter dépassement en haut (status bar / notch).

### 9. Formulaire (RobotForm réutilisé)
- Mode 'create' ou 'edit' (prop mode + robotId).
- RHF mode: onChange → bouton (Créer / Mettre à jour) activé seulement si form valide.
- Navigation focus: Name → Label → Year → Type (Picker) → Submit.
- Scroll assisté sur focus + footer fixe.
- Haptics succès / erreur (expo-haptics).

### 10. Différences clés RTK vs Zustand (dans ce projet)
| Aspect | Zustand (TP4A) | RTK (TP4B) |
|--------|----------------|------------|
| Boilerplate | Minimal (store inline) | Slice + rootReducer + store + persist config |
| Persistance | Middleware persist (Zustand) | redux-persist + wrapper reducer |
| Async flow exemple | Non (create/update sync) | Thunk saveRobotAsync disponible |
| Sélecteurs mémo | Optionnel (non utilisé) | createSelector pour tri stable |
| Ergonomie devtools | Simple (log state) | Redux DevTools possible (web) |
| Apprentissage | Rapide | Plus formel (actions/types) |

### 11. Tests manuels exécutés (résultats)
| Cas | Étapes | Résultat |
|-----|--------|----------|
| Create succès | Ouvrir + → remplir valeurs valides → Créer | Robot ajouté, tri réappliqué, message "Enregistré ✅" |
| Create échec name dupliqué | Créer A puis recréer A | Message erreur "Name déjà utilisé", pas d'ajout |
| Create échec year invalide | Year = 1900 | Erreur validation (bouton désactivé tant que non corrigé) |
| Edit succès | Tap robot → modifier label → Mettre à jour | Retour auto, item mis à jour (ordre tri éventuellement changé) |
| Edit collision name | Editer robot B en nom déjà existant A | Erreur store capturée, valeurs conservées |
| Delete | Bouton Delete item (Zustand version) / (RTK version via ajout futur) | Suppression OK (RTK: deleteRobot à ajouter sur item si besoin) |
| Persist | Créer 2 robots → fermer complètement → relancer | Les 2 présents (redux-persist) |
| Tri | Basculer Nom ⇄ Année | Liste réordonnée instantanément |
| Safe Area | Ouvrir liste sur appareil notch | Aucune superposition en haut |

(Remarque: suppression côté RTK utilise actuellement RobotListItem commun si relié à deleteRobot – si non encore branché, ajouter dispatch deleteRobot.)

### 12. Améliorations futures
- Connecter saveRobotAsync au formulaire pour afficher état saving + loader.
- Ajout deleteRobot dans la version RTK (si absent) avec confirmation Alert.
- Recherche textuelle + mémo (selector paramétré). 
- Tests unitaires slice (création, update, collisions) via Jest.
- Suppression dépendance uuid dans package.json (npm remove uuid).
- Internationalisation labels tri & messages.
- Intégrer toast global (succès / suppression) pour cohérence UX.

### 13. Commandes utiles
```
# Lancer (reset cache) :
npx expo start -c
# Retirer uuid (optionnel après merge):
npm remove uuid
```

---
Fin section TP4B.

## 10) Tests manuels (détaillés)

1) Migrations (001 → 002 → 003)
- Pré-requis: aucune donnée (désinstaller Expo Go ou Dev Menu → Clear data for experience), puis relancer l’app.
- Étapes:
  - Premier lancement: la base est créée (v1: table robots). Créer 1 robot de test (ex: "Alpha").
  - Relancer l’app (cold start) pour s’assurer que les migrations s’appliquent séquentiellement (002 index, 003 colonne archived).
- Attendu:
  - L’app fonctionne sans crash ni réinitialisation des données.
  - Les robots créés avant migrations sont toujours visibles.
  - Optionnel: Exporter JSON et vérifier que chaque robot inclut archived (0/1) dans les données (si présent dans l’export selon implémentation).
- Conseils:
  - Si vous obtenez un écran vide, supprimer les données de l’expérience et relancer.

2) CRUD complet
- Créer:
  - Ouvrir + → saisir Name: "R2D2", Label: "Astromech", Year: 1977, Type: service → Créer.
  - Attendu: item apparaît en liste, tri respecté.
- Modifier:
  - Ouvrir R2D2 → changer Label: "Astromech Droid", Year: 1978 → Mettre à jour.
  - Attendu: retour auto, valeurs mises à jour en liste.
- Supprimer:
  - Sur l’item, tap "Del" → confirmer.
  - Attendu: l’item disparaît, la liste se re-trie si besoin.
- Erreurs attendues:
  - Name dupliqué: message d’erreur, aucune création.
  - Year hors limites: validation bloque le submit.

3) Persistance
- Étapes:
  - Créer 2 robots.
  - Fermer complètement l’app (tuer Expo Go), relancer via `npx expo start -c` puis réouvrir.
- Attendu: les 2 robots sont toujours affichés, sans action manuelle.

4) Export JSON
- Pré-requis: au moins 1 robot dans la liste.
- Étapes:
  - Tap "Export JSON".
  - Une alerte affiche le chemin du fichier créé (file://…).
- Attendu:
  - Aucune erreur. L’alerte montre un chemin valide (documentDirectory ou cacheDirectory selon plateforme).
  - Contenu: un objet avec "robots": [ … ]. La taille/longueur correspond aux robots affichés.
- Vérifications rapides:
  - Réexporter une seconde fois → un nouveau fichier est généré (nom daté différent).

5) (Bonus) Import JSON
- Pré-requis: un fichier précédemment exporté.
- Étapes:
  - Tap "Import JSON" → choisir le fichier exporté via le sélecteur.
- Attendu:
  - Message succès indiquant le nombre d’entrées traitées.
  - Si un robot a le même name (insensible à la casse), ses champs (label/year/type) sont mis à jour, pas de doublon créé.
  - Sinon, un nouveau robot est ajouté.
- Erreurs possibles:
  - Fichier invalide: alerte "Import échoué" avec le détail.

---
Fin section tests manuels détaillés.

## TP6 — Camera (capture, stockage local, galerie)

0) Pré-requis & périmètre
- Projet Expo + Expo Router opérationnel.
- Pas d’enregistrement dans la galerie système (on reste dans l’app: DocumentDirectory / cache).
- Pas de back-end: 100% offline/local.

1) Dépendances
- expo-camera: accès caméra, aperçu temps réel, capture d’images, gestion des permissions caméra au runtime.
- expo-file-system: lecture/écriture/suppression de fichiers dans le sandbox de l’app (ex: documentDirectory/photos/).
- (Optionnel) expo-media-library: permet d’enregistrer aussi dans la galerie système. Non requis pour ce TP.

2) Permissions
- iOS: NSCameraUsageDescription dans app.json/app.config.ts pour expliquer l’usage.
- Android: permission CAMERA déclarée dans la config.
- Runtime: demander au moment d’entrer sur l’écran Caméra. En cas de refus: UI explicite + bouton “Ouvrir les réglages”.

3) Architecture
app/(main)/TP6-camera/
  index.tsx            # Galerie (grille de miniatures)
  camera.tsx           # Écran de prise de vue
  detail/[id].tsx      # Détail (afficher, supprimer, partager)
  lib/
    camera/
      storage.ts       # savePhoto, listPhotos, getPhoto, deletePhoto
      types.ts         # type Photo: { id, uri, createdAt, size? }
    hooks/
      useCameraPermission.ts # hook permission caméra

Contraintes
- Aucun accès direct à FileSystem depuis les écrans: passer par lib/camera/storage.ts.
- Les écrans gèrent l’UI/flux, pas l’IO.

4) Capture & enregistrement local
- Caméra: aperçu temps réel, bascule avant/arrière, bouton capture.
- Après capture: copie du fichier vers photos/ avec un nom photo_<timestamp>.jpg puis retour vers la Galerie + feedback.
- Métadonnées minimales: id (nom sans extension), uri, createdAt (timestamp), size (bytes si dispo).

5) Galerie (liste)
- Scanne le dossier photos/ pour lister les fichiers image.
- Grille responsive de miniatures. Tap → Détail (/TP6-camera/detail/[id]).
- Bouton “Prendre une photo” → /TP6-camera/camera.
- Pull-to-refresh (ou bouton) pour rescanner.

Critères d’acceptation
- La galerie se met à jour automatiquement après une capture (retour de l’écran Caméra).
- Les miniatures s’affichent sans bloquer l’UI (si besoin: images compressées/cache).

### 9) Qualité & architecture

- Service unique de stockage: app/(main)/TP6-camera/lib/camera/storage.ts
  - API exposée:
    - ensureDir(): prépare le dossier local photos/ (création récursive).
    - savePhoto(base64|tempUri): enregistre une photo depuis une URI temporaire (file://) ou un payload base64. Retourne Photo { id, uri, createdAt, size, source }.
    - listPhotos(): liste les photos locales triées par date desc.
    - getPhoto(id): récupère une photo locale par id.
    - deletePhoto(id): supprime physiquement le fichier (idempotent).
    - (optionnel librairie) listLibraryPhotos(), getLibraryPhoto(id), deleteLibraryPhoto(id).
  - Aucun accès direct à FileSystem depuis l'UI; les écrans consomment uniquement ces fonctions.

- Gestion des erreurs (StorageError):
  - WRITE_FAILED: "Impossible de préparer le dossier" / "Échec d'enregistrement de la photo (espace disque insuffisant ou fichier source invalide)".
  - READ_FAILED: "Lecture de la galerie échouée" / "Photo enregistrée mais lecture des métadonnées échouée".
  - DELETE_FAILED: "Suppression échouée".
  - Les écrans attrapent et affichent les messages via Alert (ex: Galerie: Erreur; Caméra: Capture échouée; Détail: Suppression échouée).

- Chemins de fichiers:
  - Centralisés dans storage.ts (PHOTOS_DIR). L’UI n’utilise aucun chemin en dur.

- Permissions & limites d’exécution:
  - Caméra: demandée à l’entrée de l’écran.
  - Photothèque (Android 13+): granularPermissions=['photo'].
  - Expo Go Android: l’accès complet librairie est désactivé (message explicite); utiliser un Development Build pour tester.

## 10) Tests manuels — à décrire dans le README

1) Permissions
- Ouvrir “TP6 Camera” → “Prendre une photo”.
- Refuser la permission: afficher l’UI explicite (texte + boutons Autoriser / Réglages).
- Accepter la permission: la prévisualisation caméra s’affiche et les boutons sont cliquables.

2) Capture
- Depuis l’écran Caméra, prendre 2 photos.
- Retour automatique vers la Galerie: les 2 miniatures sont visibles et triées (la plus récente en premier).

3) Détail
- Taper une miniature → ouvrir l’écran Détail.
- Vérifier l’affichage: photo plein écran + métadonnées (ID/nom, date, taille si dispo).

4) Suppression
- Dans Détail, appuyer “Supprimer” → confirmer.
- Retour Galerie: la miniature a disparu.
- Relancer la liste (pull-to-refresh): la photo n’est plus listée (fichier supprimé).

5) Persistance
- Fermer complètement l’app, puis relancer.
- Ouvrir “TP6 Camera”: les photos précédemment enregistrées sont toujours listées.

6) (Optionnel) Partage / Enregistrement dans la galerie système
- Partage: bouton “Partager” → vérifier que la feuille de partage s’ouvre et que l’action aboutit.
- Enregistrement (si activé): sauvegarder dans la galerie système et vérifier la présence dans Photos (nécessite permissions Media Library et build de dev sur Android).

---
Fin section tests manuels TP6.
