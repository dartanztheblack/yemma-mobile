# Déploiement Yemma Mobile

## Prérequis

1. **Compte Firebase** : https://console.firebase.google.com
2. **Compte Stripe** : https://dashboard.stripe.com
3. **Compte Expo** (optionnel) : https://expo.dev

---

## Configuration Firebase

### 1. Activer les services Firebase

Dans la console Firebase (projet `hallo-yema`) :

1. **Authentication** → Activer Email/Password
2. **Firestore Database** → Créer la base (mode test)
3. **Storage** → Activer
4. **Cloud Messaging** → Activer

### 2. Configurer Firebase Functions

```bash
cd functions
npm install
firebase login
firebase use --add  # Sélectionner hallo-yema
```

### 3. Configurer Stripe

```bash
# Dans la console Firebase
firebase functions:config:set stripe.secret="sk_test_..." stripe.webhook_secret="whsec_..."
```

### 4. Déployer les functions

```bash
firebase deploy --only functions
```

---

## Configuration Stripe

### 1. Clés API

- **Publishable key** (client) : `pk_test_...` ou `pk_live_...`
- **Secret key** (server) : `sk_test_...` ou `sk_live_...`
- **Webhook secret** : `whsec_...`

### 2. Webhook Stripe

URL webhook : `https://us-central1-hallo-yema.cloudfunctions.net/stripeWebhook`

Events à écouter :
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

---

## Build et Publication

### Android

```bash
cd ..
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
# APK dans : android/app/build/outputs/apk/release/
```

Pour Google Play Store :
```bash
./gradlew bundleRelease
# AAB dans : android/app/build/outputs/bundle/release/
```

### iOS

Nécessite un Mac + Xcode

```bash
npx expo prebuild --platform ios
cd ios
xcodebuild -scheme Yemma archive
```

---

## Structure des collections Firestore

```
users/
  {uid}/
    email: string
    pushToken: string
    stripeCustomerId: string

yemmas/
  {id}/
    name: string
    specialty: string
    pushToken: string
    location: geopoint

orders/
  {id}/
    userId: string
    yemmaId: string
    amount: number
    commission: number
    deliveryFee: number
    total: number
    paymentIntentId: string
    status: 'pending' | 'paid' | 'preparing' | 'delivering' | 'completed' | 'failed'
    createdAt: timestamp

messages/
  {conversationId}/
    messages/
      {id}/
        text: string
        imageUrl: string
        senderId: string
        timestamp: timestamp
```

---

## Fonctionnalités

- ✅ Auth Firebase (email/password)
- ✅ Chat temps réel avec photos
- ✅ Paiement Stripe (10% commission)
- ✅ Push notifications
- ✅ Géolocalisation
- ✅ Upload images Firebase Storage

---

## Support

Contact : support@alloyema.com
