import React, { useCallback, useRef, useEffect } from 'react';
import {
  Alert,
  Animated,
  Easing,

  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../Extras/Constants/colors';
import Header from '../Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';


export interface UserItem {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export type RootStackParamList = {
  ScanQrScreen: undefined;
  SendPayment: UserItem;
  PaymentResult: undefined;
};

const FRAME_SIZE = ms(240);
const CARD_RADIUS = ms(24);

function parseUserFromQr(rawValue: string): UserItem | null {
  const trimmed = rawValue.trim();

  if (trimmed.startsWith('renpay://')) {
    const queryIndex = trimmed.indexOf('?');
    const queryString = queryIndex >= 0 ? trimmed.slice(queryIndex + 1) : '';
    const params = new URLSearchParams(queryString);

    const id = params.get('id')?.trim() ?? '';
    const name = params.get('name')?.trim() ?? '';
    const email = params.get('email')?.trim() ?? '';
    const avatar = params.get('avatar')?.trim() ?? '';

    if (!id && !email) return null;

    return { id: id || email, name: name || 'RenPay User', email, avatar };
  }

  try {
    const parsed = JSON.parse(trimmed) as Partial<UserItem>;
    if (parsed && (parsed.id || parsed.email)) {
      return {
        id: String(parsed.id ?? parsed.email),
        name: String(parsed.name ?? 'RenPay User'),
        email: String(parsed.email ?? ''),
        avatar: String(parsed.avatar ?? ''),
      };
    }
  } catch {
    // Not JSON
  }

  return null;
}

/** Animated scan line that sweeps inside the frame */
const ScanLine = ({ active }: { active: boolean }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: FRAME_SIZE - ms(6),
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => {
      loop.stop();
      translateY.setValue(0);
      opacity.setValue(0);
    };
  }, [active, translateY, opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.scanLine,
        { opacity, transform: [{ translateY }] },
      ]}
    />
  );
};

/** Pulsing dot in the footer */
const PulseDot = ({ active }: { active: boolean }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.6,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, scale]);

  return (
    <View style={styles.dotWrap}>
      <Animated.View
        style={[
          styles.dotHalo,
        ]}
      />
      <View style={styles.dot} />
    </View>
  );
};

const QR = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const lockRef = useRef(false);


  useFocusEffect(
    useCallback(() => {
      lockRef.current = false;
      return () => {
        lockRef.current = true;
      };
    }, []),
  );

  const unlockScanner = () => {
    lockRef.current = false;
  };

  const handleReadCode = (event: { nativeEvent?: { codeStringValue?: string } }) => {
    const rawValue = event?.nativeEvent?.codeStringValue;
    if (!rawValue || lockRef.current) return;

    lockRef.current = true;

    const user = parseUserFromQr(rawValue);
    if (!user) {
      Alert.alert('Invalid QR Code', 'Could not read recipient details from this QR code.', [
        { text: 'Try Again', onPress: unlockScanner },
      ]);
      return;
    }

    navigation.navigate('Payment', user);
  };

  return (
    <SafeAreaView edges={['top']}  style={styles.root}>
      <Header title="Scan QR Code" horizontalPadding={ms(20)} />

      <View style={styles.body}>
        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Point, Scan, Pay</Text>
          <Text style={styles.subtitle}>
            Center the QR code in the frame to send a payment instantly.
          </Text>
        </View>

        {/* Camera card */}
        <View style={styles.card}>
          <View style={styles.cameraWrap}>
            {isFocused && (
              <Camera
                style={StyleSheet.absoluteFill}
                cameraType={CameraType.Back}
                barcodeFrameSize={{ width: FRAME_SIZE, height: FRAME_SIZE }}
                scanBarcode={true}
                onReadCode={handleReadCode}
                showFrame={false}

              />
            )}

            {/* Subtle vignette to focus attention on the frame */}
            <View pointerEvents="none" style={styles.vignetteTop} />
            <View pointerEvents="none" style={styles.vignetteBottom} />
            <View pointerEvents="none" style={styles.vignetteLeft} />
            <View pointerEvents="none" style={styles.vignetteRight} />

            <View style={styles.overlay} pointerEvents="none">
              <View style={styles.scanBox}>
                {/* Soft inner glow */}
                <View style={styles.innerGlow} pointerEvents="none" />

                {/* Corner brackets */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />

                <ScanLine active={isFocused} />
              </View>
            </View>

            {/* Live badge */}
            <View style={styles.liveBadge} pointerEvents="none">
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Scanning</Text>
            </View>
          </View>
        </View>

        {/* Footer hint */}
        <View style={styles.footer}>
          <View style={styles.hintPill}>
            <PulseDot active={isFocused} />
            <Text style={styles.hintText}>
              Align the RenPay QR code inside the frame
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Icon name="lock" size={ms(12)} color={COLORS.LevenderGrey} />
            <Text style={styles.metaText}>Secure, encrypted scan</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.TextSecondary,
  },
  body: {
    flex: 1,
    paddingHorizontal: ms(20),
  },

  titleBlock: {
    marginTop: ms(6),
    marginBottom: ms(18),
  },
  title: {
    color: COLORS.White,
    fontSize: ms(24),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: ms(6),
    color: COLORS.LevenderGrey,
    fontSize: ms(13),
    lineHeight: ms(19),
  },

  card: {
    height: ms(400),
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: COLORS.Black,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(200,205,225,0.25)',
    shadowColor: COLORS.Black,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cameraWrap: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },

  // Simple directional scrims to spotlight the scan area
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '22%',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '22%',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  vignetteLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '18%',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  vignetteRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '18%',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanBox: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: ms(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: ms(22),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(109,156,65,0.35)', // Green tint
    backgroundColor: 'rgba(109,156,65,0.06)',
  },

  scanLine: {
    position: 'absolute',
    top: ms(6),
    left: ms(12),
    right: ms(12),
    height: ms(2),
    borderRadius: ms(1),
    backgroundColor: COLORS.Green,
    shadowColor: COLORS.Green,
    shadowOpacity: 0.9,
    shadowRadius: ms(6),
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },

  corner: {
    position: 'absolute',
    width: ms(30),
    height: ms(30),
    borderColor: COLORS.White,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: ms(3),
    borderLeftWidth: ms(3),
    borderTopLeftRadius: ms(20),
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: ms(3),
    borderRightWidth: ms(3),
    borderTopRightRadius: ms(20),
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: ms(3),
    borderLeftWidth: ms(3),
    borderBottomLeftRadius: ms(20),
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: ms(3),
    borderRightWidth: ms(3),
    borderBottomRightRadius: ms(20),
  },

  liveBadge: {
    position: 'absolute',
    top: ms(12),
    right: ms(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(10),
    paddingVertical: ms(5),
    borderRadius: ms(999),
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(200,205,225,0.25)',
  },
  liveDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: COLORS.Red,
    marginRight: ms(6),
  },
  liveText: {
    color: COLORS.White,
    fontSize: ms(11),
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  footer: {
    paddingTop: ms(18),
    paddingBottom: ms(24),
    alignItems: 'center',
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    borderRadius: ms(999),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(200,205,225,0.25)',
  },
  hintText: {
    color: COLORS.LevenderGrey,
    fontSize: ms(13),
  },

  dotWrap: {
    width: ms(8),
    height: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ms(10),
  },
  dotHalo: {
    position: 'absolute',
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    backgroundColor: COLORS.Green,
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: COLORS.Green,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(14),
    gap: ms(6),
  },
  metaText: {
    color: COLORS.LevenderGrey,
    fontSize: ms(11),
    letterSpacing: 0.2,
  },
});

export default QR;
