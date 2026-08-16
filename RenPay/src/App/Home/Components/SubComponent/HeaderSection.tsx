import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../Extras/Constants/colors';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ICON = require('../../../../Extras/Assets/SQUARE_DOT.png');

const HeaderSection = () => {
  return (
    <View style={styles.HeaderContainer}>
      <View>
        <View style={styles.TitleRow}>
          <Text style={styles.TitleTextBold}>Hi Rakesh! </Text>
          <Text style={styles.TitleText}>Welcome</Text>
        </View>
        <Text style={styles.TitleText}>to your wallet.</Text>
      </View>

      <View style={styles.ButtonContainer}>
        <TouchableOpacity activeOpacity={0.4} style={styles.Button}>
          <Image source={ICON} style={styles.IconImage} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.4} style={styles.Button}>
          <Icon name="bell-badge" size={ms(22)} color={COLORS.Black} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ms(5),
  },

  TitleRow: {
    flexDirection: 'row',
  },
  TitleTextBold: {
    fontSize: ms(17),
    color: COLORS.Black,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  TitleText: {
    fontSize: ms(17),
    color: COLORS.Gray,
    fontWeight: '700',
    letterSpacing: -0.7,
  },

  ButtonContainer: {
    flexDirection: 'row',
    gap: ms(10),
  },
  Button: {
    backgroundColor: COLORS.WhiteSmoke,
    borderRadius: ms(100),
    height: ms(60),
    width: ms(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconImage: {
    height: ms(17),
    width: ms(17),
    resizeMode: 'contain',
  },
});

export default HeaderSection;
