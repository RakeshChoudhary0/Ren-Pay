import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../../../Extras/Constants/colors';
import RNHapticFeedback from 'react-native-haptic-feedback';

interface NumberPadProps {
  amount: string;
  setAmount: (amount: string) => void;
}

const NumberPad = ({ amount, setAmount }: NumberPadProps) => {
  const keys: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'back'];

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const handlePress = (key: number | string) => {
    RNHapticFeedback.trigger('impactLight', options);
    if (key === 'back') {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount(amount + key);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.TotalBalanceWrapper}>
        <View style={styles.TotalBalanceLeft}>
          <Text style={styles.TotalBalanceText1}>Total Balance: </Text>
          <Text style={styles.TotalBalanceText2}>₹12,329</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {keys.map(k => {
          const isBack = k === 'back';

          return (
            <TouchableOpacity
              key={k}
              style={[styles.keyWrapper]}
              activeOpacity={0.6}
              onPress={() => handlePress(k)}
            >
              <View
                style={[
                  styles.key,
                  k === 1 && { borderTopLeftRadius: ms(24) },
                  k === 3 && { borderTopRightRadius: ms(24) },
                  k === 'back' && { borderBottomRightRadius: ms(24) },
                  k === '.' && { borderBottomLeftRadius: ms(24) },
                ]}
              >
                {isBack ? (
                  <Icon
                    name="erase"
                    size={ms(24)}
                    color={COLORS.Black || '#000'}
                  />
                ) : (
                  <Text style={styles.keyText}>{k}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.SendButtonContainer}>
        <View style={styles.SwipeWrapper}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.LevenderGrey,
    borderRadius: ms(24),
    paddingTop: ms(30),
    paddingBottom: ms(15),
    paddingHorizontal: ms(16),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: ms(11),
  },
  keyWrapper: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(1),
  },
  key: {
    width: '100%',
    height: ms(73),
    backgroundColor: COLORS.WhiteSmoke || '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  keyText: {
    fontSize: ms(24),
    color: COLORS.Black || '#000',
    fontWeight: '600',
  },
  SwipeWrapper: {
    height: ms(70),
    backgroundColor: COLORS.WhiteSmoke,
    borderRadius: ms(35),
  },
  SendButtonContainer: {},

  // Total Balance Button
  TotalBalanceWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: ms(-15),
    backgroundColor: COLORS.White,
    borderWidth: 4,
    borderColor: COLORS.Black,
    paddingHorizontal: ms(12),
    paddingVertical: ms(7),
    borderRadius: ms(20),
  },
  TotalBalanceLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TotalBalanceRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TotalBalanceText1: {
    fontSize: ms(12),
    fontWeight: '400',
    color: COLORS.TextSecondary,
  },
  TotalBalanceText2: {
    fontSize: ms(13),
    fontWeight: '800',
    color: COLORS.Black,
  },
});

export default NumberPad;
