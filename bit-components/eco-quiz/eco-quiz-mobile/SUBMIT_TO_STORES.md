# 🚀 Guide de soumission — App Store & Google Play

## Prérequis

| Compte | Coût | Lien |
|---|---|---|
| Apple Developer | 99 $/an | https://developer.apple.com/account |
| Google Play Console | 25 $ (unique) | https://play.google.com/console |
| Expo (EAS) | Gratuit | https://expo.dev |

---

## Étape 1 — Installer EAS CLI

```bash
npm install -g eas-cli
eas login          # connecte ton compte Expo
```

---

## Étape 2 — Initialiser EAS dans le projet

```bash
cd eco-quiz/eco-quiz-mobile
eas init           # lie le projet à ton compte Expo
```

---

## Étape 3 — Builder pour les stores

```bash
# iOS (App Store) + Android (Google Play) en une commande :
eas build --platform all --profile production

# Ou séparément :
eas build --platform ios --profile production
eas build --platform android --profile production
```

EAS génère :
- Un fichier `.ipa` pour l'App Store (iOS)
- Un fichier `.aab` pour le Google Play Store (Android)

---

## Étape 4 — Mettre à jour eas.json

Ouvre `eas.json` et remplace :
- `VOTRE_APPLE_ID@email.com` → ton email Apple Developer
- `VOTRE_APP_STORE_CONNECT_APP_ID` → l'ID de ton app dans App Store Connect
- `VOTRE_TEAM_ID` → ton Team ID Apple (visible sur developer.apple.com)
- `./google-play-key.json` → ta clé de service Google Play (JSON téléchargeable depuis la console)

---

## Étape 5 — Soumettre aux stores

```bash
# Soumission automatique aux deux stores :
eas submit --platform all --profile production

# Ou manuellement :
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

---

## Étape 6 — Remplir les fiches store

Utilise le fichier `store-metadata.md` pour copier-coller :
- La description (courte + longue)
- Les mots-clés
- La classification d'âge : **4+ / Tout public**
- La catégorie : **Éducation**

---

## Délais de review

| Store | Délai moyen |
|---|---|
| App Store (Apple) | 1 à 3 jours ouvrés |
| Google Play | 4 à 8 heures |

---

## Quand remplacer les IDs de test AdMob

Dans `admob.ts`, remplace les `TestIds.REWARDED` par tes vrais Ad Unit IDs une fois ton compte AdMob approuvé :

```ts
export const REWARDED_AD_UNIT = {
  android: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ',
  ios:     'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
};
```

Et dans `app.json`, mets tes vrais App IDs AdMob à la place des IDs de test Google.
