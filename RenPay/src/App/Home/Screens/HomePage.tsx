import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomePage = () => {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <Text>HomePage</Text>
    </View>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default HomePage;
