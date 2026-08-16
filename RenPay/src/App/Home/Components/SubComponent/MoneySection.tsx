import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../../Extras/Constants/colors';
import { ms } from 'react-native-size-matters';

interface MoneySectionProps {
  showInr: boolean;
  Balance: string;
}

const MoneySection = ({ showInr, Balance }: MoneySectionProps) => {
  const numericBalance = Number(Balance);

  const formattedBalance = showInr
    ? numericBalance.toFixed(2)
    : (numericBalance / 97).toFixed(2);

  const split = formattedBalance.split('.');

  return (
    <View style={styles.container}>
      <Text style={styles.CurrencyStyle}>{showInr ? '₹' : '$'}</Text>
      <Text style={styles.CurrencyStyle}>
        {split[0]}
        <Text style={styles.CurrencyStyleDot}>{',' + split[1]}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: ms(17),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  CurrencyStyle: {
    fontSize: ms(62),
    fontWeight: '600',
    letterSpacing: -1,
    color: COLORS.Black,
  },
  CurrencyStyleDot: {
    fontSize: ms(17),
    fontWeight: '600',
    letterSpacing: -1,
    color: COLORS.Gray,
  },
});

export default MoneySection;
