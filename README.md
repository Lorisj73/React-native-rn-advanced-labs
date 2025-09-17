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
