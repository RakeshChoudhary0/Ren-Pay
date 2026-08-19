import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ColorInterface, COLORS } from '../../Extras/Constants/colors';
import { moderateScale, s, vs } from 'react-native-size-matters';
const GOOGLE_LOGO = require('../../Extras/Assets/GOOGLE_LOGO.png');

const GoogleLoginButton = ({ onPress }: { onPress: () => void }) => {
  const styles = getStyles(COLORS);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}
    >
      <Image source={GOOGLE_LOGO} style={styles.GOOGLE_IMG} />
      <Text style={styles.text}>Continue with Google</Text>
    </TouchableOpacity>
  );
};

const getStyles = (COLORS: ColorInterface) => {
  return StyleSheet.create({
    container: {
      height: moderateScale(50),
      gap: moderateScale(10, 0.4),
      borderRadius: moderateScale(30, 0.4),
      backgroundColor: COLORS.LevenderGrey,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    text: {
      fontSize: moderateScale(14, 0.4),
      fontWeight: '500',
      textAlign: 'center',
      color: COLORS.Black,
      marginRight: moderateScale(20, 0.4),
    },
    GOOGLE_IMG: {
      marginLeft: moderateScale(6),
      width: moderateScale(40),
      height: moderateScale(40),
    },
  });
};

export default GoogleLoginButton;
