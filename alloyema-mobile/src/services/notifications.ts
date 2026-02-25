import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
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
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'a80111af-a393-4469-9f2c-6fe811474987',
    })).data;

    return token;
  }

  return null;
}

export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) {
  const subscription1 = Notifications.addNotificationReceivedListener(notification => {
    onNotificationReceived?.(notification);
  });

  const subscription2 = Notifications.addNotificationResponseReceivedListener(response => {
    onNotificationResponse?.(response);
  });

  return () => {
    subscription1.remove();
    subscription2.remove();
  };
}

export async function sendLocalNotification(title: string, body: string, data?: any) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: data || {} },
    trigger: null,
  });
}

export async function scheduleNotification(
  title: string, 
  body: string, 
  trigger: Notifications.NotificationTriggerInput,
  data?: any
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: data || {} },
    trigger,
  });
}
