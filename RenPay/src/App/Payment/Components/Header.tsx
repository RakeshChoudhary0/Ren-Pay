import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../../Extras/Constants/colors';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.4}
        style={styles.Button}
      >
        <Icon
          name="chevron-with-circle-left"
          size={ms(22)}
          color={COLORS.White}
        />
      </TouchableOpacity>

      <View style={styles.textWrapper} pointerEvents="none">
        <Text style={styles.text}>Sent To</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: ms(5),
    paddingHorizontal: ms(22),
    position: 'relative',
  },
  Button: {
    backgroundColor: COLORS.Gray,
    borderRadius: ms(100),
    height: ms(58),
    width: ms(58),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  textWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: ms(17),
    color: COLORS.White,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Header;
