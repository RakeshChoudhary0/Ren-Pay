import { PermissionsAndroid } from 'react-native';

import {
  getMessaging,
  onMessage,
  onRegistered,
  register,
} from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { displayNotification } from './displayNotification';

const requestUserPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  if (granted == PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Notification Permission Granted');
  } else {
    console.log('Notification Permission Denied');
  }
};

async function getToken() {
  try {
    const messaging = getMessaging();

    const unsubscribe = onRegistered(messaging, installationId => {
      console.log('Registered with FID:', installationId);
    });

    await register(messaging);
  } catch (error: any) {
    console.log('SOME THING HAPPEND IN GET TOKEN FUNCTION :', error.message);
  }
}

export const useNotification = () => {
  useEffect(() => {
    requestUserPermission();
    getToken();

    const messaging = getMessaging();
    const unsubscribeOnMessage = onMessage(messaging, async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      await displayNotification(remoteMessage);
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);
};
