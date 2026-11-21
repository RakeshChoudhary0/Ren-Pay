import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import GoogleOAuth from './Authentication/Screens/GoogleOAuth';
import {
  createNavigationContainerRef,
  getStateFromPath,
  NavigationContainer,
} from '@react-navigation/native';
import HomePage from './App/Home/Screens/HomePage';
import TermsAndConditions from './Authentication/Screens/TermsAndConditions';
import PasswordValidator from './Authentication/Screens/PasswordValidator';
import { MpinRegisterPage } from './Authentication/Screens/MpinRegisterPage';
import useAuth from './Extras/Context/AuthContext';
import Payment from './App/Payment/Screens/Payment';
import MoreScreen from './App/More/MoreScreen';
import MpinVerification from './App/Payment/Screens/MpinVerification';
import PaymentResultScreen from './App/Payment/Screens/PaymentResultScreen';
import { UserItem } from './App/type';
import QR from './App/Payment/Screens/QR';
import { RootStackParamList } from './App/type'


const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

let pendingReceiver: UserItem | null = null;

export const setPendingReceiver = (receiver: UserItem | null) => {
  pendingReceiver = receiver;
};

export const consumePendingReceiver = (): UserItem | null => {
  const receiver = pendingReceiver;
  pendingReceiver = null;
  return receiver;
};

const buildReceiverFromParams = (
  raw: Record<string, unknown> | undefined,
): UserItem => {
  const data = (raw || {}) as Record<string, string | undefined>;
  const email = (data.email || '').trim();
  const name =
    (data.name || '').trim() ||
    (email ? email.split('@')[0] : 'Receiver');

  return {
    id: data.id ? String(data.id).trim() : '',
    name,
    email,
    avatar: data.avatar ? String(data.avatar).trim() : '',
  };
};

const LinkingConfiguration = {
  prefixes: ['renpay://'],
  config: {
    screens: {
      Payment: 'pay',
    },
  },
  getStateFromPath(path: any, options: any) {
    const normalizedPath =
      typeof path === 'string' ? path.replace(/^\/+/, '') : path;
    const state = getStateFromPath(normalizedPath, options);
    console.log('[DeepLink] raw path:', path, 'state:', JSON.stringify(state));
    if (!state) return undefined;

    return {
      ...state,
      routes: state.routes.map(route => {
        if (route.name !== 'Payment') {
          return route;
        }

        const receiver = buildReceiverFromParams(
          route.params as Record<string, unknown> | undefined,
        );
        setPendingReceiver(receiver);

        return {
          ...route,
          params: { ...receiver },
        };
      }),
    };
  },
};

const RootNavigator = () => {
  const { user, authenticated, loading } = useAuth();
  const wasAuthenticatedRef = useRef(false);

  useEffect(() => {
    const isNowAuthenticated = Boolean(user) && authenticated && !loading;
    const justAuthenticated = isNowAuthenticated && !wasAuthenticatedRef.current;
    wasAuthenticatedRef.current = isNowAuthenticated;

    if (!justAuthenticated) return;

    const receiver = consumePendingReceiver();
    if (!receiver) return;

    const timer = setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('Payment', { ...receiver });
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [user, authenticated, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      onReady={() => {
        if (user && authenticated && !loading) {
          const receiver = consumePendingReceiver();
          if (receiver) {
            navigationRef.navigate('Payment', { ...receiver });
          }
        }
      }}
    >
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
                <Stack.Screen
                  name="MpinVerification"
                  component={MpinVerification}
                />
                <Stack.Screen name="More" component={MoreScreen} />
                <Stack.Screen
                  options={{
                    gestureEnabled: false,
                  }}
                  name="PaymentResult"
                  component={PaymentResultScreen}
                />
                 <Stack.Screen name="QR" component={QR} />
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
