import notifee, { AndroidImportance } from '@notifee/react-native';

export async function displayNotification(remoteMessage: any) {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  const title =
    (remoteMessage.data?.title as string) ||
    remoteMessage.notification?.title ||
    'New Notification';
  const body =
    (remoteMessage.data?.body as string) ||
    remoteMessage.notification?.body ||
    '';

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      smallIcon: 'ic_launcher_round', // White monochrome status bar icon
      largeIcon: 'ic_launcher', // Full-color logo in res/drawable/app_logo.png
      pressAction: {
        id: 'default',
      },
    },
  });
}
