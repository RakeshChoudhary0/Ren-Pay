import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../Extras/Constants/colors';
import { ms, s } from 'react-native-size-matters';

const BrandingText = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.imageContainer}
        source={require('../../Extras/Assets/REH_PAY_LOGO.png')}
      />
      <View style={styles.textContiner}>
        <Text style={[styles.textSec, styles.text]}>
          By proceeding you agree to all
        </Text>
        <Text style={[styles.textPri, styles.text]}>
          T&C Privacy policy & Security Tips
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: ms(50),
    paddingHorizontal: ms(10),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  imageContainer: {
    height: 70,
    width: 70,
  },
  textContiner: {},
  text: {
    letterSpacing: 0.1,
    textAlign: 'right',
  },
  textSec: {
    fontSize: ms(8),
    color: COLORS.White,
  },
  textPri: {
    fontSize: ms(11),
    color: COLORS.Green,
  },
});

export default BrandingText;
