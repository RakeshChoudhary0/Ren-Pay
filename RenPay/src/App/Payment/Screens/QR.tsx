import React, { useCallback, useRef, useEffect } from 'react';
import { Alert, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../Extras/Constants/colors';
import Header from '../Components/Header';

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

/** Single, calm scan line */
const ScanLine = ({ active }: { active: boolean }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      translateY.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: FRAME_SIZE - ms(8),
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.scanLine, { transform: [{ translateY }] }]}
    />
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
    <SafeAreaView edges={['top']} style={styles.root}>
      <Header title="Scan QR Code" horizontalPadding={ms(20)} />

      <View style={styles.body}>
        <Text style={styles.title}>Scan to Pay</Text>
        <Text style={styles.subtitle}>
          Place the RenPay QR code inside the frame below.
        </Text>

        {/* Camera card */}
        <View style={styles.card}>
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

          {/* Symmetric mask: four strips frame the scan box */}
          <View style={styles.mask} pointerEvents="none">
            <View style={styles.maskRow} />
            <View style={styles.maskMiddle}>
              <View style={styles.maskSide} />
              <View style={styles.scanBox}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                <ScanLine active={isFocused} />
              </View>
              <View style={styles.maskSide} />
            </View>
            <View style={styles.maskRow} />
          </View>
        </View>

        {/* Hint */}
        <View style={styles.hint}>
          <Icon name="maximize" size={ms(14)} color={COLORS.Green} />
          <Text style={styles.hintText}>
            Keep the code steady and well-lit
          </Text>
        </View>

        {/* Trust note */}
        <View style={styles.trustRow}>
          <Icon name="lock" size={ms(12)} color={COLORS.LevenderGrey} />
          <Text style={styles.trustText}>Encrypted end-to-end</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  body: {
    flex: 1,
    paddingHorizontal: ms(20),
    justifyContent : 'center',
  },

  title: {

    color: COLORS.White,
    fontSize: ms(24),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginBottom: ms(20),
    color: COLORS.LevenderGrey,
    fontSize: ms(13),
    lineHeight: ms(19),
  },

  card: {
    height: ms(380),
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: COLORS.Black,

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(200,205,225,0.25)',
  },


  mask: {
    ...StyleSheet.absoluteFill,
  },

  maskRow: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',

  },
  maskMiddle: {
    height: FRAME_SIZE,
    flexDirection: 'row',
  },
  maskSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  scanBox: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanLine: {
    position: 'absolute',
    top: ms(4),
    left: ms(10),
    right: ms(10),
    height: ms(2),
    borderRadius: ms(1),
    backgroundColor: COLORS.Green,
  },

  corner: {
    position: 'absolute',
    width: ms(26),
    height: ms(26),
    borderColor: COLORS.Green,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: ms(3),
    borderLeftWidth: ms(3),

  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: ms(3),
    borderRightWidth: ms(3),


  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: ms(3),
    borderLeftWidth: ms(3),

  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: ms(3),
    borderRightWidth: ms(3),

  },

  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ms(16),
    gap: ms(8),
  },
  hintText: {
    color: COLORS.LevenderGrey,
    fontSize: ms(13),
  },

  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ms(10),
    gap: ms(6),
  },
  trustText: {
    color: COLORS.LevenderGrey,
    fontSize: ms(11),
    letterSpacing: 0.2,
  },
});

export default QR;
