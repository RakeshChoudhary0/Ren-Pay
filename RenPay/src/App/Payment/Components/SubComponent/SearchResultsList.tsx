import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../../Extras/Constants/colors';
import UserProfile from './UserProfile';
import type { UserItem } from '../UserSearchSection';

interface SearchResultsListProps {
  query: string;
  users: UserItem[];
  loading: boolean;
  hasError: boolean;
  onSelectUser: (user: UserItem) => void;
}

const SearchResultsList = ({
  query,
  users,
  loading,
  hasError,
  onSelectUser,
}: SearchResultsListProps) => {
  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="small" color={COLORS.White} />
        <Text style={styles.stateSubText}>Searching accounts...</Text>
      </View>
    );
  }

  if (!query) {
    return (
      <View style={styles.stateContainer}>
        <Icon name="search" size={ms(28)} color={COLORS.Gray} />
        <Text style={styles.stateTitle}>Find someone to pay</Text>
        <Text style={styles.stateSubText}>
          Type at least 2 characters of an email to search
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.sectionTitle}>Search Results</Text>
      <FlatList
        data={users}
        keyExtractor={(item, index) =>
          item.id != null ? String(item.id) : `${item.email}-${index}`
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !hasError ? (
            <View style={styles.stateContainer}>
              <Icon name="user-x" size={ms(30)} color={COLORS.Gray} />
              <Text style={styles.stateTitle}>No contact found</Text>
              <Text style={styles.stateSubText}>
                No account matched "{query}"
              </Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <UserProfile item={item} onSelectUser={onSelectUser} />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: COLORS.LevenderGrey,
    marginTop: ms(16),
    marginBottom: ms(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    gap: ms(4),
    paddingBottom: ms(30),
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(46),
    paddingHorizontal: ms(16),
    gap: ms(6),
  },
  stateTitle: {
    color: COLORS.White,
    fontSize: ms(14),
    fontWeight: '600',
    marginTop: ms(4),
  },
  stateSubText: {
    color: COLORS.LevenderGrey,
    fontSize: ms(12.5),
    textAlign: 'center',
  },
});

export default SearchResultsList;
