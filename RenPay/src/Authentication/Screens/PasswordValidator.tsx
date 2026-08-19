import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ms, s } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../Extras/Constants/colors';

const PIN_LENGTH = 6; // Adjust pin length as needed
const Password = '241977';
const PasswordValidator = ({ navigation }: { navigation: any }) => {
  const [pin, setPin] = useState<number[]>([]);
  const [invalidIndicator, setInvalidIndicator] = useState(false);

  /**
   * Animated Wrong Indicator
   *
   */

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const TriggerShake = () => {
    shakeAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }),
    ]).start();
  };
  /**
   *
   * Animation End
   */

  const handlePress = (val: any) => {
    if (val === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < PIN_LENGTH) {
      const newPin = [...pin, val];
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        const TYPED_PIN = newPin.join('');
        if (TYPED_PIN === Password) {
          console.log('the PIN is correct');
          navigation.navigate('Home');
          setPin([]);
        } else {
          setInvalidIndicator(true);
          TriggerShake();
          setTimeout(() => {
            setPin([]);
            console.log('password Was Incorrect');
            setInvalidIndicator(false);
          }, 200);
        }
      }
    }
  };

  const padKeys = [
    { type: 'number', value: 1 },
    { type: 'number', value: 2 },
    { type: 'number', value: 3 },
    { type: 'number', value: 4 },
    { type: 'number', value: 5 },
    { type: 'number', value: 6 },
    { type: 'number', value: 7 },
    { type: 'number', value: 8 },
    { type: 'number', value: 9 },
    { type: 'empty', value: '' },
    { type: 'number', value: 0 },
    { type: 'backspace', value: 'backspace' },
  ];

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.textInputWrapper}>
          <Text style={styles.mpinHeading}>Enter MPIN</Text>
        </View>
        <Animated.View
          style={[
            styles.inputWrapper,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          {Array.from({ length: PIN_LENGTH }).map((_, index) => {
            const isFilled = index < pin.length;
            return (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  isFilled && styles.pinDotFilled,
                  invalidIndicator ? styles.invalidDot : '',
                ]}
              />
            );
          })}
        </Animated.View>
      </View>

      {/* Numpad */}
      <View style={styles.numpadWrapper}>
        <View style={styles.numberPad}>
          {padKeys.map((item, index) => {
            if (item.type === 'empty') {
              return <View key={`empty-${index}`} style={styles.emptyCircle} />;
            }

            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                style={styles.numberCircle}
                onPress={() => handlePress(item.value)}
              >
                {item.type === 'backspace' ? (
                  <Icon
                    name="backspace-outline"
                    size={ms(24)}
                    color={COLORS.WhiteSmoke}
                  />
                ) : (
                  <Text style={styles.numberText}>{item.value}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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

  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(10),
  },
  pinDot: {
    width: ms(17),
    height: ms(17),
    borderRadius: ms(9),
    borderWidth: 2,
    borderColor: COLORS.TextSecondary,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: COLORS.WhiteSmoke,
    borderColor: COLORS.WhiteSmoke,
  },

  invalidDot: {
    backgroundColor: `${COLORS.Red}80`,
    borderColor: `${COLORS.Red}50`,
  },

  numpadWrapper: {
    alignItems: 'center',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(16),
    width: ms(280),
  },
  numberCircle: {
    width: ms(70),
    height: ms(70),
    borderRadius: ms(35),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.TextSecondary,
  },
  emptyCircle: {
    width: ms(70),
    height: ms(70),
  },
  numberText: {
    fontSize: ms(24),
    fontWeight: '700',
    color: COLORS.WhiteSmoke,
  },
});

export default PasswordValidator;
