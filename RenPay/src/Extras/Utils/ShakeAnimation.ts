import { Animated } from 'react-native';

/**
 * Triggers a horizontal shake animation on an Animated.Value
 * @param {Animated.Value} shakeAnimation - The animated value reference
 * @param {number} [distance=10] - How far the shake moves in pixels
 * @param {number} [duration=50] - Duration of each individual shake tick
 */
export const triggerShake = (
  shakeAnimation: Animated.Value,
  distance: number = 10,
  duration: number = 50,
) => {
  shakeAnimation.setValue(0);
  Animated.sequence([
    Animated.timing(shakeAnimation, {
      toValue: distance,
      duration: duration,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimation, {
      toValue: -distance,
      duration: duration,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimation, {
      toValue: distance,
      duration: duration,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimation, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
    }),
  ]).start();
};
