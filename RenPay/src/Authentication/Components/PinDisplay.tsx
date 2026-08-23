import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../Extras/Constants/colors';

interface PinDisplayProps {
  pinLength: number;
  pinCount: number;
  invalidIndicator: boolean;
  shakeAnimation: Animated.Value;
}

export const PinDisplay: React.FC<PinDisplayProps> = ({
  pinLength,
  pinCount,
  invalidIndicator,
  shakeAnimation,
}) => {
  return (
    <Animated.View
      style={[
        styles.inputWrapper,
        { transform: [{ translateX: shakeAnimation }] },
      ]}
    >
      {Array.from({ length: pinLength }).map((_, index) => {
        const isFilled = index < pinCount;
        return (
          <View
            key={index}
            style={[
              styles.pinDot,
              isFilled && styles.pinDotFilled,
              invalidIndicator && styles.invalidDot,
            ]}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
});
