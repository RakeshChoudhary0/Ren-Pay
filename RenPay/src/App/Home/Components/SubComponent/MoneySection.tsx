import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../../../Extras/Constants/colors';
import { ms } from 'react-native-size-matters';
import useAuth from '../../../../Extras/Context/AuthContext';

interface MoneySectionProps {
  showInr: boolean;
}

const MoneySection = ({ showInr }: MoneySectionProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const { accountDetails, FetchAccountDetails } = useAuth();
  const Balance = accountDetails?.balance;

  const numericBalance = Number(Balance);
  const formattedBalance = showInr
    ? numericBalance.toFixed(2)
    : (numericBalance / 97).toFixed(2);
  const split = formattedBalance.split('.');

  const FONTSIZE = split[0].length >= 10 ? 39 : split[0].length >= 8 ? 48 : 54;

  const styles = getStyles(FONTSIZE);

  const handleVisibleSwitch = async () => {
    setLoadingState(true);
    setVisible(prev => !prev);
    try {
      await FetchAccountDetails();
    } catch (error) {
      console.log('Error While Fetching Data',error);
    } finally {
      setLoadingState(false);
    }
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
        ) : loadingState ? (
          <ActivityIndicator color={COLORS.Black} size={'large'} />
        ) : (
          <View style={styles.HiddenContainer}>
            <Text style={styles.CurrencyStyle}>{showInr ? '₹' : '$'}</Text>
            <View style={styles.dotContainer}>
              {[0, 1, 2, 3, 4].map(index => (
                <View key={index} style={styles.circle}/>
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
