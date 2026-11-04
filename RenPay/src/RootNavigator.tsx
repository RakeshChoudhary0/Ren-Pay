import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import GoogleOAuth from './Authentication/Screens/GoogleOAuth';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './App/Home/Screens/HomePage';
import TermsAndConditions from './Authentication/Screens/TermsAndConditions';
import PasswordValidator from './Authentication/Screens/PasswordValidator';
import { MpinRegisterPage } from './Authentication/Screens/MpinRegisterPage';
import useAuth from './Extras/Context/AuthContext';
import Payment from './App/Payment/Screens/Payment';
import MoreScreen from './App/More/MoreScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, authenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {user ? (
          <>
            {user.mpin == null && (
              <Stack.Screen
                name="MpinRegistration"
                component={MpinRegisterPage}
              />
            )}

            {authenticated ? (
              <>
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="Payment" component={Payment} />
                <Stack.Screen name="More" component={MoreScreen} />
              </>
            ) : (
              <Stack.Screen
                name="PasswordValidator"
                component={PasswordValidator}
              />
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="AuthPage" component={GoogleOAuth} />
            <Stack.Screen
              name="TermsAndConditions"
              component={TermsAndConditions}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});

export default RootNavigator;
