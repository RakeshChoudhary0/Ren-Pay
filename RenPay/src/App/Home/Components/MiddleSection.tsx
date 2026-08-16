import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../Extras/Constants/colors';
import MonthlyAnalyticalBubble from './SubComponent/MonthlyAnalyticalBubble';

const MiddleSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.BubblePosition}>
        <MonthlyAnalyticalBubble />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  BubblePosition: {
    position: 'absolute',
    top: -18,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
});

export default MiddleSection;
