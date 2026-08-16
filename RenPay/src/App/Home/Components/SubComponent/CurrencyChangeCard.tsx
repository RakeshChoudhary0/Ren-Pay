import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../Extras/Constants/colors';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CurrencyChangeCard = ({
  showInr,
  setShowInr,
}: {
  showInr: boolean;
  setShowInr: (value: boolean) => void;
}) => {
  const HandleChange = () => {
    setShowInr(!showInr);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={HandleChange}
        activeOpacity={0.8}
        style={styles.cardContainer}
      >
        <View>
          {showInr && (
            <FontAwesome
              name="inr"
              style={styles.activeINR}
              size={ms(14)}
              color={COLORS.LevenderGrey}
            />
          )}
          {!showInr && <Text style={styles.activeText}>INR</Text>}
        </View>
        <View>
          {!showInr && (
            <Icon
              name="logo-usd"
              style={styles.activeINR}
              size={ms(14)}
              color={COLORS.LevenderGrey}
            />
          )}
          {showInr && <Text style={styles.activeText}>USD</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: ms(12),
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(6),
    backgroundColor: COLORS.WhiteSmoke,
    paddingHorizontal: ms(6),
    paddingVertical: ms(4),
    borderRadius: ms(9),
  },
  activeUSD: {
    backgroundColor: COLORS.Black,
    paddingHorizontal: ms(4),
    paddingVertical: ms(3),
    borderRadius: ms(8),
  },
  activeINR: {
    backgroundColor: COLORS.Black,
    paddingHorizontal: ms(7),
    paddingVertical: ms(3),
    borderRadius: ms(8),
  },
  activeText: {
    fontSize: ms(13),
    fontWeight: 700,
    color: COLORS.Gray,
    letterSpacing: -0.8,
  },
});

export default CurrencyChangeCard;
