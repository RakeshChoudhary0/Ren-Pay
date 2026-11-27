/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './src/App';
import { name as appName } from './app.json';
import { createLanguageService } from 'typescript';
console.log("Hello")
setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
  console.log('Background message:', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
