import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSectionDesignBubble from './SubComponent/BottomSectionDesignBubble';
import { ms } from 'react-native-size-matters';
import SendAgainCard from './SubComponent/SendAgainCard';

const BottomSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.designBubble}>
        <BottomSectionDesignBubble />
      </View>
      <View style={styles.SendAndIncomeContainer}>
        <SendAgainCard />
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(17),
  },
  designBubble: {
    zIndex: 100,
    position: 'relative',
    top: -17,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  SendAndIncomeContainer: {},
});

export default BottomSection;
