import { createMMKV } from 'react-native-mmkv';

export const UserStorage = createMMKV({
  id: 'user-data-storage',
});

export const setUserMMKv = (user: any) => {
  if (user) {
    UserStorage.set('user', JSON.stringify(user));
  } else {
    UserStorage.remove('user');
  }
};

export const getUserMMKv = (): any | null => {
  const user = UserStorage.getString('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Failed to parse user from MMKV', error);
      return null;
    }
  }
  return null;
};

export const clearUserStorage = () => {
  UserStorage.remove('user');
  UserStorage.remove('user_auth');
};
