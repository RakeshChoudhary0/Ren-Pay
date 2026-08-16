import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../../../Extras/Constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const MonthlyAnalyticalBubble = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Icon
          name="trending-up-outline"
          size={ms(15)}
          color={COLORS.WhiteSmoke}
        />
        <Text style={styles.text}> +2.10%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ms(35),
    width: ms(80),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.Black,
    borderRadius: ms(100),
  },

  innerContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.Green,
    margin: ms(3),
    borderRadius: ms(100),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: ms(3),
  },

  text: {
    fontWeight: '600',
    color: COLORS.LevenderGrey,
    fontSize: ms(11),
    letterSpacing: -1,
  },
});

export default MonthlyAnalyticalBubble;
