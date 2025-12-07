import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
}

export async function scheduleEventNotifications(
  id: string,
  title: string,
  targetDate: Date
): Promise<string[]> {
  const notificationIds: string[] = [];
  const now = new Date();

  // Helper to schedule
  const schedule = async (triggerDate: Date, body: string) => {
    if (triggerDate > now) {
      const notifId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Upcoming Event: " + title,
          body: body,
          sound: true,
        },
        trigger: triggerDate as any,
      });
      notificationIds.push(notifId);
    }
  };

  // 24 hours before
  const oneDayBefore = new Date(targetDate.getTime() - 24 * 60 * 60 * 1000);
  await schedule(oneDayBefore, "Event is in 24 hours.");

  // 1 hour before
  const oneHourBefore = new Date(targetDate.getTime() - 60 * 60 * 1000);
  await schedule(oneHourBefore, "Event is in 1 hour.");

  // Exact time
  await schedule(targetDate, "Event is happening now!");

  return notificationIds;
}

export async function cancelEventNotifications(notificationIds: string[]) {
  for (const id of notificationIds) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}
