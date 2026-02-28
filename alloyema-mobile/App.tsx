import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import { SplashScreen } from './src/screens/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync, setupNotificationListeners } from './src/services/notifications';

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
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
