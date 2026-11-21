import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import useAuth from '../../../Extras/Context/AuthContext';
import { useRecentSearches } from '../../../Extras/LocalStorage/UserStorage';
import SearchInputBar from './SubComponent/SearchInputBar';
import RecentUsersBar from './SubComponent/RecentUsersBar';
import SearchStatusBanner from './SubComponent/SearchStatusBanner';
import SearchResultsList from './SubComponent/SearchResultsList';

export interface UserItem {
  id?:  string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserSearchSectionProps {
  onSelectUser: (user: UserItem) => void;
}

const UserSearchSection = ({ onSelectUser }: UserSearchSectionProps) => {
  const [query, setQuery] = useState('');
  const { findUser } = useAuth();
  const { recentUsers, addRecentUser, clearRecentUsers } =
    useRecentSearches(8);

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isWarningHint, setIsWarningHint] = useState<boolean>(false);

  const handleClearQuery = useCallback(() => {
    setQuery('');
    setErrorMsg('');
    setIsWarningHint(false);
  }, []);

  const handleUserPicked = useCallback(
    (user: UserItem) => {
      addRecentUser(user);
      onSelectUser(user);
    },
    [onSelectUser, addRecentUser],
  );

  useEffect(() => {
    let isActive = true;
    const trimmed = query.trim();

    if (!trimmed) {
      setUsers([]);
      setErrorMsg('');
      setIsWarningHint(false);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        setIsWarningHint(false);

        const res = await findUser(trimmed);
        if (!isActive || !res) return;

        if (res.status === 401) {
          setUsers([]);
          setIsWarningHint(false);
          setErrorMsg(res.message || 'Session expired. Please log in again.');
          return;
        }

        if (!res.success || res.status === 400) {
          const msg =
            res.message || 'Please provide at least 2 characters to search.';
          setUsers([]);
          setIsWarningHint(msg.toLowerCase().includes('at least 2 characters'));
          setErrorMsg(msg);
          return;
        }

        const results = Array.isArray(res.data) ? res.data : [];
        setUsers(results);
        setErrorMsg('');
        setIsWarningHint(false);
      } catch (error: any) {
        if (!isActive) return;
        setUsers([]);
        setIsWarningHint(false);
        setErrorMsg(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong while searching.',
        );
      } finally {
        if (isActive) setLoading(false);
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [query, findUser]);

  const trimmedQuery = query.trim();

  return (
    <View style={styles.container}>
      <SearchInputBar
        value={query}
        onChangeText={setQuery}
        onClear={handleClearQuery}
      />

      <RecentUsersBar
        users={recentUsers}
        onSelectUser={handleUserPicked}
        onClearAll={clearRecentUsers}
      />

      <SearchStatusBanner message={errorMsg} isWarning={isWarningHint} />

      <SearchResultsList
        query={trimmedQuery}
        users={users}
        loading={loading}
        hasError={Boolean(errorMsg)}
        onSelectUser={handleUserPicked}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: ms(20),
    paddingTop: ms(12),
  },
});

export default UserSearchSection;
