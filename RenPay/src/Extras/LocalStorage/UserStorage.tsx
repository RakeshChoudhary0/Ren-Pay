import { useCallback, useEffect, useState } from 'react';
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
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Failed to parse user from MMKV', error);
    return null;
  }
};

export const clearUserStorage = () => {
  UserStorage.remove('user');
  UserStorage.remove('user_auth');
  UserStorage.remove('recent_searched_users');
};




export interface RecentUserItem {
  id?: number | string;
  name: string;
  email: string;
  avatar?: string;
}

const RECENT_USERS_KEY = 'recent_searched_users';


function readRecentUsers(): RecentUserItem[] {
  try {
    const raw = UserStorage.getString(RECENT_USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useRecentSearches(maxItems = 8) {
  const [recentUsers, setRecentUsers] = useState<RecentUserItem[]>(readRecentUsers);

  // Keep state in sync if another screen updates or clears the key
  useEffect(() => {
    const listener = UserStorage.addOnValueChangedListener(key => {
      if (key === RECENT_USERS_KEY) {
        setRecentUsers(readRecentUsers());
      }
    });
    return () => listener.remove();
  }, []);

  const addRecentUser = useCallback(
    (user: RecentUserItem) => {
      if (!user?.email && !user?.name) return;

      const entry: RecentUserItem = {
        id: user.id,
        name: user.name  ,
        email: user.email,
        avatar: user.avatar ,
      };

      setRecentUsers(prev => {
        const withoutDuplicate = prev.filter(item =>
          entry.email && item.email
            ? item.email.toLowerCase() !== entry.email.toLowerCase()
            : item.name.toLowerCase() !== entry.name.toLowerCase(),
        );
        const updated = [entry, ...withoutDuplicate].slice(0, maxItems);
        UserStorage.set(RECENT_USERS_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [maxItems],
  );

  const clearRecentUsers = useCallback(() => {
    UserStorage.remove(RECENT_USERS_KEY);
    setRecentUsers([]);
  }, []);

  return {
    recentUsers,
    addRecentUser,
    clearRecentUsers,
  };
}
