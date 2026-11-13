import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../Extras/Constants/colors';
import UserProfile from './SubComponent/UserProfile';

export interface UserItem {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
}

const DEFAULT_USERS: UserItem[] = [
  {
    id: '1',
    name: 'Rakesh',
    avatar:
      'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    email: 'rakesh1154@gmail.com',
  },
  {
    id: '2',
    name: 'Rakesh Choudhary',
    avatar:
      'https://plus.unsplash.com/premium_photo-1664541336896-b3d5f7dec9a3?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    email: '1154@gmail.com',
  },
  {
    id: '3',
    name: 'Rakesh Sirvi',
    avatar: '',
    email: 'rakeshd1154@gmail.com',
  },
  {
    id: '4',
    name: 'Priya Sharma',
    avatar: '',
    email: 'priya.sharma@example.com',
  },
  {
    id: '5',
    name: 'Aman Verma',
    avatar: '',
    email: 'aman.verma@example.com',
  },
];

interface UserSearchSectionProps {
  onSelectUser: (user: UserItem) => void;
}

const UserSearchSection = ({ onSelectUser }: UserSearchSectionProps) => {
  const [query, setQuery] = useState('');

  const filteredUsers = DEFAULT_USERS.filter(u => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Icon name="search" size={ms(18)} color={COLORS.TextSecondary} />
        <TextInput
          placeholder="Search by name, UPI ID or email..."
          placeholderTextColor={COLORS.TextSecondary}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          autoFocus={true}
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Icon name="x-circle" size={ms(16)} color={COLORS.TextSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>
        {query ? 'Search Results' : 'Suggested Contacts'}
      </Text>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id || item.email}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="user-x" size={ms(32)} color={COLORS.Gray} />
            <Text style={styles.emptyText}>No contact found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <UserProfile item={item} onSelectUser={onSelectUser} />
        )}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.WhiteSmoke}20`,
    borderWidth: 1,
    borderColor: `${COLORS.PrimaryBorder}50`,
    borderRadius: ms(16),
    paddingHorizontal: ms(14),
    height: ms(50),
    gap: ms(10),
  },
  searchInput: {
    flex: 1,
    color: COLORS.White,
    fontSize: ms(14),
    fontWeight: '500',
    paddingVertical: 0,
  },
  sectionTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: COLORS.LevenderGrey,
    marginTop: ms(20),
    marginBottom: ms(10),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    gap: ms(2),
    paddingBottom: ms(30),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(50),
    gap: ms(8),
  },
  emptyText: {
    color: COLORS.LevenderGrey,
    fontSize: ms(13),
    fontWeight: '500',
  },
});

export default UserSearchSection;
