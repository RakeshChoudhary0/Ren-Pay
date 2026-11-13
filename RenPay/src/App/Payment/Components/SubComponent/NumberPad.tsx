import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../../Extras/Constants/colors';
import RNHapticFeedback from 'react-native-haptic-feedback';

interface NumberPadProps {
  amount: string;
  setAmount: (amount: string) => void;
  balance?: string;
  disable?: boolean;
  onSend?: () => Promise<void> | void;
  isSending?: boolean;
}

const NumberPad = ({
  amount,
  setAmount,
  balance = '12349',
  onSend,
  isSending = false,
  disable = false,
}: NumberPadProps) => {
  const keys: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'back'];

  const numBalance = Number(balance) || 0;
  const numAmount = Number(amount) || 0;
  const balanceValue = numBalance.toLocaleString('en-IN');
  const amountLimitExceeded = amount.length > 0 && numAmount > numBalance;
  const canSend = numAmount > 0 && !amountLimitExceeded && !isSending;

  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerHaptic = (type: any = 'impactLight') => {
    try {
      RNHapticFeedback.trigger(type, hapticOptions);
    } catch (e) {
      console.log('Some Thing Went Wrong in Haptic');
    }
  };

  const handlePress = (key: number | string) => {
    triggerHaptic('impactLight');
    if (key === 'back') {
      setAmount(amount.slice(0, -1));
      return;
    }

    if (key === '.') {
      if (amount.includes('.')) return;
      if (amount === '') {
        setAmount('0.');
        return;
      }
      setAmount(amount + '.');
      return;
    }

    // Limit decimal places to 2
    if (amount.includes('.')) {
      const [, decimals] = amount.split('.');
      if (decimals && decimals.length >= 2) return;
    }

    // Prevent excessive leading zeros
    if (amount === '0' && key === 0) return;
    if (amount === '0' && key !== '.') {
      setAmount(String(key));
      return;
    }

    // Limit overall length for safety and layout integrity
    if (amount.length >= 9) return;

    setAmount(amount + key);
  };

  const handleSendPress = () => {
    if (!canSend) return;
    triggerHaptic('notificationSuccess');
    if (onSend) {
      onSend();
    }
  };

  return (
    <View style={styles.container}>
      {/* Total Balance Pill */}
      <View
        style={[
          styles.TotalBalanceWrapper,
          {
            backgroundColor: amountLimitExceeded
              ? COLORS.Red
              : COLORS.WhiteSmoke,
          },
        ]}
      >
        <View style={styles.TotalBalanceLeft}>
          <Text
            style={[
              styles.TotalBalanceText1,
              {
                color: amountLimitExceeded
                  ? COLORS.WhiteSmoke
                  : COLORS.TextSecondary,
              },
            ]}
          >
            {amountLimitExceeded ? 'Insufficient: ' : 'Total Balance: '}
          </Text>
          <Text
            style={[
              styles.TotalBalanceText2,
              {
                color: amountLimitExceeded ? COLORS.White : COLORS.Black,
              },
            ]}
          >
            ₹{balanceValue}
          </Text>
        </View>
      </View>

      {/* 3x4 Keypad Grid */}
      <View style={styles.grid}>
        {keys.map(k => {
          const isBack = k === 'back';
          const isKeyDisabled = isSending;

          return (
            <TouchableOpacity
              key={k}
              style={styles.keyWrapper}
              activeOpacity={0.6}
              disabled={(!isBack && disable) || isKeyDisabled}
              onPress={() => handlePress(k)}
            >
              <View
                style={[
                  styles.key,
                  k === 1 && { borderTopLeftRadius: ms(20) },
                  k === 3 && { borderTopRightRadius: ms(20) },
                  k === 'back' && { borderBottomRightRadius: ms(20) },
                  k === '.' && { borderBottomLeftRadius: ms(20) },
                ]}
              >
                {isBack ? (
                  <Icon name="erase" size={ms(22)} color={COLORS.Black} />
                ) : (
                  <Text style={styles.keyText}>{k}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Click to Pay action (Replaced Swipe) */}
      <View style={styles.SendButtonContainer}>
        <TouchableOpacity
          activeOpacity={canSend ? 0.8 : 1}
          disabled={!canSend}
          onPress={handleSendPress}
          style={[styles.SwipeWrapper, !canSend && styles.SwipeDisabledWrapper]}
        >
          <Text style={styles.SwipeText}>
            {isSending
              ? 'Processing payment...'
              : amountLimitExceeded
              ? 'Insufficient Balance'
              : numAmount === 0
              ? 'Enter an amount to send'
              : 'Proceed to Pay'}
          </Text>

          {canSend && (
            <View style={styles.SwipeKnob}>
              {isSending ? (
                <ActivityIndicator size="small" color={COLORS.White} />
              ) : (
                <FeatherIcon
                  name="arrow-right"
                  size={ms(22)}
                  color={COLORS.White}
                />
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.LevenderGrey,
    borderTopLeftRadius: ms(30),
    borderTopRightRadius: ms(30),
    paddingTop: ms(28),
    paddingBottom: ms(20),
    paddingHorizontal: ms(16),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: ms(12),
  },
  keyWrapper: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(1.5),
  },
  key: {
    width: '100%',
    height: ms(60),
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
    color: COLORS.Black,
    fontWeight: '600',
  },

  SendButtonContainer: {
    marginTop: ms(1),
    paddingHorizontal: ms(30),
  },
  SwipeWrapper: {
    height: ms(65),
    backgroundColor: COLORS.WhiteSmoke,
    borderRadius: ms(39),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  SwipeDisabledWrapper: {
    opacity: 0.75,
  },
  SwipeText: {
    fontSize: ms(14),
    fontWeight: '600',
    color: COLORS.TextSecondary,
    letterSpacing: -0.2,
  },
  SwipeKnob: {
    position: 'absolute',
    right: ms(9),
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    backgroundColor: COLORS.Black,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  // Total Balance Pill
  TotalBalanceWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: ms(-15),
    elevation: 3,
    shadowColor: COLORS.PrimaryBorder,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: ms(3),
    shadowOpacity: 0.25,
    paddingHorizontal: ms(16),
    paddingVertical: ms(7),
    borderRadius: ms(20),
    zIndex: 10,
  },
  TotalBalanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  TotalBalanceText1: {
    fontSize: ms(11),
    fontWeight: '500',
  },
  TotalBalanceText2: {
    fontSize: ms(12),
    fontWeight: '800',
  },
});

export default NumberPad;
