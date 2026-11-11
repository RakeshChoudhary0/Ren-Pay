import React, { useState } from 'react';
import {  StyleSheet, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import HeaderSection from './SubComponent/HeaderSection';
import CurrencyChangeCard from './SubComponent/CurrencyChangeCard';
import MoneySection from './SubComponent/MoneySection';
//

const UpperCard = () => {
  const [showInr, setShowInr] = useState(true);
  return (
    <View style={styles.container}>
      <HeaderSection />
      <CurrencyChangeCard setShowInr={setShowInr} showInr={showInr} />
      <MoneySection  showInr={showInr} />
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
