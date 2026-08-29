import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../../../Extras/Constants/colors';

interface SendToCardProps {
  item: {
    name?: string;
    email?: string;
  };
  onPress?: () => void;
}

const SendToCard = ({ item, onPress }: SendToCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoWrapper}>
        <Text numberOfLines={1} style={styles.name}>
          {item?.name}
        </Text>
        <Text numberOfLines={1} style={styles.email}>
          {item?.email}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.changeUserWrapper}
        onPress={onPress}
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
    height: ms(65),
    width: '94%',
    backgroundColor: COLORS.Gray,
    borderRadius: ms(16),
    paddingHorizontal: ms(4),
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
    fontSize: ms(16),
    fontWeight: '700',
    color: COLORS.White,
    letterSpacing: -0.4,
  },
  email: {
    fontSize: ms(12),
    fontWeight: '500',
    color: COLORS.LevenderGrey,
    letterSpacing: -0.4,
  },
  changeUserWrapper: {
    width: ms(58),
    height: ms(58),
    borderRadius: ms(16),
    backgroundColor: COLORS.PrimaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SendToCard;
