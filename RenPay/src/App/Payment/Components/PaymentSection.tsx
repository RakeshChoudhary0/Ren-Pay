import React, { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import SendToCard from './SubComponent/SendToCard';
import AmountSection from './SubComponent/AmountSection';
import { ms } from 'react-native-size-matters';
import NumberPad from './SubComponent/NumberPad';
import { COLORS } from '../../../Extras/Constants/colors';
import Icon from 'react-native-vector-icons/AntDesign';

interface PaymentSectionProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onChangeUser?: () => void;
  inSuficientFund?: boolean;
  setInSuficientFund?: (value: boolean) => void;
  amount: string;
  setAmount: (val: string) => void;
  balance?: string;
  onSend?: () => Promise<void> | void;
  setNote?: (val: string) => void;
  note?: string;
  isSending?: boolean;
}

const PaymentSection = ({
  user,
  onChangeUser,
  amount,
  setAmount,
  balance,
  setNote,
  note,
  onSend,
  isSending = false,
}: PaymentSectionProps) => {
  const isSufficient = Number(amount) > Number(balance);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Top Section: Note in the center */}
        <View style={styles.topInfo}>
          <View style={styles.noteSectionWrapper}>
            <View style={styles.noteContainer}>
              <Icon name="edit" size={ms(15)} color={COLORS.TextSecondary} />
              <TextInput
                placeholder="Add a note (optional)"
                placeholderTextColor={COLORS.TextSecondary}
                value={note}
                onChangeText={setNote}
                style={styles.noteInput}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                maxLength={40}
              />
            </View>
          </View>

          {/* Amount & Recipient Card connected/grouped closer to the keypad */}
          <View style={styles.lowerTopSection}>
            <View style={styles.amountWrapper}>
              <AmountSection amount={amount || '0'} />
            </View>

            <View style={styles.cardWrapper}>
              <SendToCard user={user} onChangeUser={onChangeUser} />
            </View>
          </View>
        </View>

        {/* Bottom Section: Keypad + Swipe to Send */}
        <View style={styles.bottomSection}>
          <NumberPad
            amount={amount}
            balance={balance}
            disable={isSufficient}
            setAmount={setAmount}
            onSend={onSend}
            isSending={isSending}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topInfo: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-between', // Pushes Note to center/top and Amount/Card down
    alignItems: 'center',
  },
  noteSectionWrapper: {
    flex: 1,
    justifyContent: 'center', // Centers the note vertically in the upper screen real estate
    alignItems: 'center',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
    backgroundColor: COLORS.WhiteSmoke,
    borderColor: COLORS.PrimaryBorder,
    borderWidth: 1,
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    borderRadius: ms(20),
  },
  noteInput: {
    color: COLORS.Black,
    fontSize: ms(13),
    fontWeight: '500',
    padding: 0,
  },
  lowerTopSection: {
    width: '100%',
    alignItems: 'center',
    gap: ms(12), // Keeps Amount and User card tightly connected right above the keypad
    paddingBottom: ms(8),
  },
  amountWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  bottomSection: {
    width: '100%',
    justifyContent: 'flex-end',
  },
});

export default PaymentSection;
