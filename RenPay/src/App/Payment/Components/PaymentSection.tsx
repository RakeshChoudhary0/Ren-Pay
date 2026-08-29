import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SendToCard from './SubComponent/SendToCard';
import AmountSection from './SubComponent/AmountSection';
import { ms } from 'react-native-size-matters';
import NumberPad from './SubComponent/NumberPad';

interface PaymentSectionProps {
  item: {
    name?: string;
    email?: string;
  };
  onChangeUser?: () => void;
}

const PaymentSection = ({ item, onChangeUser }: PaymentSectionProps) => {
  const [amount, setAmount] = useState('356.20');

  return (
    <View style={styles.container}>
      <AmountSection amount={amount} />

      <SendToCard item={item} onPress={onChangeUser} />
      <NumberPad />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    gap: ms(10),
  },
  cardContainer: {
    flex: 1,
  },
});

export default PaymentSection;
