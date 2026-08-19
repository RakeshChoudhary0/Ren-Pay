import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.scroll}>
            <RecentTrancationCard />
            <RecentTrancationCard />
            <RecentTrancationCard />
            <RecentTrancationCard />
            <RecentTrancationCard />
            <RecentTrancationCard />
            <RecentTrancationCard />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(12),
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
    justifyContent: 'space-around',
  },

  historySection: {
    flex: 1,
    paddingTop: ms(20),
  },

  scroll: {
    gap: ms(6),
  },

  HistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: ms(9),
    paddingHorizontal: ms(10),
  },
  TextHeader: {
    fontSize: ms(14),
    fontWeight: '700',
    color: COLORS.Black,
    letterSpacing: -0.4,
  },
});

export default BottomSection;
