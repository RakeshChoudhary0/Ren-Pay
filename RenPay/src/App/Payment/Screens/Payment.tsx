import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../Extras/Constants/colors';

// Import local image asset
const BackgroundImg = require('../../../Extras/Assets/BackGround.png');

const Payment = () => {
  const route = useRoute();
  const { item } = route.params as { item: any };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hey this is the Payment screen</Text>
      <Text style={styles.text}>{item.email}</Text>
      <Text style={styles.text}>{item.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  text: {
    color: COLORS.Black, // Adjust color so it contrasts with your background image
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Payment;
