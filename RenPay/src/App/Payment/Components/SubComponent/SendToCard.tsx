import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../../../Extras/Constants/colors';

interface SendToCardProps {
  item: {
    name?: string;
    email?: string;
  };
}

const SendToCard = ({ item }: SendToCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoWrapper}>
        <Text numberOfLines={1} style={styles.name}>
          {item?.name || 'No Name Provided'}
        </Text>
        <Text numberOfLines={1} style={styles.email}>
          {item?.email || 'No Email Provided'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: ms(72),
    backgroundColor: COLORS.Gray,
    borderRadius: ms(16),
    paddingHorizontal: ms(16),
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: COLORS.Black || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  infoWrapper: {
    justifyContent: 'center',
    rowGap: ms(4),
  },
  name: {
    fontSize: ms(15),
    fontWeight: '600',
    color: COLORS.White,
    letterSpacing: 0.2,
  },
  email: {
    fontSize: ms(13),
    fontWeight: '400',
    color: COLORS.LevenderGrey,
  },
});

export default SendToCard;
