import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../Extras/Constants/colors';
import { ms } from 'react-native-size-matters';
import UpperCard from '../Components/UpperCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import MiddleSection from '../Components/MiddleSection';
import BottomSection from '../Components/BottomSection';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <UpperCard />
        </SafeAreaView>
      </View>
      <View style={styles.container2}>
        <MiddleSection />
      </View>
      <View style={styles.container3}>
        <BottomSection />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  container1: {
    backgroundColor: COLORS.LevenderGrey,
    height: ms(280),
    borderRadius: ms(20),
    width: '100%',
  },
  container2: {
    height: ms(110),
  },
  container3: {
    backgroundColor: COLORS.WhiteSmoke,
    flex: 1,
    borderRadius: ms(20),
    width: '100%',
  },
});

export default HomePage;
