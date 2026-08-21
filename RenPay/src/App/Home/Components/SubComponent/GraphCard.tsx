import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import { LineChart } from 'react-native-gifted-charts';
import { COLORS } from '../../../../Extras/Constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const GraphCard = () => {
  const rawData = [
    { value: 20 },
    { value: 80 },
    { value: 0 },
    { value: 90 },
    { value: 90 },
  ];

  const processedData = rawData.map((item, index) => {
    if (index === 0) {
      return {
        ...item,
        dataPointText: 'Base',
        dataPointTxtColor: '#666',
      };
    }

    const prevValue = rawData[index - 1].value;
    const diff = item.value - prevValue;
    const pctChange = ((diff / prevValue) * 100).toFixed(1);

    const isPositive = diff >= 0;
    const changeLabel = `${isPositive ? '+' : ''}${pctChange}%`;

    return {
      ...item,
      dataPointText: changeLabel,
      dataPointTxtColor: isPositive ? '#2e7d32' : '#d32f2f',
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.TextHeader}> Analytics</Text>
      <View style={styles.GraphWrapper}>
        <Text style={styles.GrowthText}>This Month</Text>

        <View style={styles.ChartContainer}>
          <LineChart
            data={processedData}
            height={ms(40)}
            color={COLORS.Green}
            dataPointsColor={COLORS.Green}
            dataPointsRadius={ms(3)}
            curved
            // Remove Bottom X-Axis Padding & Space
            xAxisThickness={0}
            xAxisTextNumberOfLines={0}
            xAxisLabelsVerticalShift={0}
            labelsExtraHeight={0}
            yAxisLabelWidth={0}
            // Hide Axes & Rules
            hideYAxisText
            hideAxesAndRules
            hideRules
            hideDataPoints1
            yAxisColor="transparent"
            xAxisColor="transparent"
            // Flush Horizontal Spacing
            initialSpacing={0}
            endSpacing={0}
          />
        </View>

        <View style={styles.BottomSection}>
          <Text style={styles.Money}>$5678.99</Text>
          <View style={styles.GrowthPercentage}>
            <Icon
              name="trending-up-outline"
              size={ms(12)}
              color={COLORS.WhiteSmoke}
            />
            <Text style={styles.text}> +2.10%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '52%',
    gap: ms(7),
  },

  TextHeader: {
    fontSize: ms(14),
    fontWeight: '700',
    color: COLORS.Black,
    letterSpacing: -0.4,
    paddingHorizontal: ms(10),
  },

  GraphWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: `${COLORS.White}60`,
    borderRadius: ms(12),
    overflow: 'hidden',
  },

  GrowthText: {
    fontSize: ms(11),
    fontWeight: '700',
    color: `${COLORS.Gray}80`,
    letterSpacing: -0.4,
    paddingTop: ms(12),
    paddingHorizontal: ms(14),
  },

  ChartContainer: {
    width: '100%',

    marginVertical: 0,
    paddingVertical: 0,
  },

  BottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(10),
    paddingBottom: ms(12),
  },

  Money: {
    fontSize: ms(17),
    fontWeight: '800',
    color: COLORS.Black,
    letterSpacing: -0.4,
  },

  GrowthPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Green,
    borderRadius: ms(50),
    paddingHorizontal: ms(9),
    paddingVertical: ms(4),
  },

  text: {
    fontSize: ms(9),
    fontWeight: '700',
    color: COLORS.White,
    letterSpacing: -0.4,
    backgroundColor: COLORS.Green,
  },
});

export default GraphCard;
