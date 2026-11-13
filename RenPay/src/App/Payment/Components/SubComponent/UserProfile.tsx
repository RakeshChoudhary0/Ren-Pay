import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../../../Extras/Constants/colors';

const UserProfile = ({
  item,
  onSelectUser,
}: {
  item: any;
  onSelectUser: (item: any) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.userCard}
      activeOpacity={0.7}
      onPress={() => onSelectUser(item)}
    >
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.userInfo}>
        <Text numberOfLines={1} style={styles.userName}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={styles.userEmail}>
          {item.email}
        </Text>
      </View>

      <View style={styles.actionIcon}>
        <Icon name="arrow-up-right" size={ms(18)} color={COLORS.White} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.Gray}60`,
    borderRadius: ms(16),
    padding: ms(10),
    borderWidth: 1,
    borderColor: `${COLORS.PrimaryBorder}20`,
  },
  avatar: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(23),
  },
  avatarPlaceholder: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(23),
    backgroundColor: `${COLORS.LevenderGrey}40`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: COLORS.White,
    fontSize: ms(18),
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    marginLeft: ms(12),
    justifyContent: 'center',
  },
  userName: {
    fontSize: ms(15),
    fontWeight: '700',
    color: COLORS.White,
  },
  userEmail: {
    fontSize: ms(12),
    color: COLORS.LevenderGrey,
    marginTop: ms(2),
  },
  actionIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: `${COLORS.LevenderGrey}25`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;
