import { NativeModules } from 'react-native';
import * as keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'com.renpay.app.tokens';
const MPIN_SERVICE = 'com.renpay.app.mpin';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Checks if the underlying native Keychain module binary is linked and available
 */
const isKeychainAvailable = (): boolean => {
  return Boolean(NativeModules.RNKeychainManager);
};

export const saveToken = async (
  accessToken: string,
  refreshToken: string,
): Promise<boolean> => {
  if (!isKeychainAvailable()) {
    console.warn('Keychain native module unavailable.');
    return false;
  }

  try {
    const payload = JSON.stringify({ accessToken, refreshToken });
    await keychain.setGenericPassword('auth_tokens', payload, {
      service: TOKEN_SERVICE,
      accessible: keychain.ACCESSIBLE.WHEN_UNLOCKED,
      securityLevel: keychain.SECURITY_LEVEL.ANY,
    });
    return true;
  } catch (error) {
    console.error('Error storing tokens in Keychain:', error);
    return false;
  }
};

export const getToken = async (): Promise<Tokens | null> => {
  if (!isKeychainAvailable()) {
    console.warn('Keychain native module unavailable.');
    return null;
  }

  try {
    const result = await keychain.getGenericPassword({
      service: TOKEN_SERVICE,
    });
    if (result && typeof result !== 'boolean' && result.password) {
      return JSON.parse(result.password);
    }
    return null;
  } catch (error) {
    console.error('Error getting tokens from Keychain:', error);
    return null;
  }
};

export const deleteToken = async (): Promise<boolean> => {
  if (!isKeychainAvailable()) return false;

  try {
    await keychain.resetGenericPassword({ service: TOKEN_SERVICE });
    return true;
  } catch (error) {
    console.error('Error deleting tokens from Keychain:', error);
    return false;
  }
};

export const saveMpin = async (mpin: string): Promise<boolean> => {
  if (!isKeychainAvailable()) return false;

  try {
    const payload = JSON.stringify({ mpin });
    await keychain.setGenericPassword('mpin', payload, {
      service: MPIN_SERVICE,
      accessible: keychain.ACCESSIBLE.WHEN_UNLOCKED,
      securityLevel: keychain.SECURITY_LEVEL.ANY,
    });
    return true;
  } catch (error) {
    console.error('Error storing MPIN in Keychain:', error);
    return false;
  }
};

export const getMpin = async (): Promise<string | null> => {
  if (!isKeychainAvailable()) return null;

  try {
    const result = await keychain.getGenericPassword({
      service: MPIN_SERVICE,
    });
    if (result && typeof result !== 'boolean' && result.password) {
      return JSON.parse(result.password).mpin;
    }
    return null;
  } catch (error) {
    console.error('Error getting MPIN from Keychain:', error);
    return null;
  }
};

export const deleteMpin = async (): Promise<boolean> => {
  if (!isKeychainAvailable()) return false;

  try {
    await keychain.resetGenericPassword({ service: TOKEN_SERVICE });
    return true;
  } catch (error) {
    console.error('Error deleting MPIN from Keychain:', error);
    return false;
  }
};
