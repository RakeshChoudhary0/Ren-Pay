import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSectionDesignBubble from './SubComponent/BottomSectionDesignBubble';
import { ms } from 'react-native-size-matters';
import SendAgainCard from './SubComponent/SendAgainCard';
import GraphCard from './SubComponent/GraphCard';
import { COLORS } from '../../../Extras/Constants/colors';
import RecentTrancationCard from '../../SharedComponents/RecentTrancationCard';
import Icon from 'react-native-vector-icons/Feather';

const BottomSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.designBubble}>
        <BottomSectionDesignBubble />
      </View>

      <View style={styles.SendAndIncomeContainer}>
        <SendAgainCard />
        <GraphCard />
      </View>
      <View style={styles.historySection}>
        <View style={styles.HistoryHeader}>
          <Text style={styles.TextHeader}>Recent Activity</Text>
          <TouchableOpacity activeOpacity={0.3}>
            <Icon name="arrow-right" size={ms(18)} color={COLORS.Black} />
          </TouchableOpacity>
        </View>

        <View style={styles.scroll}>{/* List items will render here */}</View>
        <View style={styles.emptyRecent}>
          <Icon
            name="clock"
            size={ms(26)}
            color={COLORS.Gray}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>No Recent Transactions</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(12),
    paddingBottom: ms(30),
  },
  designBubble: {
    zIndex: 100,
    position: 'relative',
    top: -17,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  SendAndIncomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: ms(10),
  },

  historySection: {
    marginTop: ms(20),
    minHeight: ms(160),
  },

  scroll: {
    gap: ms(8),
  },

  HistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: ms(12),
    paddingHorizontal: ms(10),
  },

  TextHeader: {
    fontSize: ms(14),
    fontWeight: '700',
    color: COLORS.Black,
    letterSpacing: -0.4,
  },
  emptyRecent: {
    paddingVertical: ms(30),
    paddingHorizontal: ms(20),
    backgroundColor: `${COLORS.White}60`,
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: ms(8),
    opacity: 0.6,
  },
  emptyText: {
    fontSize: ms(13),
    fontWeight: '500',
    color: COLORS.Gray,
  },
});

export default BottomSection;
