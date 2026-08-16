import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSectionDesignBubble from './SubComponent/BottomSectionDesignBubble';
import { ms } from 'react-native-size-matters';

const BottomSection = () => {
  return (
    <View>
      <View style={styles.designBubble}>
        <BottomSectionDesignBubble />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  designBubble: {
    zIndex: 100,
    position: 'relative',
    top: -17,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default BottomSection;
