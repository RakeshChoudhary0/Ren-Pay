import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useContext,
} from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '../Constants/keys';
import {
  getUserMMKv,
  setUserMMKv,
  clearUserStorage,
} from '../LocalStorage/UserStorage';
import API from '../API/api';
import { deleteToken, getToken, saveToken } from '../LocalStorage/keyStore';
import { createMMKV, MMKV } from 'react-native-mmkv';

const storage = createMMKV();
const HAS_LAUNCHED_KEY = 'has_launched_before';

interface AuthContextType {
  googleAuthentication: () => Promise<any>;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
  set_mpin: (value: string) => Promise<any>;
  authenticated: boolean;
  user: any;
  verifyPin: (value: string) => Promise<any>;
  loading: boolean;
}

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  forceCodeForRefreshToken: false,
  iosClientId: IOS_CLIENT_ID,
});

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<any>(() => getUserMMKv());
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(async () => {
    try {
      const tokens = await getToken();
      if (tokens?.refreshToken) {
        await API.post('auth/logout', {
          refreshToken: tokens.refreshToken,
        }).catch(() => {});
      }
    } catch (error) {
      console.log('Server logout failed or network offline');
    } finally {
      await deleteToken();
      clearUserStorage();
      setUser(null);
      setAuthenticated(false);
    }
  }, []);

  const getMe = useCallback(async () => {
    try {
      // 1. Check if this is a fresh app installation
      const hasLaunched = storage.getBoolean(HAS_LAUNCHED_KEY);

      if (!hasLaunched) {
        // Clear lingering Keychain tokens from previous installations
        await deleteToken();
        clearUserStorage();
        storage.set(HAS_LAUNCHED_KEY, true);
        setUser(null);
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const cachedUser = getUserMMKv();
      if (cachedUser) {
        setUser(cachedUser);
        console.log(cachedUser);
      }

      const tokens = await getToken();
      if (!tokens?.accessToken) {
        setUser(null);
        setUserMMKv(null);
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const res = await API.get('auth/me');
      if (res.status === 200 && res.data?.data) {
        const liveUserData = res.data.data;
        setUserMMKv(liveUserData);
        setUser(liveUserData);
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401 || status === 404) {
        await logout();
      } else if (!error.response) {
        console.log('App offline: using cached MMKV session data.');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    getMe();
  }, [getMe]);

  const googleAuthentication = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('Google Sign-In failed: No ID Token returned');
      }

      const res = await API.post('auth/google-oauth', { token: idToken });

      if (res.data?.accessToken && res.data?.refreshToken) {
        const { accessToken, refreshToken, data: userData } = res.data;
        await saveToken(accessToken, refreshToken);
        setUserMMKv(userData);
        setUser(userData);
        return res;
      } else {
        throw new Error('Authentication failed on server');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const set_mpin = async (mpin: string) => {
    try {
      const res = await API.post('auth/set-mpin', { mpin });
      if (res.data.success) {
        setUser(res.data.data);
        setAuthenticated(true);
        const tokens: any = await getToken();
        await saveToken(res.data.accessToken, tokens?.refreshToken);
      }
      return res;
    } catch (error) {
      console.error('Error setting MPIN:', error);
    }
  };

  const verifyPin = async (mpin: string) => {
    try {
      const res = await API.post('auth/verify-mpin', { mpin });
      if (res.data.success) {
        const tokens: any = await getToken();
        await saveToken(res.data.accessToken, tokens?.refreshToken);
        setAuthenticated(true);
        return res;
      }
      return res;
    } catch (error: any) {
      console.log('Verify PIN error:', error);
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        googleAuthentication,
        getMe,
        logout,
        set_mpin,
        authenticated,
        setAuthenticated,
        user,
        loading,
        verifyPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }
  return context;
};

export default useAuth;
