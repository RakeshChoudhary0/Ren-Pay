import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../../../Extras/Constants/colors';

interface AmountSectionProps {
  amount?: string;
  currencySymbol?: string;
}

const AmountSection = ({
  amount: externalAmount,
  currencySymbol = '₹',
}: AmountSectionProps) => {
  const [internalAmount] = useState('00.00');
  const amount = externalAmount !== undefined ? externalAmount : internalAmount;

  // Split integer and decimal parts
  const parts = amount.split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts[1] !== undefined ? `.${parts[1]}` : '';

  return (
    <View style={styles.displayContainer}>
      <Text style={styles.currencyLabel}>INR</Text>

      <View style={styles.amountRow}>
        <Text style={styles.currencySymbol}>{currencySymbol}</Text>
        <Text style={styles.integerText}>{integerPart}</Text>
        {decimalPart ? (
          <Text style={styles.decimalText}>{decimalPart}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  displayContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: ms(22),
    paddingBottom: ms(10),
  },
  currencyLabel: {
    fontSize: ms(40),
    fontWeight: '600',
    color: COLORS.White,
    opacity: 0.8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: ms(2),
  },
  currencySymbol: {
    fontSize: ms(52),
    fontWeight: '600',
    color: COLORS.White,
    marginRight: ms(2),
  },
  integerText: {
    fontSize: ms(50),
    fontWeight: '700',
    color: COLORS.White,
    letterSpacing: -1,
  },
  decimalText: {
    fontSize: ms(26),
    fontWeight: '700',
    color: COLORS.White,
    opacity: 0.6,
  },
});

export default AmountSection;
