import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './RootNavigator';

import { LogBox } from 'react-native';
import { AuthContextProvider } from './Extras/Context/AuthContext';

LogBox.ignoreLogs(['Attempted to import the module']);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <RootNavigator />
      </AuthContextProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
