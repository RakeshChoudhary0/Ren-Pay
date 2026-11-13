import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../Extras/Constants/colors';
import Header from '../Components/Header';
import PaymentSection from '../Components/PaymentSection';
import UserSearchSection, { UserItem } from '../Components/UserSearchSection';
import useAuth from '../../../Extras/Context/AuthContext';

import generateIdempotencyKey from '../../../Extras/Utils/idempotencyKey';

const Payment = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { accountDetails } = useAuth();
  const userBalance = accountDetails?.balance || 0;
  const { user } = useAuth();

  const params =
    (route.params as { sendToUser?: UserItem; idempotency_key?: string }) || {};

  const [selectedUser, setSelectedUser] = useState<UserItem | any>(
    params.sendToUser || null,
  );

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProccedToMpinVerification = async () => {
    if (!selectedUser) {
      if (!selectedUser) {
        Alert.alert('Select Recipient', 'Please select a recipient first.');
        return;
      }
    }

    const parsedAmount = Number(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount greater than 0.',
      );
      return;
    }

    if (parsedAmount > Number(userBalance)) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds.');
      return;
    }

    const idempotencyKey = generateIdempotencyKey(user.id, selectedUser.id);

    navigation.navigate('MpinVerification', {
      receiver_id: selectedUser.id,
      receiver_email: selectedUser.email,
      receiver_name: selectedUser.name,
      amount: amount,
      note: note,
      idempotency_key: idempotencyKey,
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header />
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
            }}
          />
        ) : (
          <UserSearchSection
            onSelectUser={user => {
              setSelectedUser(user);
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
