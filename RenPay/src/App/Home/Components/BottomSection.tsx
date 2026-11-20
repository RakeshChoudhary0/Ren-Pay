import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSectionDesignBubble from './SubComponent/BottomSectionDesignBubble';
import { ms } from 'react-native-size-matters';
import SendAgainCard from './SubComponent/SendAgainCard';
import GraphCard from './SubComponent/GraphCard';
import { COLORS } from '../../../Extras/Constants/colors';
import Icon from 'react-native-vector-icons/Feather';
import useAuth from '../../../Extras/Context/AuthContext';
import RecentTrancationCard from '../../SharedComponents/RecentTrancationCard';

export interface TransactionType {
  amount: string;
  created_at: string;
  currency: string;
  failure_reason: string | null;
  id: string;
  idempotency_key: string;
  note: string | null;
  receiver_id: string;
  receiver_name : string;
  sender_id: string;
  sender_name: string;
  status: string;
  txn_id: string;

  type: string;
  updated_at: string;
}

type FilterType = 'pastWeek' | 'all';

const BottomSection = () => {
  const { FetchTransactions } = useAuth();

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [filter, setFilter] = useState<FilterType>('pastWeek');
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        // Fetch "all" once (or pass `filter` if your backend filters it)
        const res = await FetchTransactions('all');
        const list: TransactionType[] = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        if (isMounted) {
          setTransactions(list);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, [FetchTransactions]);

  const visibleTransactions = useMemo(() => {
    if (filter === 'all') {
      return transactions;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return transactions.filter(
      (item) => new Date(item.created_at) >= sevenDaysAgo
    );
  }, [transactions, filter]);

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

          <View style={styles.filterRow}>
            <TouchableOpacity activeOpacity={0.3}>
              <Icon name="arrow-right" size={ms(18)} color={COLORS.Black} />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.emptyRecent}>
            <Text style={styles.emptyText}>Loading transactions...</Text>
          </View>
        ) : visibleTransactions.length > 0 ? (
          <View style={styles.scroll}>
            {visibleTransactions.map((tx) => (
              <RecentTrancationCard key={tx.txn_id} tx={tx} userId={user.id} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyRecent}>
            <Icon
              name="clock"
              size={ms(26)}
              color={COLORS.Gray}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>No Recent Transactions</Text>
          </View>
        )}
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
    height: ms(198),
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  filterChip: {
    paddingVertical: ms(4),
    paddingHorizontal: ms(10),
    borderRadius: ms(12),
    backgroundColor: `${COLORS.White}70`,
  },
  activeChip: {
    backgroundColor: COLORS.Black,
  },
  filterText: {
    fontSize: ms(11),
    fontWeight: '600',
    color: COLORS.Gray,
  },
  activeFilterText: {
    color: COLORS.White,
  },
  txnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ms(12),
    backgroundColor: `${COLORS.White}85`,
    borderRadius: ms(12),
  },
  txnTitle: {
    fontSize: ms(13),
    fontWeight: '600',
    color: COLORS.Black,
  },
  txnDate: {
    fontSize: ms(11),
    color: COLORS.Gray,
    marginTop: ms(2),
  },
  txnAmount: {
    fontSize: ms(13),
    fontWeight: '700',
    color: COLORS.Black,
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
