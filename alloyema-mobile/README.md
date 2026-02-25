# Yemma Mobile App

Application mobile React Native pour la plateforme Yemma - Cuisine authentique à domicile.

## 📱 Fonctionnalités

- 🔍 Recherche de Yemmas par catégorie
- 🗺️ Carte interactive pour trouver les Yemmas à proximité
- 💬 Messagerie intégrée
- 👤 Profil utilisateur
- ⭐ Système de notation et avis

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# Lancer sur iOS (nécessite macOS + Xcode)
npm run ios

# Lancer sur Android (nécessite Android Studio)
npm run android
```

## 📦 Build pour production

### Expo Build (EAS)

```bash
# Configurer EAS
npm install -g eas-cli
eas login

# Build iOS
 eas build --platform ios

# Build Android
eas build --platform android
```

## 🛠️ Technologies

- React Native
- Expo
- React Navigation
- React Native Maps
- Firebase (Auth + Firestore)
- TypeScript

## 📂 Structure

```
src/
├── navigation/    # Configuration de la navigation
├── screens/       # Écrans de l'app
├── components/    # Composants réutilisables
├── config/        # Configuration (Firebase, etc.)
├── types/         # Types TypeScript
└── utils/         # Utilitaires
```

## 📝 TODO

- [ ] Connecter Firebase Auth
- [ ] Connecter Firestore pour les Yemmas
- [ ] Implémenter la messagerie en temps réel
- [ ] Ajouter les images des Yemmas
- [ ] Système de commande et paiement
- [ ] Notifications push

---
Développé avec ❤️ pour alloyema.com
