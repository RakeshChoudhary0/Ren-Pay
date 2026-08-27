import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../Extras/Constants/colors';
import { ms } from 'react-native-size-matters';
import SendToCard from './SubComponent/SendToCard';

const PaymentSection = ({ item }: { item: any }) => {
  return (
    <View>
      <SendToCard item={item} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: ms(20),
    color: COLORS.White,
  },
});

export default PaymentSection;
