import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../../../Extras/Constants/colors';

interface NumberPadProps {
  onKeyPress?: (key: string | number) => void;
}

const NumberPad = ({ onKeyPress }: NumberPadProps) => {
  const keys: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'back'];

  const handlePress = (key: number | string) => {
    if (onKeyPress) {
      onKeyPress(key);
    }
  };

  return (
    <View style={styles.container}>
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
    paddingHorizontal: ms(17),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: ms(10),
  },
  keyWrapper: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(1),
  },
  key: {
    width: ms(111),
    height: ms(74),
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
});

export default NumberPad;
