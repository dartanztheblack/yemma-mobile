import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
// import { StripeProvider } from '@stripe/stripe-react-native'; // Désactivé pour Expo Go
import { AuthProvider } from './src/hooks/useAuth';
import { SplashScreen } from './src/screens/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync, setupNotificationListeners } from './src/services/notifications';

// Clé Stripe identique au site web alloyema.com
// const STRIPE_PUBLIC_KEY = 'pk_test_51SxmW8HMGhaLs9h1nO8RltwzDwaR80qNY0QjsM5YiiRMGhkEaJlQQqZwFmM8A0VnKBUEtglnRaIeR7XSvTScjEhk00JHi9iqab';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync();
    
    // Setup notification listeners
    const cleanup = setupNotificationListeners(
      (notification) => {
        console.log('Notification received:', notification);
      },
      (response) => {
        console.log('Notification tapped:', response);
      }
    );

    return cleanup;
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    // <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}> // Désactivé pour Expo Go
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    // </StripeProvider>
  );
}
