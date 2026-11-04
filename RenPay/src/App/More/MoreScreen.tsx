import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from '../../Extras/Constants/colors';
import useAuth from '../../Extras/Context/AuthContext';

const MoreScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text>MoreScreen</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LevenderGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
