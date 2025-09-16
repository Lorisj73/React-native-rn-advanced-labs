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
