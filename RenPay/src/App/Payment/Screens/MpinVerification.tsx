import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../type';
import Icon from 'react-native-vector-icons/Feather';
import { ms } from 'react-native-size-matters';

import { NumericPad } from '../../../Authentication/Components/NumericPad';
import { PinDisplay } from '../../../Authentication/Components/PinDisplay';
import { triggerShake } from '../../../Extras/Utils/ShakeAnimation';
import useAuth from '../../../Extras/Context/AuthContext';
import { COLORS } from '../../../Extras/Constants/colors';
import API from '../../../Extras/API/api';
import Header from '../Components/Header';

const PIN_LENGTH = 6;

const MpinVerification = () => {
  const route = useRoute<RootStackParamList['MpinVerification']>();
  const navigation = useNavigation<any>();
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Extract payment details passed from the Payment screen
  const {
    receiver_id,
    receiver_email,
    receiver_name,
    receiver_avatar,
    amount,
    note,
    idempotency_key,
  } = route.params as any;

  const [pin, setPin] = useState<number[]>([]);
  const [invalidIndicator, setInvalidIndicator] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const { verifyPin, pinLoading } = useAuth();

  const handlePress = async (val: any) => {
    if (pinLoading || isTransferring) return;

    if (val === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < PIN_LENGTH) {
      const newPin = [...pin, val];
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        const TYPED_PIN = newPin.join('');

        try {
          // Step 1: Verify MPIN using Auth context
          const res = await verifyPin(TYPED_PIN);

          if (res?.data?.success) {
            setIsTransferring(true);

            // Step 2: Execute actual money transfer API call
            const transferRes = await API.post('/payment/send', {
              receiver_id,
              receiver_email,
              amount: Number(amount),
              currency: 'INR',
              note: note || null,
              mpin: TYPED_PIN,
              idempotency_key,
            });

            if (transferRes.data.success) {
              // Navigate to Success screen or go back with success message
              navigation.replace('Home', {
                successMessage: `Successfully sent ₹${Number(
                  amount,
                ).toLocaleString('en-IN')} to ${receiver_name}!`,
              });
            }
          } else {
            handlePinError();
          }
        } catch (error: any) {
          console.error('Transfer/Verification Error:', error);
          // Log the exact message from your backend controller
          console.log('Backend 400 Error Data:', error.response?.data);
          console.log('Status Code:', error.response?.status);

          const errorMessage =
            error.response?.data?.message || 'Transaction failed';
          Alert.alert('Payment Error', errorMessage); // Optional: show it on screen
          handlePinError();
        } finally {
          setIsTransferring(false);
        }
      }
    }
  };

  const handlePinError = () => {
    setInvalidIndicator(true);
    triggerShake(shakeAnimation);
    setTimeout(() => {
      setPin([]);
      setInvalidIndicator(false);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Verify PIN" />
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          {receiver_avatar ? (
            <Image source={{ uri: receiver_avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Icon name="user" size={ms(24)} color={COLORS.White} />
            </View>
          )}
        </View>

        <Text style={styles.payingText}>Paying</Text>
        <Text style={styles.amountText}>
          ₹{Number(amount).toLocaleString('en-IN')}
        </Text>
        <Text style={styles.recipientText}>
          to{' '}
          <Text style={styles.boldText}>{receiver_name || receiver_email}</Text>
        </Text>
      </View>

      <View style={styles.pinSection}>
        <Text style={styles.instructionText}>Enter 6-Digit Secure MPIN</Text>

        <PinDisplay
          pinLength={PIN_LENGTH}
          pinCount={pin.length}
          invalidIndicator={invalidIndicator}
          shakeAnimation={shakeAnimation}
        />

        {(pinLoading || isTransferring) && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.White} />
            <Text style={styles.loadingText}>
              {pinLoading ? 'Verifying PIN...' : 'Processing Payment...'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.padContainer}>
        <NumericPad
          onPress={handlePress}
          disabled={pinLoading || isTransferring}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: ms(16),
  },
  avatarContainer: {
    marginBottom: ms(12),
  },
  avatar: {
    width: ms(65),
    height: ms(65),
    borderRadius: ms(40),
    borderWidth: ms(2),
    borderColor: '#333',
  },
  avatarFallback: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(30),
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payingText: {
    fontSize: ms(14),
    color: '#888',
    marginBottom: ms(4),
  },
  amountText: {
    fontSize: ms(32),
    fontWeight: '700',
    color: COLORS.White,
    marginBottom: ms(4),
  },
  recipientText: {
    fontSize: ms(15),
    color: '#aaa',
  },
  boldText: {
    color: COLORS.White,
    fontWeight: '800',
  },
  pinSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: ms(40),
  },
  instructionText: {
    fontSize: ms(14),
    color: '#888',
    marginBottom: ms(16),
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(16),
    gap: ms(8),
  },
  loadingText: {
    color: COLORS.White,
    fontSize: ms(14),
  },
  padContainer: {
    width: '100%',
    paddingBottom: ms(10),
  },
});

export default MpinVerification;
