import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SendToCard from './SubComponent/SendToCard';
import AmountSection from './SubComponent/AmountSection';
import { ms } from 'react-native-size-matters';
import NumberPad from './SubComponent/NumberPad';

interface PaymentSectionProps {
  user?: {
    name?: string;
    email?: string;
  };
  onChangeUser?: () => void;
}

const PaymentSection = ({ user, onChangeUser }: PaymentSectionProps) => {
  const [amount, setAmount] = useState('');
  console.log('🚀 ~ PaymentSection ~ amount:', amount);

  return (
    <View style={styles.container}>
      <AmountSection amount={amount} />
      {user && <SendToCard user={user} onChangeUser={onChangeUser} />}
      
      <NumberPad amount={amount} setAmount={setAmount} />
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
