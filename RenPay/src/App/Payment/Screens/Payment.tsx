import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../Extras/Constants/colors';
import Header from '../Components/Header';
import PaymentSection from '../Components/PaymentSection';
import UserSearchSection, { UserItem } from '../Components/UserSearchSection';
import useAuth from '../../../Extras/Context/AuthContext';
import generateIdempotencyKey from '../../../Extras/Utils/idempotencyKey';

interface PaymentRouteParams {
  id?: string | number;
  name?: string;
  email?: string;
  avatar?: string;
  sendToUser?: UserItem;
  idempotency_key?: string;
}

const extractUserFromParams = (
  params: PaymentRouteParams | undefined,
): UserItem | null => {
  if (!params) return null;

  if (params.sendToUser) {
    return params.sendToUser;
  }

  const email = typeof params.email === 'string' ? params.email.trim() : '';
  const id = params.id != null ? String(params.id).trim() : '';
  const rawName = typeof params.name === 'string' ? params.name.trim() : '';
  const avatar = typeof params.avatar === 'string' ? params.avatar.trim() : '';

  if (!id && !email && !rawName) {
    return null;
  }

  return {
    id,
    name: rawName || (email ? email.split('@')[0] : 'Receiver'),
    email,
    avatar,
  } as UserItem;
};

const Payment = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { accountDetails, user } = useAuth();
  const userBalance = accountDetails?.balance || '0';

  const routeParams = route.params as PaymentRouteParams | undefined;

  const resolvedUser = useMemo(
    () => extractUserFromParams(routeParams),
    [routeParams],
  );

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(
    resolvedUser,
  );
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resolvedUser) {
      setSelectedUser(resolvedUser);
    }
  }, [resolvedUser]);

  const handleProccedToMpinVerification = async () => {
    if (isLoading) return;

    if (!selectedUser) {
      Alert.alert('Select Recipient', 'Please select a recipient first.');
      return;
    }

    const parsedAmount = Number(amount);

    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount greater than 0.',
      );
      return;
    }

    if (parsedAmount > userBalance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Session Error', 'Unable to verify sender account.');
      return;
    }

    setIsLoading(true);
    try {
      const idempotencyKey = generateIdempotencyKey(
        String(user.id),
        String(selectedUser.id),
      );

      navigation.navigate('MpinVerification', {
        receiver_id: selectedUser.id,
        receiver_email: selectedUser.email,
        receiver_name: selectedUser.name,
        receiver_avatar: selectedUser.avatar,
        amount,
        note,
        idempotency_key: idempotencyKey,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header title="Sent To" />
      <View style={styles.content}>
        {selectedUser ? (
          <PaymentSection
            user={selectedUser}
            amount={amount}
            setNote={setNote}
            setAmount={setAmount}
            balance={userBalance}
            onSend={handleProccedToMpinVerification}
            isSending={isLoading}
            onChangeUser={() => {
              setSelectedUser(null);
              setAmount('');
              setNote('');
            }}
          />
        ) : (
          <UserSearchSection
            onSelectUser={(usr: UserItem) => {
              setSelectedUser(usr);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
});

export default Payment;
