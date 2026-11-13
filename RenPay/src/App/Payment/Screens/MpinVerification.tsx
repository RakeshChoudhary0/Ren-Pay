import { View, Text, Animated, ActivityIndicator } from 'react-native';
import React, { useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../type';

import { NumericPad } from '../../../Authentication/Components/NumericPad';
import NumberPad from '../Components/SubComponent/NumberPad';
import { PinDisplay } from '../../../Authentication/Components/PinDisplay';
import { triggerShake } from '../../../Extras/Utils/ShakeAnimation';
import useAuth from '../../../Extras/Context/AuthContext';
import { COLORS } from '../../../Extras/Constants/colors';

const PIN_LENGTH = 6;

const MpinVerification = () => {
  const route = useRoute<RootStackParamList['MpinVerification']>();
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const data = route.params;

  const [pin, setPin] = useState<number[]>([]);
  const [invalidIndicator, setInvalidIndicator] = useState(false);

  const { verifyPin, user, pinLoading } = useAuth();

  const handlePress = async (val: any) => {
    if (pinLoading) return;
    if (val === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < PIN_LENGTH) {
      const newPin = [...pin, val];
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        const TYPED_PIN = newPin.join('');

        try {
          const res = await verifyPin(TYPED_PIN);
          if (res?.data?.success) {
            console.log('The PIN is correct');
          } else {
            setInvalidIndicator(true);
            triggerShake(shakeAnimation);
            setTimeout(() => {
              setPin([]);
              console.log('Password was incorrect');
              setInvalidIndicator(false);
            }, 200);
          }
        } catch (error) {
          setInvalidIndicator(true);
          triggerShake(shakeAnimation);
          setTimeout(() => {
            setPin([]);
            setInvalidIndicator(false);
          }, 200);
        }
      }
    }
  };
  console.log(data);
  return (
    <View>
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
          style={{ marginTop: 10 }}
        />
      )}

      <NumericPad onPress={handlePress} disabled={pinLoading} />
    </View>
  );
};

export default MpinVerification;
