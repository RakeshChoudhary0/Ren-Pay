import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../Extras/Constants/colors';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderSection from './SubComponent/HeaderSection';
import CurrencyChangeCard from './SubComponent/CurrencyChangeCard';
import MoneySection from './SubComponent/MoneySection';

const ICON = require('../../../Extras/Assets/SQUARE_DOT.png');

const user = {
  name: 'Rakesh Choudhary',
  Balance: '123',
};

const UpperCard = () => {
  const [showInr, setShowInr] = useState(true);
  return (
    <View style={styles.container}>
      <HeaderSection />
      <CurrencyChangeCard setShowInr={setShowInr} showInr={showInr} />
      <MoneySection Balance={user.Balance} showInr={showInr} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(22),
  },
});

export default UpperCard;
