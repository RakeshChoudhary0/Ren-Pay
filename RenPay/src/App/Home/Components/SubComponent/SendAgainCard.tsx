import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../../Extras/Constants/colors';
import { useNavigation } from '@react-navigation/native';

import {
  RecentUserItem,
  useRecentSearches,
} from '../../../../Extras/LocalStorage/UserStorage';

const SendAgainCard = () => {

  const navigation = useNavigation<any>();
  const { recentUsers, addRecentUser } = useRecentSearches(6);

  const handlePressUser = (sendToUser: RecentUserItem) => {
    addRecentUser(sendToUser);
    navigation.navigate('Payment', { sendToUser });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.TextHeader}>Send Again</Text>

      <View style={styles.profileContainer}>
        {recentUsers.map((sendToUser, index) => (
          <TouchableOpacity
            key={`${sendToUser.id ?? sendToUser.email ?? sendToUser.name}-${index}`}
            onPress={() => handlePressUser(sendToUser)}
            style={styles.avatarWrapper}
            activeOpacity={0.75}>
            {sendToUser.avatar ? (
              <Image
                source={{ uri: sendToUser.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <Icon name="user" size={ms(22)} color={COLORS.Gray} />
              </View>
            )}
            <Text style={styles.userName} numberOfLines={1}>
              {sendToUser.name?.split(' ')[0] || 'User'}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Add / Search new recipient */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Payment')}>
          <View style={styles.avatar}>
            <Icon name="plus" size={ms(24)} color={COLORS.Black} />
          </View>
          <Text style={styles.userName} numberOfLines={1}>
            More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ms(7),
  },

  TextHeader: {
    fontSize: ms(14),
    fontWeight: '700',
    color: COLORS.Black,
    letterSpacing: -0.4,
    paddingHorizontal: ms(10),
  },

  profileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
  },

  avatarWrapper: {
    width: ms(72),
    padding: ms(10),
    borderRadius: ms(12),
    backgroundColor: `${COLORS.White}60`,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(5),
  },

  avatar: {
    height: ms(50),
    width: ms(50),
    borderRadius: ms(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${COLORS.LevenderGrey}40`,
  },

  userName: {
    fontSize: ms(11),
    fontWeight: '600',
    color: COLORS.Black,
    textAlign: 'center',
  },
});

export default SendAgainCard;
