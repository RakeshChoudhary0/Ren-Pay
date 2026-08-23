import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../Extras/Constants/colors';

interface NumericPadProps {
  onPress: (val: number | string) => void;
}

const PAD_KEYS = [
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

export const NumericPad: React.FC<NumericPadProps> = ({ onPress }) => {
  return (
    <View style={styles.numpadWrapper}>
      <View style={styles.numberPad}>
        {PAD_KEYS.map((item, index) => {
          if (item.type === 'empty') {
            return <View key={`empty-${index}`} style={styles.emptyCircle} />;
          }

          return (
            <TouchableOpacity
              key={item.value}
              activeOpacity={0.7}
              style={styles.numberCircle}
              onPress={() => onPress(item.value)}
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
  );
};

const styles = StyleSheet.create({
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
