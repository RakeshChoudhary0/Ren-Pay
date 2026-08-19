import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../../Extras/Constants/colors';

const useData = [
  {
    id: '1',
    avatar:
      'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    email: 'rakeshchoudhary1154@gmail.com',
  },
  {
    id: '2',
    avatar:
      'https://plus.unsplash.com/premium_photo-1664541336896-b3d5f7dec9a3?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    email: 'rakeshchoudhary1154@gmail.com',
  },
  {
    id: '3',
    avatar: '',
    email: 'rakeshchoudhary1154@gmail.com',
  },
];

const SendAgainCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.TextHeader}>Send Again</Text>

      <View style={styles.profileContainer}>
        {/* Profile items */}
        {useData.map(item => (
          <TouchableOpacity key={item.id} style={styles.avatarWrapper}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Icon name="user" size={ms(22)} color={COLORS.Gray} />
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.7}>
          <View style={styles.avatar}>
            <Icon name="plus" size={ms(24)} color={COLORS.Black} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%',
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
    padding: ms(10),
    borderRadius: ms(12),
    backgroundColor: `${COLORS.White}60`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
    height: ms(50),
    width: ms(50),
    borderRadius: ms(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${COLORS.LevenderGrey}40`,
  },
});

export default SendAgainCard;
