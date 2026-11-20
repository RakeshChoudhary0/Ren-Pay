import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../../Extras/Constants/colors';
import type { RecentUserItem } from '../../../../Extras/LocalStorage/UserStorage';

interface RecentUsersBarProps {
  users: RecentUserItem[];
  onSelectUser: (user: RecentUserItem) => void;
  onClearAll: () => void;
}

const RecentUsersBar = ({
  users,
  onSelectUser,
  onClearAll,
}: RecentUsersBarProps) => {
  if (!users || users.length === 0) return null;

  return (
    <View style={styles.recentSection}>
      <View style={styles.recentHeader}>
        <View style={styles.recentTitleRow}>
          <Icon name="clock" size={ms(13)} color={COLORS.LevenderGrey} />
          <Text style={styles.recentTitle}>Recent Users</Text>
        </View>
        <TouchableOpacity
          onPress={onClearAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.cardsRow}>
        {users.map((user, idx) => {
          const displayName = user.name || user.email || 'User';
          const initial = displayName.charAt(0).toUpperCase() || 'U';

          return (
            <TouchableOpacity
              key={`${user.id ?? user.email ?? displayName}-${idx}`}
              style={styles.userCard}
              onPress={() => onSelectUser(user)}
              activeOpacity={0.78}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>{initial}</Text>
                </View>
              )}

              <View style={styles.cardInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {displayName}
                </Text>
                {user.email ? (
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user.email}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  recentSection: {
    marginTop: ms(14),
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ms(8),
  },
  recentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  recentTitle: {
    fontSize: ms(12),
    fontWeight: '700',
    color: COLORS.LevenderGrey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: ms(12),
    fontWeight: '600',
    color: '#9CA3AF',
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    paddingVertical: ms(2),
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: ms(14),
    paddingHorizontal: ms(10),
    paddingVertical: ms(8),
    maxWidth: ms(200),
    gap: ms(9),
  },
  avatar: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
  },
  avatarFallback: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: COLORS.White,
    fontSize: ms(13),
    fontWeight: '700',
  },
  cardInfo: {
    flexShrink: 1,
  },
  userName: {
    color: COLORS.White,
    fontSize: ms(12.5),
    fontWeight: '700',
  },
  userEmail: {
    color: '#9CA3AF',
    fontSize: ms(11),
    marginTop: ms(1),
  },
});

export default RecentUsersBar;
