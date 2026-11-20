import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../../Extras/Constants/colors';

const SUCCESS_COLOR = '#22C55E';
const SUCCESS_BG = 'rgba(34, 197, 94, 0.14)';
const FAILURE_COLOR = '#EF4444';
const FAILURE_BG = 'rgba(239, 68, 68, 0.14)';

const formatDateTime = (rawDate?: string | number | null) => {
  if (!rawDate) return null;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const PaymentResultScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const params = route.params || {};
  const txnRecord = params?.transferDetail?.data ?? null;

  const isSuccess = Boolean(
    params?.paymentSuccess ??
      (params?.transferDetail?.success && txnRecord?.status !== 'FAILED'),
  );

  const rawAmount = txnRecord?.amount ?? params?.amount ?? 0;
  const numericAmount = Number(rawAmount);
  const formattedAmount = Number.isNaN(numericAmount)
    ? String(rawAmount)
    : `₹${numericAmount.toLocaleString('en-IN', {
        minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })}`;

  const recipient = params?.recipient || {};
  const recipientName =
    recipient?.name ||
    recipient?.email ||
    (txnRecord?.receiver_id ? `User #${txnRecord.receiver_id}` : 'Recipient');
  const recipientEmail = recipient?.email || null;
  const recipientAvatar = recipient?.avatar || null;
  const receiverId = txnRecord?.receiver_id ?? recipient?.id ?? null;

  const headlineMessage =
    params?.Message ||
    params?.transferDetail?.message ||
    (isSuccess
      ? `Successfully sent ${formattedAmount} to ${recipientName}!`
      : `Failed to send ${formattedAmount} to ${recipientName}!`);

  const failureReason =
    params?.failureReason ||
    txnRecord?.failure_reason ||
    params?.transferDetail?.error ||
    (!isSuccess ? params?.transferDetail?.message : null);

  const txnId = txnRecord?.txn_id || null;
  const statusLabel = txnRecord?.status || (isSuccess ? 'SUCCESS' : 'FAILED');
  const noteText = txnRecord?.note ?? params?.note ?? null;

  const formattedTime = useMemo(() => {
    return (
      formatDateTime(
        txnRecord?.created_at ||
          params?.transferDetail?.TransactionTime ||
          Date.now(),
      ) || ''
    );
  }, [txnRecord?.created_at, params?.transferDetail?.TransactionTime]);

  const accentColor = isSuccess ? SUCCESS_COLOR : FAILURE_COLOR;
  const badgeBg = isSuccess ? SUCCESS_BG : FAILURE_BG;

  const handleDone = () => {
    // Adjust 'MainTabs' or 'Home' to match your root navigator route name
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }),
    );
  };

  const handleRetry = () => {
    const freshIdempotencyKey = `IDEMP_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    navigation.replace('MpinVerification', {
      receiver_id: receiverId,
      receiver_email: recipientEmail,
      receiver_name: recipient?.name || null,
      receiver_avatar: recipientAvatar,
      amount: numericAmount,
      note: noteText,
      idempotency_key: freshIdempotencyKey,
    });
  };

  const handleShareReceipt = async () => {
    const lines = [
      `Payment ${statusLabel}`,
      `Amount: ${formattedAmount}`,
      `${isSuccess ? 'Sent to' : 'Recipient'}: ${recipientName}`,
      txnId ? `Txn ID: ${txnId}` : null,
      formattedTime ? `Time: ${formattedTime}` : null,
      !isSuccess && failureReason ? `Reason: ${failureReason}` : null,
    ].filter(Boolean);

    await Share.share({ message: lines.join('\n') });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Status Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.iconCircle, { backgroundColor: badgeBg }]}>
            <Icon
              name={isSuccess ? 'check' : 'x'}
              size={ms(36)}
              color={accentColor}
            />
          </View>

          <View style={[styles.statusPill, { backgroundColor: badgeBg }]}>
            <Text style={[styles.statusPillText, { color: accentColor }]}>
              {statusLabel}
            </Text>
          </View>

          <Text style={styles.amountText}>{formattedAmount}</Text>
          <Text style={styles.headlineText}>{headlineMessage}</Text>
          {formattedTime ? (
            <Text style={styles.timestampText}>{formattedTime}</Text>
          ) : null}
        </View>

        {/* Failure Reason Banner */}
        {!isSuccess && failureReason ? (
          <View style={styles.errorBox}>
            <Icon
              name="alert-circle"
              size={ms(18)}
              color={FAILURE_COLOR}
              style={styles.errorIcon}
            />
            <View style={styles.errorTextWrap}>
              <Text style={styles.errorTitle}>Why it failed</Text>
              <Text style={styles.errorDescription}>{failureReason}</Text>
            </View>
          </View>
        ) : null}

        {/* Recipient ("Whom You Sent To") Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            {isSuccess ? 'SENT TO' : 'RECIPIENT'}
          </Text>
          <View style={styles.recipientRow}>
            {recipientAvatar ? (
              <Image source={{ uri: recipientAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>
                  {String(recipientName).charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}

            <View style={styles.recipientInfo}>
              <Text style={styles.recipientName} numberOfLines={1}>
                {recipientName}
              </Text>
              {recipientEmail ? (
                <Text style={styles.recipientSub} numberOfLines={1}>
                  {recipientEmail}
                </Text>
              ) : receiverId ? (
                <Text style={styles.recipientSub}>User ID: {receiverId}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Transaction Metadata Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TRANSACTION DETAILS</Text>

          <DetailRow label="Status" value={statusLabel} valueColor={accentColor} />
          <DetailRow label="Amount" value={formattedAmount} />
          {txnId ? <DetailRow label="Transaction ID" value={txnId} mono /> : null}
          {formattedTime ? <DetailRow label="Date & Time" value={formattedTime} /> : null}
          {noteText ? <DetailRow label="Note" value={noteText} /> : null}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        {!isSuccess ? (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.85}>
            <Icon name="refresh-cw" size={ms(16)} color={COLORS.Black} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShareReceipt}
            activeOpacity={0.85}>
            <Icon name="share-2" size={ms(16)} color={COLORS.White} />
            <Text style={styles.secondaryButtonText}>Share Receipt</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleDone}
          activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({
  label,
  value,
  valueColor,
  mono = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  mono?: boolean;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text
      style={[
        styles.detailValue,
        valueColor ? { color: valueColor } : null,
        mono ? styles.monoText : null,
      ]}
      selectable>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  scrollContent: {
    padding: ms(18),
    paddingBottom: ms(32),
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: ms(20),
  },
  iconCircle: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(14),
  },
  statusPill: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
    borderRadius: ms(20),
    marginBottom: ms(10),
  },
  statusPillText: {
    fontSize: ms(11),
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  amountText: {
    fontSize: ms(34),
    fontWeight: '800',
    color: COLORS.White,
    marginBottom: ms(6),
  },
  headlineText: {
    fontSize: ms(15),
    color: '#D4D4D8',
    textAlign: 'center',
    lineHeight: ms(22),
    paddingHorizontal: ms(8),
  },
  timestampText: {
    fontSize: ms(12),
    color: '#888',
    marginTop: ms(6),
  },
  errorBox: {
    flexDirection: 'row',
    backgroundColor: FAILURE_BG,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: ms(14),
    alignItems: 'flex-start',
  },
  errorIcon: {
    marginTop: ms(2),
    marginRight: ms(10),
  },
  errorTextWrap: {
    flex: 1,
  },
  errorTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: FAILURE_COLOR,
    marginBottom: ms(2),
  },
  errorDescription: {
    fontSize: ms(13),
    color: '#FCA5A5',
    lineHeight: ms(18),
  },
  card: {
    backgroundColor: '#141416',
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: '#26262A',
    padding: ms(16),
    marginBottom: ms(14),
  },
  cardLabel: {
    fontSize: ms(11),
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.8,
    marginBottom: ms(12),
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(23),
    marginRight: ms(12),
  },
  avatarFallback: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(23),
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  avatarInitials: {
    fontSize: ms(18),
    fontWeight: '700',
    color: COLORS.White,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: ms(16),
    fontWeight: '700',
    color: COLORS.White,
  },
  recipientSub: {
    fontSize: ms(13),
    color: '#9CA3AF',
    marginTop: ms(2),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ms(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#26262A',
  },
  detailLabel: {
    fontSize: ms(13),
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: ms(13),
    fontWeight: '600',
    color: COLORS.White,
    maxWidth: '62%',
    textAlign: 'right',
  },
  monoText: {
    fontSize: ms(12),
  },
  footer: {
    paddingHorizontal: ms(18),
    paddingTop: ms(10),
    paddingBottom: ms(14),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#222',
    gap: ms(10),
  },
  primaryButton: {
    backgroundColor: COLORS.White,
    paddingVertical: ms(14),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.Black,
    fontSize: ms(15),
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#1E1E22',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: ms(13),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
  },
  secondaryButtonText: {
    color: COLORS.White,
    fontSize: ms(14),
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: SUCCESS_COLOR,
    paddingVertical: ms(14),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
  },
  retryButtonText: {
    color: COLORS.Black,
    fontSize: ms(15),
    fontWeight: '700',
  },
});

export default PaymentResultScreen;
