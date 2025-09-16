# Journal des prompts

## 2025-09-16
Y, j'aimerais que tu me refasse ce readme avec ces instructions : 

5. Rédigez un **README.md** minimal avec :
    - Nom du projet
    - Version de Node recommandée
    - Commandes de lancement (`npx expo start`)
    - Rappel de la structure attendue (voir ci-dessous)

Egalement, j'aimerais qu'a partir de maintenant, tu me créé un fichier nommé prompt.md, et que pour chaque prompt que je te fait tu y enregistre dans ce fichier

---

Nouvelle demande:

J'avais oublié de te donner la structure attendue, la voila, met a jour : ## 4️⃣ Organisation du code par TP

**Tout au long du cours, chaque TP doit être rangé dans un dossier dédié**.

Arborescence attendue après le TP1 :

```
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

---

Nouvelle demande:

## 5️⃣ Contenu du TP1 – Profile Card

Dans le dossier `app/tp1-profile-card/` :

1. **Écran principal** : une carte de profil affichant :
    - une photo (image en ligne au choix)
    - un nom et une fonction
    - un bouton **Follow**
    - un compteur de **followers**

Fait moi ca et explique moi le code en le commentant bien

---

Nouvelle demande:

Alors j'ai anulé, fait le dans ce fichier App.tsx 

---

Nouvelle demande:

J'ai ce message qui s'affiche, j'ai l'impression qu'il utilise expo-router par defaut, c'est possible de le contourner ?

---

Nouvelle demande:

attend refait les modifs que tu avais faites la, j'ai remis le dossier tabs
