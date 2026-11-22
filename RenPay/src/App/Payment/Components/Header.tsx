import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../../Extras/Constants/colors';
import { CommonActions, useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  horizontalPadding? : number
};

const Header = ({ title, onBackPress , horizontalPadding = 0 }: HeaderProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' as never }],
        })
      );
    }
  };

  return (
    <View style={[styles.HeaderContainer , {paddingHorizontal : horizontalPadding}]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.4}
        style={styles.Button}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Icon
          name="chevron-with-circle-left"
          size={ms(22)}
          color={COLORS.White}
        />
      </TouchableOpacity>

      <View style={styles.textWrapper} pointerEvents="none">
        <Text style={styles.text} numberOfLines={1}>
          {title}
        </Text>
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
