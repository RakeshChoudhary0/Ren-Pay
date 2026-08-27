import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../Extras/Constants/colors';
import Header from '../Components/Header';
import PaymentSection from '../Components/PaymentSection';
import { ms } from 'react-native-size-matters';

// Import local image asset
const BackgroundImg = require('../../../Extras/Assets/BackGround.png');

const Payment = () => {
  const route = useRoute();
  const { item } = route.params as { item: any };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.PaymentSection}>
        <PaymentSection item={item} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `${COLORS.Black}ee`,
  },

  PaymentSection: {
    width: '95%',
    marginTop: 'auto',
    alignSelf: 'center',
    marginBottom: ms(20),
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.White,
  },
});

export default Payment;
