import React, { useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorInterface, COLORS } from '../../Extras/Constants/colors';
import { ms, s, vs } from 'react-native-size-matters';
import GoogleLoginButton from '../Components/GoogleLoginButton';
import CircularDesign from '../Components/CircularDesign';

const GoogleOAuth = ({ navigation }: { navigation: any }) => {
  const styles = getStyles(COLORS);

  const HandleGoogleLogin = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.DecorationContainer}>
        <CircularDesign />
      </View>
      <View>
        <Text style={styles.centerText}>REN</Text>
        <Text style={styles.centerDiscriptionText}>
          Makes The Payment Easier
        </Text>
      </View>
      <View style={styles.googleLoginButton}>
        <GoogleLoginButton onPress={HandleGoogleLogin} />
        <View style={styles.TAndC}>
          <TouchableOpacity
            onPress={() => {
              console.log('the Button isPressed');
              navigation.navigate('TermsAndConditions');
            }}
          >
            <Text style={styles.termsText}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyles = (COLORS: ColorInterface) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.Black,
    },

    DecorationContainer: {
      position: 'absolute',
      top: ms(-150),
      right: ms(220),
    },
    centerText: {
      color: COLORS.LevenderGrey,
      fontSize: s(30),
      fontWeight: '700',
      fontFamily: 'Rubik-Bold',
    },

    centerDiscriptionText: {
      textAlign: 'center',
      color: COLORS.TextSecondary,
      fontSize: s(12),
      fontWeight: '400',
    },
    img: {
      height: ms(160),
      width: ms(150),
    },
    googleLoginButton: {
      position: 'absolute',
      bottom: ms(20),
      width: '100%',
      alignItems: 'center',
      paddingBottom: vs(30),
    },
    TAndC: {
      flex: 1,
      marginTop: ms(10),
    },

    termsText: {
      fontSize: ms(12),
      fontWeight: '400',
      textAlign: 'center',
      color: COLORS.Gray,
    },
  });
};

export default GoogleOAuth;
