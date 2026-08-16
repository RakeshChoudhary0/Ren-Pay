import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../Extras/Constants/colors';

const CircularDesign = () => {
  return (
    <View style={styles.container}>
      <View style={styles.outerRing}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  outerRing: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1.5,
    borderColor: `${COLORS.LevenderGrey}11`, // 20% opacity lavender border
    backgroundColor: `${COLORS.Gray}10`, // Subtle backdrop fill
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularDesign;
