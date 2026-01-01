import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

interface MonthlyData {
  month: number;
  revenue: number;
}

export default function App() {
  const [initialRevenue, setInitialRevenue] = useState<string>('10000');
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<string>('4');

  const calculateProjections = (): {
    monthlyData: MonthlyData[];
    cagr: number;
    totalGrowth: number;
  } => {
    const initial = parseFloat(initialRevenue) || 0;
    const growthRate = parseFloat(monthlyGrowthRate) || 0;
    const monthlyMultiplier = 1 + growthRate / 100;

    const monthlyData: MonthlyData[] = [];
    let currentRevenue = initial;

    for (let month = 0; month <= 12; month++) {
      monthlyData.push({
        month,
        revenue: currentRevenue,
      });
      if (month < 12) {
        currentRevenue = currentRevenue * monthlyMultiplier;
      }
    }

    const finalRevenue = monthlyData[12].revenue;
    const cagr = ((Math.pow(monthlyMultiplier, 12) - 1) * 100);
    const totalGrowth = ((finalRevenue - initial) / initial) * 100;

    return { monthlyData, cagr, totalGrowth };
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const { monthlyData, cagr, totalGrowth } = calculateProjections();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>CAGR Calculator</Text>
          <Text style={styles.subtitle}>
            Monthly Growth to Annual CAGR
          </Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Initial Monthly Revenue</Text>
            <TextInput
              style={styles.input}
              value={initialRevenue}
              onChangeText={setInitialRevenue}
              keyboardType="numeric"
              placeholder="Enter initial revenue"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Monthly Growth Rate (%)</Text>
            <TextInput
              style={styles.input}
              value={monthlyGrowthRate}
              onChangeText={setMonthlyGrowthRate}
              keyboardType="numeric"
              placeholder="Enter monthly growth %"
            />
          </View>

          <View style={styles.resultsSection}>
            <View style={styles.cagrCard}>
              <Text style={styles.cagrLabel}>Annual CAGR</Text>
              <Text style={styles.cagrValue}>{cagr.toFixed(2)}%</Text>
              <Text style={styles.cagrSubtext}>
                {monthlyGrowthRate}% monthly = {cagr.toFixed(2)}% annually
              </Text>
            </View>

            <View style={styles.summaryCards}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Starting</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(monthlyData[0].revenue)}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>After 12 Months</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(monthlyData[12].revenue)}
                </Text>
              </View>
            </View>

            <View style={styles.growthCard}>
              <Text style={styles.growthLabel}>Total Growth</Text>
              <Text style={styles.growthValue}>
                +{formatCurrency(monthlyData[12].revenue - monthlyData[0].revenue)}
              </Text>
              <Text style={styles.growthPercent}>
                ({totalGrowth.toFixed(2)}% increase)
              </Text>
            </View>
          </View>

          <View style={styles.projectionSection}>
            <Text style={styles.projectionTitle}>
              Month-by-Month Projection
            </Text>
            {monthlyData.map((data) => (
              <View key={data.month} style={styles.monthRow}>
                <Text style={styles.monthLabel}>
                  {data.month === 0 ? 'Start' : `Month ${data.month}`}
                </Text>
                <Text style={styles.monthValue}>
                  {formatCurrency(data.revenue)}
                </Text>
                {data.month > 0 && (
                  <Text style={styles.monthGrowth}>
                    +{formatCurrency(
                      data.revenue - monthlyData[data.month - 1].revenue
                    )}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#1a1a2e',
  },
  resultsSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  cagrCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  cagrLabel: {
    fontSize: 16,
    color: '#dbeafe',
    marginBottom: 8,
    fontWeight: '600',
  },
  cagrValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cagrSubtext: {
    fontSize: 14,
    color: '#dbeafe',
    textAlign: 'center',
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  growthCard: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  growthLabel: {
    fontSize: 14,
    color: '#d1fae5',
    marginBottom: 4,
    fontWeight: '600',
  },
  growthValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  growthPercent: {
    fontSize: 14,
    color: '#d1fae5',
  },
  projectionSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  projectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 80,
  },
  monthValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    flex: 1,
    textAlign: 'right',
  },
  monthGrowth: {
    fontSize: 14,
    color: '#10b981',
    marginLeft: 12,
    width: 80,
    textAlign: 'right',
  },
});
