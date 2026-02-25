import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { auth, db } from '../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with your Expo project ID
    })).data;

    // Save token to Firestore
    const user = auth.currentUser;
    if (user && token) {
      await setDoc(doc(db, 'users', user.uid), {
        pushToken: token,
        platform: Platform.OS,
        updatedAt: new Date(),
      }, { merge: true });
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) {
  // Listen for incoming notifications
  const subscription1 = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
    onNotificationReceived?.(notification);
  });

  // Listen for notification responses (user taps)
  const subscription2 = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response:', response);
    onNotificationResponse?.(response);
  });

  return () => {
    subscription1.remove();
    subscription2.remove();
  };
}

// Send local notification (for testing)
export async function sendLocalNotification(title: string, body: string, data?: any) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Send immediately
  });
}

// Schedule notification
export async function scheduleNotification(
  title: string, 
  body: string, 
  trigger: Notifications.NotificationTriggerInput,
  data?: any
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger,
  });
}
