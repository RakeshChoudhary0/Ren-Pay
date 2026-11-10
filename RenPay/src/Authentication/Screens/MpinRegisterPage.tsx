import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../Extras/Constants/colors';
import { PinDisplay } from '../Components/PinDisplay';
import { NumericPad } from '../Components/NumericPad';
import useAuth from '../../Extras/Context/AuthContext';
import BrandingText from '../Components/BrandingText';

const PIN_LENGTH = 6;

export const MpinRegisterPage = () => {
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [firstPin, setFirstPin] = useState<string>('');
  const [pin, setPin] = useState<number[]>([]);
  const [invalidIndicator, setInvalidIndicator] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const { set_mpin, pinLoading } = useAuth();

  const triggerShake = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = async (val: any) => {
    if (pinLoading) return;
    if (val === 'backspace') {
      setPin(prev => prev.slice(0, -1));
      return;
    }

    if (pin.length < PIN_LENGTH) {
      const updatedPin = [...pin, val];
      setPin(updatedPin);
      if (updatedPin.length === PIN_LENGTH) {
        const enteredPinString = updatedPin.join('');

        if (step === 'create') {
          // Transition to Confirmation step

          setTimeout(() => {
            setFirstPin(enteredPinString);
            setPin([]);
            setStep('confirm');
          }, 400);
        } else {
          // Verify matching MPINs
          if (enteredPinString === firstPin) {
            try {
              const res = await set_mpin(enteredPinString);
              if (res?.data?.success) {
                console.log('MpinSeted SuccessFUlly');
              } else {
                setInvalidIndicator(true);
                triggerShake();
                setTimeout(() => {
                  setPin([]);
                  setInvalidIndicator(false);
                }, 300);
              }
            } catch (error) {
              setInvalidIndicator(true);
              triggerShake();
              setTimeout(() => {
                setPin([]);
                setInvalidIndicator(false);
              }, 300);
            }
          } else {
            // Mismatch handling
            setInvalidIndicator(true);
            triggerShake();
            setTimeout(() => {
              setPin([]);
              setInvalidIndicator(false);
            }, 300);
          }
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.mpinHeading}>
          {step === 'create' ? 'Setup New MPIN' : 'Confirm Your MPIN'}
        </Text>
        <PinDisplay
          pinLength={PIN_LENGTH}
          pinCount={pin.length}
          invalidIndicator={invalidIndicator}
          shakeAnimation={shakeAnimation}
        />
        {pinLoading && (
          <ActivityIndicator
            size="small"
            color={COLORS.WhiteSmoke}
            style={styles.loadingIndicator}
          />
        )}
      </View>

      <NumericPad onPress={handlePress} disabled={pinLoading} />
      <BrandingText />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: ms(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.Black,
    gap: ms(40),
  },
  mpinHeading: {
    fontSize: ms(24),
    fontWeight: '700',
    color: COLORS.WhiteSmoke,
    textAlign: 'center',
    marginBottom: ms(50),
  },
  loadingIndicator: {
    marginTop: ms(16),
  },
});
