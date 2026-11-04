import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ColorInterface, COLORS } from '../../Extras/Constants/colors';
import { moderateScale, ms, s, vs } from 'react-native-size-matters';
const GOOGLE_LOGO = require('../../Extras/Assets/GOOGLE_LOGO.png');

interface GoogleLoginButtonProps {
  onPress: () => void;
  loading?: boolean;
}

const GoogleLoginButton = ({
  onPress,
  loading = false,
}: GoogleLoginButtonProps) => {
  const styles = getStyles(COLORS);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, loading && styles.disabled]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          style={styles.loading}
          size="small"
          color={COLORS.Black}
        />
      ) : (
        <>
          <Image source={GOOGLE_LOGO} style={styles.GOOGLE_IMG} />
          <Text style={styles.text}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (COLORS: ColorInterface) =>
  StyleSheet.create({
    container: {
      height: moderateScale(50),
      gap: moderateScale(10, 0.4),
      borderRadius: moderateScale(30, 0.4),
      backgroundColor: COLORS.LevenderGrey,
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
    },
    loading: {
      paddingHorizontal: ms(20),
    },
    disabled: {
      opacity: 0.7,
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

export default GoogleLoginButton;
