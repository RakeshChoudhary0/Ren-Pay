import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export interface UserItem {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

// 2. Define all routes and their params
export type RootStackParamList = {
    Home: undefined;
    Payment: UserItem;
    MpinVerification: undefined;
    More: undefined;
    PaymentResult: undefined;
    PasswordValidator: { pendingReceiver?: UserItem } | undefined;
    MpinRegistration: undefined;
    AuthPage: undefined;
    TermsAndConditions: undefined;
    QR: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export type PaymentRouteProp = RouteProp<RootStackParamList, 'Payment'>;
