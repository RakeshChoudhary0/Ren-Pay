import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../Extras/Constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { TransactionType } from '../Home/Components/BottomSection';

interface RecentTrancationCardProps {
  tx: TransactionType;
  userId: string;
  onPress?: (tx: TransactionType) => void;
}

const formatTxnDate = (dateString: string) => {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
};

const RecentTrancationCard = ({
  tx,
  userId,
  onPress,
}: RecentTrancationCardProps) => {
  const isSent = tx.sender_id === userId;
  const counterpartyName = isSent
    ? tx.receiver_name
    : tx.sender_name  ;

  const formattedDate = formatTxnDate(tx.created_at);
  const subtitle = tx.note
    ? `${tx.note}${formattedDate ? ` • ${formattedDate}` : ''}`
    : formattedDate || tx.type;

  const formattedAmount = Number.isNaN(Number(tx.amount))
    ? tx.amount
    : Number(tx.amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.container}
      onPress={() => onPress?.(tx)}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.sendReciveIndicator,
            isSent ? styles.sentBadge : styles.receivedBadge,
          ]}
        >
          <Icon
            name="arrow-forward"
            size={ms(22)}
            color={isSent ? COLORS.Black : COLORS.White}
            style={{
              transform: [{ rotateZ: isSent ? '-45deg' : '135deg' }],
            }}
          />
        </View>

        <View style={styles.metaSection}>
          <Text style={styles.name} numberOfLines={1}>
            {counterpartyName}
          </Text>
          <Text style={styles.time} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.amountSection}>
        <Text
          style={[
            styles.amount,
            !isSent && styles.receivedAmount,
          ]}
          numberOfLines={1}
        >
          {isSent ? '-' : '+'}
          {tx.currency === 'INR' ? '₹' : `${tx.currency} `}
          {formattedAmount}
        </Text>
        {tx.status && tx.status.toLowerCase() !== 'completed' && (
          <Text style={styles.statusText}>{tx.status}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: ms(18),
    backgroundColor: `${COLORS.White}75`,
    paddingVertical: ms(8),
    paddingHorizontal: ms(8),
    paddingRight : ms(19),
    flexDirection: 'row',
    alignItems: 'center',

  },
  leftSection: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  sendReciveIndicator: {
    borderRadius: ms(40),
    height: ms(46),
    width: ms(46),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentBadge: {
    backgroundColor: COLORS.WhiteSmoke,
  },
  receivedBadge: {
    backgroundColor: COLORS.Green,
  },
  metaSection: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: ms(13),
    fontWeight: '600',
    color: COLORS.Black,
  },
  time: {
    fontSize: ms(12),
    color: COLORS.Gray,
    marginTop: ms(2),
  },
  amountSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: ms(15),
    fontWeight: '700',
    color: COLORS.Black,
  },
  receivedAmount: {
    color: '#16A34A',
  },
  statusText: {
    fontSize: ms(10),
    fontWeight: '600',
    color: COLORS.Gray,
    marginTop: ms(2),
    textTransform: 'capitalize',
  },
});

export default RecentTrancationCard;
