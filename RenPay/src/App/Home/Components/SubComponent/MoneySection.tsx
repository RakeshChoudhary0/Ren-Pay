import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../Extras/Constants/colors';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

interface MoneySectionProps {
  showInr: boolean;
  Balance: string;
}

const MoneySection = ({ showInr, Balance }: MoneySectionProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  const numericBalance = Number(Balance);
  const formattedBalance = showInr
    ? numericBalance.toFixed(2)
    : (numericBalance / 97).toFixed(2);
  const split = formattedBalance.split('.');

  const FONTSIZE = split[0].length >= 10 ? 39 : split[0].length >= 8 ? 48 : 54;

  const styles = getStyles(FONTSIZE);

  const handleVisibleSwitch = () => {
    setVisible(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleVisibleSwitch}
        style={styles.CurrencyWrapper}
      >
        {visible ? (
          <>
            <Text style={styles.CurrencyStyle}>{showInr ? '₹' : '$'}</Text>
            <Text style={styles.CurrencyStyle}>
              {Number(split[0]).toLocaleString('en-us')}
              <Text style={styles.CurrencyStyleDot}>{',' + split[1]}</Text>
            </Text>
          </>
        ) : (
          <View style={styles.HiddenContainer}>
            <Text style={styles.CurrencyStyle}>{showInr ? '₹' : '$'}</Text>
            <View style={styles.dotContainer}>
              {Array(0, 1, 2, 3, 4).map(index => (
                <View key={index} style={styles.circle}></View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (FONTSIZE: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      paddingBottom: ms(10),
    },

    HiddenContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: ms(9),
    },

    dotContainer: {
      flexDirection: 'row',
      gap: ms(5),
    },
    circle: {
      height: ms(15),
      width: ms(15),
      backgroundColor: COLORS.Black,
      borderRadius: 100,
    },

    CurrencyWrapper: {
      flexDirection: 'row',
    },

    CurrencyStyle: {
      fontSize: ms(FONTSIZE),
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
};

export default MoneySection;
