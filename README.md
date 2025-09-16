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
Les groupes entre parenthèses ne génèrent pas de segment d’URL.

### 🛣 Table des routes
| Nom fichier / Route name | URL effective | Params | Description |
|--------------------------|---------------|--------|-------------|
| (main)/home              | /home         | -      | Onglet d’accueil |
| (main)/tp1-profile-card  | /tp1-profile-card | -  | Onglet TP1 (ProfileCard) |
| (main)/(detail)/[id]     | /(detail)/:id (usage lien: `/(detail)/42`) | id:number | Détail avec validation numérique |

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

### 🖼 Captures / Vidéo
- Ajouter: (1) Tabs, (2) Détail avec ID, (3) Vue 404, (4) Restauration après fermeture, (5) Deep link.

---
Fin section livrables.
