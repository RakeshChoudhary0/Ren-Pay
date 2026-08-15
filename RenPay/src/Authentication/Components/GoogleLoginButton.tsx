import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ColorInterface, COLORS } from '../../Extras/Constants/colors';
import { s, vs } from 'react-native-size-matters';
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
      height: vs(45),
      gap: 10,
      borderRadius: 30,
      backgroundColor: COLORS.LevenderGrey,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    text: {
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      color: COLORS.Black,
      marginRight: s(20),
    },
    GOOGLE_IMG: {
      marginLeft: s(6),
      width: s(40),
      height: s(40),
    },
  });
};

export default GoogleLoginButton;
