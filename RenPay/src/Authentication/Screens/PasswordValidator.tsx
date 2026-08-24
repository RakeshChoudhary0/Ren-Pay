import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../Extras/Constants/colors';
import { NumericPad } from '../Components/NumericPad';
import { PinDisplay } from '../Components/PinDisplay';
import useAuth from '../../Extras/Context/AuthContext';

const PIN_LENGTH = 6;

const PasswordValidator = ({ navigation }: { navigation: any }) => {
  const [pin, setPin] = useState<number[]>([]);
  const [invalidIndicator, setInvalidIndicator] = useState(false);

  const { verifyPin } = useAuth();

  // Animated Wrong Indicator
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    shakeAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
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
    if (val === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < PIN_LENGTH) {
      const newPin = [...pin, val];
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        const TYPED_PIN = newPin.join('');

        try {
          const res = await verifyPin(TYPED_PIN);
          if (res.data.success) {
            console.log('The PIN is correct');
          } else if (!res.data.success) {
            setInvalidIndicator(true);
            triggerShake();
            setTimeout(() => {
              setPin([]);
              console.log('Password was incorrect');
              setInvalidIndicator(false);
            }, 200);
          }
        } catch (error) {}
      }
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.textInputWrapper}>
          <Text style={styles.mpinHeading}>Enter MPIN</Text>
        </View>

        <PinDisplay
          pinLength={PIN_LENGTH}
          pinCount={pin.length}
          invalidIndicator={invalidIndicator}
          shakeAnimation={shakeAnimation}
        />
      </View>

      <NumericPad onPress={handlePress} />
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
  textInputWrapper: {
    marginBottom: ms(50),
  },
  mpinHeading: {
    fontSize: ms(24),
    fontWeight: '700',
    color: COLORS.WhiteSmoke,
    textAlign: 'center',
  },
});

export default PasswordValidator;
