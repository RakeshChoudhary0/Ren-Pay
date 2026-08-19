import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { ms, s } from 'react-native-size-matters';
import { COLORS } from '../../Extras/Constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const RecentTrancationCard = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.ProfileSection}>
        <View style={styles.sendReciveIndicator}>
          <Icon
            name="arrow-forward-circle"
            size={ms(35)}
            color={COLORS.Black}
            style={{ transform: [{ rotateZ: '140deg' }] }}
          />
        </View>
        <View>
          <Text style={styles.name}>Rakesh</Text>
          <Text style={styles.time}>1 Hour Ago</Text>
        </View>
      </View>
      <View style={styles.AmountSection}>
        <Text style={styles.Amount}>+$150000</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: ms(20),
    backgroundColor: `${COLORS.White}60`,
    paddingVertical: ms(9),
    paddingHorizontal: ms(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ProfileSection: {
    flexDirection: 'row',
    gap: ms(10),
    alignItems: 'center',
  },

  sendReciveIndicator: {
    backgroundColor: COLORS.WhiteSmoke,
    borderRadius: ms(100),
    height: ms(55),
    width: ms(55),
    alignItems: 'center',
    justifyContent: 'center',
  },

  name: {
    fontSize: ms(18),
    fontWeight: '700',
  },
  time: {
    fontSize: ms(12),
    color: COLORS.Gray,
  },

  Amount: {
    fontSize: ms(17),
    fontWeight: '700',
    paddingRight: ms(6),
    color: COLORS.Black,
  },

  AmountSection: {
    justifyContent: 'center',
  },
});

export default RecentTrancationCard;
