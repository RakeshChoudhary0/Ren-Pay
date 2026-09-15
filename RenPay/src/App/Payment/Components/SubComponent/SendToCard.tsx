import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../../../Extras/Constants/colors';

interface SendToCardProps {
  user?: {
    name?: string;
    email?: string;
  };
  onChangeUser?: () => void;
}

const SendToCard = ({ user, onChangeUser }: SendToCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoWrapper}>
        <Text numberOfLines={1} style={styles.name}>
          {user?.name}
        </Text>
        <Text numberOfLines={1} style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.changeUserWrapper}
        onPress={onChangeUser}
        activeOpacity={0.7}
      >
        <Icon
          name="chevron-with-circle-right"
          size={ms(20)}
          color={COLORS.White || '#FFF'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ms(75),
    width: '94%',
    backgroundColor: COLORS.Gray,
    borderRadius: ms(20),
    paddingHorizontal: ms(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.Black || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
    rowGap: ms(2),
    marginLeft: ms(12),
  },
  name: {
    fontSize: ms(18),
    fontWeight: '700',
    color: COLORS.White,
    letterSpacing: 0,
  },
  email: {
    fontSize: ms(12),
    fontWeight: '500',
    color: COLORS.LevenderGrey,
    letterSpacing: -0.4,
  },
  changeUserWrapper: {
    width: ms(69),
    height: ms(69),
    borderRadius: ms(18),
    backgroundColor: COLORS.PrimaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SendToCard;
