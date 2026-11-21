import React, { useMemo } from 'react';
import {
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { ms } from 'react-native-size-matters';
import { COLORS } from '../../Extras/Constants/colors';
import useAuth from '../../Extras/Context/AuthContext';


interface AuthUserWithMpin {
  id?: string | number;
  name?: string;
  email?: string;
  avatar?: string;
  mpin?: string;
}

const buildPaymentUrl = (rawUser: AuthUserWithMpin | null | undefined): string => {
  if (!rawUser) return '';

  // Explicitly exclude mpin from the payload
  const { id, name, email, avatar } = rawUser;

  const queryEntries: Array<[string, string]> = [
    ['id', id != null ? String(id).trim() : ''],
    ['name', (name || '').trim()],
    ['email', (email || '').trim()],
    ['avatar', (avatar || '').trim()],
  ];

  const queryString = queryEntries
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `renpay://pay?${queryString}`;
};

const MoreScreen = () => {
  const { user } = useAuth();

  const paymentUrl = useMemo(() => buildPaymentUrl(user), [user]);

  const userInitial = useMemo(() => {
    const label = (user?.name || user?.email || 'R').trim();
    return label.charAt(0).toUpperCase() || 'R';
  }, [user?.name, user?.email]);

  const handleShare = async () => {
    if (!paymentUrl) return;
    await Share.share({
      message: `Scan or open this link to pay ${user?.name || 'me'} on RenPay:\n${paymentUrl}`,
      url: paymentUrl,
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Receive Payment</Text>
        <Text style={styles.headerSubtitle}>
          Share your QR code to get paid on RenPay
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.profileRow}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{userInitial}</Text>
            </View>
          )}

          <View style={styles.profileMeta}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'RenPay User'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email || ''}
            </Text>
          </View>
        </View>

        <View style={styles.qrFrame}>
          {paymentUrl ? (
            <QRCode
              value={paymentUrl}
              size={ms(205)}
              color={COLORS.Black}
              backgroundColor={COLORS.White}
            />
          ) : (
            <Text style={styles.placeholderText}>Loading QR code...</Text>
          )}
        </View>

        <View style={styles.linkBox}>
          <Text style={styles.linkLabel}>Deep Link Payload</Text>
          <Text style={styles.linkText} numberOfLines={2}>
            {paymentUrl || '—'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.shareButton}
        onPress={handleShare}
        disabled={!paymentUrl}
      >
        <Text style={styles.shareButtonText}>Share Payment Link</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
    paddingHorizontal: ms(20),
    justifyContent: 'space-between',
    paddingBottom: ms(20),
  },
  header: {
    paddingTop: ms(12),
    gap: ms(6),
  },
  headerTitle: {
    color: COLORS.White,
    fontSize: ms(24),
    fontWeight: '700',
  },
  headerSubtitle: {
    color: COLORS.WhiteSmoke,
    fontSize: ms(13),
  },
  card: {
    backgroundColor: COLORS.TextSecondary,
    borderWidth: 1,
    borderColor: COLORS.PrimaryBorder,
    borderRadius: ms(22),
    padding: ms(20),
    alignItems: 'center',
    gap: ms(18),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: ms(12),
  },
  avatar: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(23),
    borderWidth: 1.5,
    borderColor: COLORS.LevenderGrey,
  },
  avatarFallback: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(23),
    backgroundColor: COLORS.Gray,
    borderWidth: 1.5,
    borderColor: COLORS.LevenderGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: COLORS.White,
    fontSize: ms(18),
    fontWeight: '700',
  },
  profileMeta: {
    flex: 1,
    gap: ms(2),
  },
  userName: {
    color: COLORS.White,
    fontSize: ms(16),
    fontWeight: '700',
  },
  userEmail: {
    color: COLORS.LevenderGrey,
    fontSize: ms(12),
  },
  qrFrame: {
    backgroundColor: COLORS.White,
    padding: ms(18),
    borderRadius: ms(18),
    borderWidth: 2,
    borderColor: COLORS.LevenderGrey,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: ms(245),
    minHeight: ms(245),
  },
  placeholderText: {
    color: COLORS.Gray,
    fontSize: ms(13),
    fontWeight: '500',
  },
  linkBox: {
    width: '100%',
    backgroundColor: COLORS.Black,
    borderWidth: 1,
    borderColor: COLORS.Gray,
    borderRadius: ms(12),
    padding: ms(12),
    gap: ms(4),
  },
  linkLabel: {
    color: COLORS.LevenderGrey,
    fontSize: ms(11),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  linkText: {
    color: COLORS.WhiteSmoke,
    fontSize: ms(11),
  },
  shareButton: {
    backgroundColor: COLORS.LevenderGrey,
    paddingVertical: ms(15),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: COLORS.Black,
    fontSize: ms(15),
    fontWeight: '700',
  },
});

export default MoreScreen;
