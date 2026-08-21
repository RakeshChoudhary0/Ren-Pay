import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GoogleOAuth from './Authentication/Screens/GoogleOAuth';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './App/Home/Screens/HomePage';
import TermsAndConditions from './Authentication/Screens/TermsAndConditions';
import PasswordValidator from './Authentication/Screens/PasswordValidator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="PasswordValidator" component={PasswordValidator} />
        <Stack.Screen name="AuthPage" component={GoogleOAuth} />

        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default RootNavigator;
