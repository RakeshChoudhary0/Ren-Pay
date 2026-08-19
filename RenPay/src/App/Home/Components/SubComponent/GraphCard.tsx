import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../../Extras/Constants/colors';

const GraphCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.TextHeader}> Analytics</Text>

      <View style={styles.GraphWrapper}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '52%',
    gap: ms(7),
  },

  TextHeader: {
    fontSize: ms(14),
    fontWeight: '700',
    color: COLORS.Black,
    letterSpacing: -0.4,
    paddingHorizontal: ms(10),
  },

  GraphWrapper: {
    flex: 1,
    backgroundColor: `${COLORS.White}60`,
    borderRadius: ms(12),
  },
});

export default GraphCard;
