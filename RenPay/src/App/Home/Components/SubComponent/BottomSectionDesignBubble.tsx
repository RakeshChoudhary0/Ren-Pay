import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../../../Extras/Constants/colors';

const BottomSectionDesignBubble = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ms(80, 0.4),
    height: ms(33, 0.2),
    backgroundColor: COLORS.Black,
    borderBottomLeftRadius: ms(50),
    borderBottomRightRadius: ms(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: ms(33),
    height: ms(3),
    backgroundColor: COLORS.LevenderGrey,
    borderRadius: ms(100),
  },
});

export default BottomSectionDesignBubble;
[];
