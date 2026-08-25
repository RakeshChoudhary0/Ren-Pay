import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export interface UserItem {
  id: string;
  avatar: string;
  email: string;
}

// 2. Define all routes and their params
export type RootStackParamList = {
  AuthPage: undefined;
  TermsAndConditions: undefined;
  MpinRegistration: undefined;
  PasswordValidator: undefined;
  Home: undefined;
  Payment: { item: UserItem };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export type PaymentRouteProp = RouteProp<RootStackParamList, 'Payment'>;
