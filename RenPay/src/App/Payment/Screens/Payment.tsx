import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../Extras/Constants/colors';
import Header from '../Components/Header';
import PaymentSection from '../Components/PaymentSection';
import { ms } from 'react-native-size-matters';

// Import local image asset
const BackgroundImg = require('../../../Extras/Assets/BackGround.png');

const Payment = () => {
  const route = useRoute();
  const { sendToUser } = route.params as { sendToUser: any };
  console.log('🚀 ~ Payment ~ item:', sendToUser);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header />
      <View style={styles.PaymentSection}>
        <PaymentSection user={sendToUser} />
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
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default Payment;
