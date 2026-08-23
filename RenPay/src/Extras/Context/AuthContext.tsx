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
import {
  deleteMpin,
  deleteToken,
  getMpin,
  getToken,
  saveMpin,
  saveToken,
} from '../LocalStorage/keyStore';

interface AuthContextType {
  googleAuthentication: () => Promise<any>;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
  authenticated: boolean;
  user: any;
  mpin: string;
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
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const [user, setUser] = useState<any>(() => getUserMMKv());
  const [mpin, setMpin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  console.log(user);
  useEffect(() => {
    const loadCachedMpin = async () => {
      const cachedMpin = await getMpin();
      if (cachedMpin) {
        setMpin(cachedMpin);
      }
    };
    loadCachedMpin();
  }, []);

  const logout = useCallback(async () => {
    try {
      const tokens = await getToken();
      if (tokens?.refreshToken) {
        // Invalidate refresh token on backend
        await API.post('auth/logout', {
          refreshToken: tokens.refreshToken,
        }).catch(() => {});
      }
    } catch (error) {
      console.log('Server logout failed or network offline');
    } finally {
      // Purge local storage regardless of network state
      await deleteToken();
      await deleteMpin();
      clearUserStorage();

      setUser(null);
      setMpin('');
    }
  }, []);

  const getMe = useCallback(async () => {
    try {
      const tokens = await getToken();
      const cachedUser = getUserMMKv();

      if (cachedUser) {
        setUser(cachedUser);
      }

      if (!tokens?.accessToken) {
        setUser(null);
        setUserMMKv(null);
        setLoading(false);
        return;
      }

      const res = await API.get('auth/me');

      if (res.status === 200 && res.data?.data) {
        const liveUserData = res.data.data;
        setUserMMKv(liveUserData);
        setUser(liveUserData);

        if (liveUserData.mpin) {
          await saveMpin(liveUserData.mpin);
          setMpin(liveUserData.mpin);
        }
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
    let res;
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('Google Sign-In failed: No ID Token returned');
      }

      // Backend expects 'token' in req.body

      res = await API.post('auth/google-oauth', { token: idToken });

      if (res.data?.access_token && res.data?.refresh_token) {
        const { access_token, refresh_token, data: userData } = res.data;

        // 1. Save JWTs to Keychain
        await saveToken(access_token, refresh_token);

        // 2. Cache user profile in MMKV & State
        setUserMMKv(userData);
        setUser(userData);

        // 3. Save MPIN to Keychain if returned
        if (userData?.mpin) {
          await saveMpin(userData.mpin);
          setMpin(userData.mpin);
        }

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

  return (
    <AuthContext.Provider
      value={{
        googleAuthentication,
        getMe,
        logout,
        authenticated,
        setAuthenticated,
        user,
        mpin,
        loading,
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
