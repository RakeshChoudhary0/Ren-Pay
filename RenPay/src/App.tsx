import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './RootNavigator';

import { LogBox } from 'react-native';
import { AuthContextProvider } from './Extras/Context/AuthContext';
import { useNotification } from './Extras/Hook/useNotification';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
const messaging = getMessaging();
setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

LogBox.ignoreLogs(['Attempted to import the module']);

const App = () => {
  useNotification();
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <RootNavigator />
      </AuthContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
