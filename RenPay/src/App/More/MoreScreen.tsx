import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
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
import Header from '../Payment/Components/Header';

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
    try {
      await Share.share({
        message: `Scan or open this link to pay ${user?.name || 'me'} on RenPay:\n${paymentUrl}`,
        url: paymentUrl,
      });
    } catch {
      // Share dismissed or unavailable
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Header title="Receive Payment" horizontalPadding={20}/>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introBlock}>
          <Text style={styles.title}>Scan to Pay</Text>
          <Text style={styles.subtitle}>
            Share your RenPay QR code or link to receive payments directly.
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
              {user?.email ? (
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.qrSection}>
            <View style={styles.qrFrame}>
              {paymentUrl ? (
                <QRCode
                  value={paymentUrl}
                  size={ms(196)}
                  color={COLORS.Black}
                  backgroundColor={COLORS.White}
                />
              ) : (
                <Text style={styles.placeholderText}>Generating QR code...</Text>
              )}
            </View>
            <Text style={styles.qrCaption}>RenPay Instant QR</Text>
          </View>

          <View style={styles.linkBox}>
            <Text style={styles.linkLabel}>Payment Link</Text>
            <Text style={styles.linkText} numberOfLines={2} selectable>
              {paymentUrl || '—'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.shareButton, !paymentUrl && styles.shareButtonDisabled]}
          onPress={handleShare}
          disabled={!paymentUrl}
        >
          <Text style={styles.shareButtonText}>Share Payment Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ms(20),
    paddingTop: ms(10),
    paddingBottom: ms(16),
    gap: ms(18),
  },
  introBlock: {
    alignItems: 'center',
    gap: ms(4),
    paddingHorizontal: ms(12),
  },
  title: {
    color: COLORS.White,
    fontSize: ms(20),
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.WhiteSmoke,
    fontSize: ms(13),
    lineHeight: ms(18),
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.TextSecondary,
    borderRadius: ms(24),
    padding: ms(20),
    gap: ms(16),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  avatar: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),

  },
  avatarFallback: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: COLORS.Gray,
    borderWidth: 1,
    borderColor: COLORS.PrimaryBorder,
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
    fontWeight: '600',
  },
  userEmail: {
    color: COLORS.WhiteSmoke,
    fontSize: ms(12),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.PrimaryBorder,
    opacity: 0.45,
  },
  qrSection: {
    alignItems: 'center',
    gap: ms(10),
  },
  qrFrame: {
    backgroundColor: COLORS.White,
    padding: ms(16),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: COLORS.LevenderGrey,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: ms(232),
    minHeight: ms(232),
  },
  placeholderText: {
    color: COLORS.Gray,
    fontSize: ms(13),
    fontWeight: '500',
  },
  qrCaption: {
    color: COLORS.LevenderGrey,
    fontSize: ms(12),
    fontWeight: '500',
  },
  linkBox: {
    backgroundColor: COLORS.Black,
    borderWidth: 1,
    borderColor: COLORS.Gray,
    borderRadius: ms(14),
    paddingHorizontal: ms(14),
    paddingVertical: ms(12),
    gap: ms(4),
  },
  linkLabel: {
    color: COLORS.LevenderGrey,
    fontSize: ms(11),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  linkText: {
    color: COLORS.WhiteSmoke,
    fontSize: ms(11),
    lineHeight: ms(16),
  },
  footer: {
    paddingHorizontal: ms(20),
    paddingTop: ms(8),
    paddingBottom: ms(16),
    backgroundColor: COLORS.Black,
  },
  shareButton: {
    backgroundColor: COLORS.LevenderGrey,
    paddingVertical: ms(15),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonDisabled: {
    backgroundColor: COLORS.Gray,
    opacity: 0.6,
  },
  shareButtonText: {
    color: COLORS.Black,
    fontSize: ms(15),
    fontWeight: '700',
  },
});

export default MoreScreen;
