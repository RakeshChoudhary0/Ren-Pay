import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../Extras/Constants/colors';
import Header from '../Components/Header';
import PaymentSection from '../Components/PaymentSection';
import UserSearchSection, { UserItem } from '../Components/UserSearchSection';

const Payment = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const params = (route.params as { sendToUser?: any }) || {};

  // If sendToUser was passed, start with it; otherwise start null so search is shown
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(
    params.sendToUser || null,
  );

  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const userBalance = '12349';

  const handleSendPayment = async () => {
    if (!selectedUser) {
      Alert.alert('Select Recipient', 'Please select a recipient first.');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if (Number(amount) > Number(userBalance)) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds.');
      return;
    }

    try {
      setIsSending(true);
      // Simulate network transaction delay
      await new Promise(resolve => setTimeout(() => resolve(true), 1200));

      Alert.alert(
        'Payment Successful',
        `₹${Number(amount).toLocaleString('en-IN')} sent to ${
          selectedUser.name
        }!`,
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Transaction Failed',
        'Something went wrong. Please try again.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header />
      <View style={styles.content}>
        {selectedUser ? (
          <PaymentSection
            user={selectedUser}
            amount={amount}
            setAmount={setAmount}
            balance={userBalance}
            onSend={handleSendPayment}
            isSending={isSending}
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