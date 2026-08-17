import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../Extras/Constants/colors';
import MonthlyAnalyticalBubble from './SubComponent/MonthlyAnalyticalBubble';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const MiddleSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.BubblePosition}>
        <MonthlyAnalyticalBubble />
      </View>
      <View style={styles.ButtonsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.Button, styles.FlexButton]}
        >
          <Text style={styles.text}>Send</Text>
          <Icon
            name="arrow-up-circle"
            size={ms(23)}
            color={COLORS.LevenderGrey}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.Button, { backgroundColor: COLORS.LevenderGrey }]}
        >
          <MaterialIcon
            name="qr-code-scanner"
            size={ms(23)}
            color={COLORS.Gray}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.Button, styles.FlexButton]}
        >
          <Icon
            name="arrow-down-circle"
            size={ms(23)}
            color={COLORS.LevenderGrey}
          />
          <Text style={styles.text}>Request</Text>
        </TouchableOpacity>
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
  ButtonsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: ms(10),
  },
  Button: {
    backgroundColor: COLORS.Gray,
    paddingVertical: ms(15),
    paddingHorizontal: ms(15),
    borderRadius: ms(18),
  },

  text: {
    fontWeight: '700',
    fontSize: ms(15),
    color: COLORS.LevenderGrey,
  },

  FlexButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(10),
    width: '39%',
    paddingHorizontal: ms(10),
  },
});

export default MiddleSection;
