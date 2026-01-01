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
  TouchableOpacity,
} from 'react-native';

interface MonthlyData {
  month: number;
  revenue: number;
}

export default function App() {
  const [initialRevenue, setInitialRevenue] = useState<string>('10000');
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<string>('4');
  const [timeHorizon, setTimeHorizon] = useState<number>(12);
  const [goalRevenue, setGoalRevenue] = useState<string>('50000');
  const [selectedView, setSelectedView] = useState<'calculator' | 'comparison' | 'goals' | 'insights'>('calculator');

  const calculateProjections = (
    initial: number,
    growthRate: number,
    months: number
  ): {
    monthlyData: MonthlyData[];
    cagr: number;
    totalGrowth: number;
    finalRevenue: number;
  } => {
    const monthlyMultiplier = 1 + growthRate / 100;
    const monthlyData: MonthlyData[] = [];
    let currentRevenue = initial;

    for (let month = 0; month <= months; month++) {
      monthlyData.push({
        month,
        revenue: currentRevenue,
      });
      if (month < months) {
        currentRevenue = currentRevenue * monthlyMultiplier;
      }
    }

    const finalRevenue = monthlyData[months].revenue;
    const years = months / 12;
    const cagr = ((Math.pow(finalRevenue / initial, 1 / years) - 1) * 100);
    const totalGrowth = ((finalRevenue - initial) / initial) * 100;

    return { monthlyData, cagr, totalGrowth, finalRevenue };
  };

  const calculateRequiredGrowthRate = (
    initial: number,
    target: number,
    months: number
  ): number => {
    if (initial <= 0 || target <= initial) return 0;
    const monthlyMultiplier = Math.pow(target / initial, 1 / months);
    return (monthlyMultiplier - 1) * 100;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const initial = parseFloat(initialRevenue) || 0;
  const growthRate = parseFloat(monthlyGrowthRate) || 0;
  const goal = parseFloat(goalRevenue) || 0;

  const { monthlyData, cagr, totalGrowth, finalRevenue } = calculateProjections(
    initial,
    growthRate,
    timeHorizon
  );

  const requiredGrowthRate = calculateRequiredGrowthRate(initial, goal, timeHorizon);

  const comparisonRates = [2, 4, 6, 8];
  const comparisons = comparisonRates.map(rate => ({
    rate,
    ...calculateProjections(initial, rate, 12)
  }));

  const insights = [
    {
      title: "4% Monthly = 60% Yearly",
      description: "That 'small' 4% monthly growth compounds to 60% annual growth. Most traditional businesses would dream of 20% annual growth.",
      highlight: true,
    },
    {
      title: "Consistency Beats Explosiveness",
      description: "Steady 4% monthly growth beats sporadic 20% jumps. Compound growth rewards consistency, not volatility.",
      highlight: false,
    },
    {
      title: "Year 2 Is Where Magic Happens",
      description: "In year two, you're compounding on a much larger base. That same 4% monthly on $50k is $2k/month in new revenue vs $400 on $10k.",
      highlight: false,
    },
    {
      title: "Amazon Grew at ~10% Monthly Early On",
      description: "In its early years, Amazon sustained ~8-12% monthly growth. They understood compound growth's power and never gave up.",
      highlight: false,
    },
    {
      title: "Don't Compare Your Chapter 1 to Their Chapter 20",
      description: "Every successful business started small. Your 4% monthly growth is your Chapter 1. Keep going.",
      highlight: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedView === 'calculator' && styles.activeTab]}
          onPress={() => setSelectedView('calculator')}
        >
          <Text style={[styles.tabText, selectedView === 'calculator' && styles.activeTabText]}>
            Calculator
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedView === 'comparison' && styles.activeTab]}
          onPress={() => setSelectedView('comparison')}
        >
          <Text style={[styles.tabText, selectedView === 'comparison' && styles.activeTabText]}>
            Compare
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedView === 'goals' && styles.activeTab]}
          onPress={() => setSelectedView('goals')}
        >
          <Text style={[styles.tabText, selectedView === 'goals' && styles.activeTabText]}>
            Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedView === 'insights' && styles.activeTab]}
          onPress={() => setSelectedView('insights')}
        >
          <Text style={[styles.tabText, selectedView === 'insights' && styles.activeTabText]}>
            Insights
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>

          {/* Calculator View */}
          {selectedView === 'calculator' && (
            <>
              <Text style={styles.title}>Growth Calculator</Text>
              <Text style={styles.subtitle}>
                See how your monthly growth compounds
              </Text>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Current Monthly Revenue</Text>
                <TextInput
                  style={styles.input}
                  value={initialRevenue}
                  onChangeText={setInitialRevenue}
                  keyboardType="numeric"
                  placeholder="Enter current revenue"
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

              <View style={styles.inputSection}>
                <Text style={styles.label}>Time Horizon</Text>
                <View style={styles.horizonButtons}>
                  {[6, 12, 24, 36].map((months) => (
                    <TouchableOpacity
                      key={months}
                      style={[
                        styles.horizonButton,
                        timeHorizon === months && styles.horizonButtonActive,
                      ]}
                      onPress={() => setTimeHorizon(months)}
                    >
                      <Text
                        style={[
                          styles.horizonButtonText,
                          timeHorizon === months && styles.horizonButtonTextActive,
                        ]}
                      >
                        {months}mo
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.resultsSection}>
                <View style={styles.cagrCard}>
                  <Text style={styles.cagrLabel}>Annual CAGR</Text>
                  <Text style={styles.cagrValue}>{cagr.toFixed(1)}%</Text>
                  <Text style={styles.cagrSubtext}>
                    {monthlyGrowthRate}% monthly = {cagr.toFixed(1)}% annually
                  </Text>
                </View>

                <View style={styles.summaryCards}>
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Starting</Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(monthlyData[0].revenue)}
                    </Text>
                    <Text style={styles.summarySubtext}>Month 0</Text>
                  </View>
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>After {timeHorizon}mo</Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(finalRevenue)}
                    </Text>
                    <Text style={styles.summarySubtext}>
                      {formatNumber(totalGrowth)}% growth
                    </Text>
                  </View>
                </View>

                <View style={styles.growthCard}>
                  <Text style={styles.growthLabel}>Total Revenue Increase</Text>
                  <Text style={styles.growthValue}>
                    +{formatCurrency(finalRevenue - initial)}
                  </Text>
                  <Text style={styles.growthPercent}>
                    That's {formatCurrency((finalRevenue - initial) / timeHorizon)} more per month on average
                  </Text>
                </View>

                {growthRate >= 3 && growthRate <= 5 && (
                  <View style={styles.motivationCard}>
                    <Text style={styles.motivationTitle}>🚀 You're On Track!</Text>
                    <Text style={styles.motivationText}>
                      {growthRate}% monthly growth is excellent for a sustainable business.
                      Many entrepreneurs quit at this rate thinking it's "too slow."
                      They don't realize they're sitting on a rocket ship. Keep going!
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.projectionSection}>
                <Text style={styles.projectionTitle}>
                  Month-by-Month Breakdown
                </Text>
                <View style={styles.projectionHeader}>
                  <Text style={styles.projectionHeaderText}>Month</Text>
                  <Text style={styles.projectionHeaderText}>Revenue</Text>
                  <Text style={styles.projectionHeaderText}>Growth</Text>
                </View>
                {monthlyData.map((data) => (
                  <View key={data.month} style={styles.monthRow}>
                    <Text style={styles.monthLabel}>
                      {data.month === 0 ? 'Start' : `Mo ${data.month}`}
                    </Text>
                    <Text style={styles.monthValue}>
                      {formatCurrency(data.revenue)}
                    </Text>
                    {data.month > 0 ? (
                      <Text style={styles.monthGrowth}>
                        +{formatCurrency(
                          data.revenue - monthlyData[data.month - 1].revenue
                        )}
                      </Text>
                    ) : (
                      <Text style={styles.monthGrowth}>-</Text>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Comparison View */}
          {selectedView === 'comparison' && (
            <>
              <Text style={styles.title}>Growth Rate Comparison</Text>
              <Text style={styles.subtitle}>
                See how different growth rates compound over 12 months from ${formatNumber(initial)}
              </Text>

              <View style={styles.comparisonGrid}>
                {comparisons.map((comp) => (
                  <View key={comp.rate} style={styles.comparisonCard}>
                    <View style={styles.comparisonHeader}>
                      <Text style={styles.comparisonRate}>{comp.rate}%</Text>
                      <Text style={styles.comparisonLabel}>monthly</Text>
                    </View>
                    <View style={styles.comparisonDivider} />
                    <View style={styles.comparisonBody}>
                      <Text style={styles.comparisonMetricLabel}>After 12 Months</Text>
                      <Text style={styles.comparisonMetricValue}>
                        {formatCurrency(comp.finalRevenue)}
                      </Text>
                      <Text style={styles.comparisonMetricLabel}>Annual CAGR</Text>
                      <Text style={styles.comparisonMetricCagr}>
                        {comp.cagr.toFixed(1)}%
                      </Text>
                      <Text style={styles.comparisonMetricLabel}>Total Gain</Text>
                      <Text style={styles.comparisonMetricGain}>
                        +{formatCurrency(comp.finalRevenue - initial)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.insightBox}>
                <Text style={styles.insightBoxTitle}>💡 Key Insight</Text>
                <Text style={styles.insightBoxText}>
                  Going from 4% to 6% monthly growth doesn't just add 50% more results -
                  it nearly doubles your outcome! From {formatCurrency(comparisons[1].finalRevenue)} to {formatCurrency(comparisons[2].finalRevenue)}
                  over 12 months. Small improvements in growth rate = massive differences in results.
                </Text>
              </View>
            </>
          )}

          {/* Goals View */}
          {selectedView === 'goals' && (
            <>
              <Text style={styles.title}>Goal Planner</Text>
              <Text style={styles.subtitle}>
                What growth rate do you need to hit your target?
              </Text>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Current Monthly Revenue</Text>
                <TextInput
                  style={styles.input}
                  value={initialRevenue}
                  onChangeText={setInitialRevenue}
                  keyboardType="numeric"
                  placeholder="Enter current revenue"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Goal Monthly Revenue</Text>
                <TextInput
                  style={styles.input}
                  value={goalRevenue}
                  onChangeText={setGoalRevenue}
                  keyboardType="numeric"
                  placeholder="Enter target revenue"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Timeframe</Text>
                <View style={styles.horizonButtons}>
                  {[6, 12, 24, 36].map((months) => (
                    <TouchableOpacity
                      key={months}
                      style={[
                        styles.horizonButton,
                        timeHorizon === months && styles.horizonButtonActive,
                      ]}
                      onPress={() => setTimeHorizon(months)}
                    >
                      <Text
                        style={[
                          styles.horizonButtonText,
                          timeHorizon === months && styles.horizonButtonTextActive,
                        ]}
                      >
                        {months}mo
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {goal > initial && initial > 0 && (
                <>
                  <View style={styles.goalResultCard}>
                    <Text style={styles.goalResultTitle}>Required Monthly Growth</Text>
                    <Text style={styles.goalResultValue}>
                      {requiredGrowthRate.toFixed(2)}%
                    </Text>
                    <Text style={styles.goalResultSubtext}>
                      per month for {timeHorizon} months
                    </Text>
                  </View>

                  <View style={styles.goalBreakdown}>
                    <Text style={styles.goalBreakdownTitle}>What This Means</Text>
                    <View style={styles.goalBreakdownRow}>
                      <Text style={styles.goalBreakdownLabel}>Starting Revenue:</Text>
                      <Text style={styles.goalBreakdownValue}>{formatCurrency(initial)}/mo</Text>
                    </View>
                    <View style={styles.goalBreakdownRow}>
                      <Text style={styles.goalBreakdownLabel}>Target Revenue:</Text>
                      <Text style={styles.goalBreakdownValue}>{formatCurrency(goal)}/mo</Text>
                    </View>
                    <View style={styles.goalBreakdownRow}>
                      <Text style={styles.goalBreakdownLabel}>Total Increase:</Text>
                      <Text style={styles.goalBreakdownValue}>{formatCurrency(goal - initial)}</Text>
                    </View>
                    <View style={styles.goalBreakdownRow}>
                      <Text style={styles.goalBreakdownLabel}>Timeframe:</Text>
                      <Text style={styles.goalBreakdownValue}>{timeHorizon} months</Text>
                    </View>
                    <View style={[styles.goalBreakdownRow, styles.goalBreakdownHighlight]}>
                      <Text style={styles.goalBreakdownLabelBold}>Need to grow by:</Text>
                      <Text style={styles.goalBreakdownValueBold}>
                        {formatCurrency(initial * requiredGrowthRate / 100)}/mo
                      </Text>
                    </View>
                  </View>

                  {requiredGrowthRate < 2 && (
                    <View style={styles.assessmentCard}>
                      <Text style={styles.assessmentTitle}>✅ Very Achievable</Text>
                      <Text style={styles.assessmentText}>
                        This growth rate is modest and sustainable. Focus on consistent execution.
                      </Text>
                    </View>
                  )}
                  {requiredGrowthRate >= 2 && requiredGrowthRate <= 8 && (
                    <View style={styles.assessmentCard}>
                      <Text style={styles.assessmentTitle}>🎯 Challenging But Doable</Text>
                      <Text style={styles.assessmentText}>
                        This is ambitious but achievable with focused effort. Many successful businesses sustain this rate.
                      </Text>
                    </View>
                  )}
                  {requiredGrowthRate > 8 && requiredGrowthRate <= 15 && (
                    <View style={styles.assessmentCard}>
                      <Text style={styles.assessmentTitle}>⚡ Aggressive Growth Required</Text>
                      <Text style={styles.assessmentText}>
                        This requires aggressive marketing and product-market fit. Consider extending your timeline or adjusting your goal.
                      </Text>
                    </View>
                  )}
                  {requiredGrowthRate > 15 && (
                    <View style={styles.assessmentCard}>
                      <Text style={styles.assessmentTitle}>🚨 Unrealistic Timeframe</Text>
                      <Text style={styles.assessmentText}>
                        This growth rate is typically unsustainable. Consider a longer timeframe or a more modest goal to start.
                      </Text>
                    </View>
                  )}
                </>
              )}

              {goal <= initial && (
                <View style={styles.errorCard}>
                  <Text style={styles.errorText}>
                    Your goal should be higher than your current revenue
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Insights View */}
          {selectedView === 'insights' && (
            <>
              <Text style={styles.title}>Why Small Growth Matters</Text>
              <Text style={styles.subtitle}>
                Understanding the power of compound growth
              </Text>

              <View style={styles.heroInsight}>
                <Text style={styles.heroInsightTitle}>
                  4% Monthly Growth Isn't Small
                </Text>
                <Text style={styles.heroInsightSubtitle}>
                  It's a 60% annual growth rate
                </Text>
                <Text style={styles.heroInsightText}>
                  If you started with $10,000/month in revenue and maintained just 4% monthly growth:
                </Text>
                <View style={styles.heroInsightStats}>
                  <View style={styles.heroInsightStat}>
                    <Text style={styles.heroInsightStatLabel}>Year 1</Text>
                    <Text style={styles.heroInsightStatValue}>$16,010</Text>
                  </View>
                  <View style={styles.heroInsightStat}>
                    <Text style={styles.heroInsightStatLabel}>Year 2</Text>
                    <Text style={styles.heroInsightStatValue}>$25,640</Text>
                  </View>
                  <View style={styles.heroInsightStat}>
                    <Text style={styles.heroInsightStatLabel}>Year 3</Text>
                    <Text style={styles.heroInsightStatValue}>$41,040</Text>
                  </View>
                </View>
                <Text style={styles.heroInsightFooter}>
                  In 3 years, you'd more than 4x your revenue. That's the power of consistency.
                </Text>
              </View>

              {insights.map((insight, index) => (
                <View
                  key={index}
                  style={[
                    styles.insightCard,
                    insight.highlight && styles.insightCardHighlight,
                  ]}
                >
                  <Text style={styles.insightCardTitle}>{insight.title}</Text>
                  <Text style={styles.insightCardText}>{insight.description}</Text>
                </View>
              ))}

              <View style={styles.benchmarkSection}>
                <Text style={styles.benchmarkTitle}>Real-World Benchmarks</Text>
                <View style={styles.benchmarkCard}>
                  <Text style={styles.benchmarkCompany}>SaaS Businesses</Text>
                  <Text style={styles.benchmarkRate}>3-7% monthly growth</Text>
                  <Text style={styles.benchmarkDescription}>
                    Healthy, sustainable growth for software businesses
                  </Text>
                </View>
                <View style={styles.benchmarkCard}>
                  <Text style={styles.benchmarkCompany}>E-commerce</Text>
                  <Text style={styles.benchmarkRate}>5-10% monthly growth</Text>
                  <Text style={styles.benchmarkDescription}>
                    Common during scaling phase with paid acquisition
                  </Text>
                </View>
                <View style={styles.benchmarkCard}>
                  <Text style={styles.benchmarkCompany}>Content/Media</Text>
                  <Text style={styles.benchmarkRate}>8-15% monthly growth</Text>
                  <Text style={styles.benchmarkDescription}>
                    Higher rates possible during viral growth phases
                  </Text>
                </View>
                <View style={styles.benchmarkCard}>
                  <Text style={styles.benchmarkCompany}>Traditional Business</Text>
                  <Text style={styles.benchmarkRate}>1-2% monthly growth</Text>
                  <Text style={styles.benchmarkDescription}>
                    Even this compounds to 15-25% annually - excellent for offline
                  </Text>
                </View>
              </View>

              <View style={styles.finalMessage}>
                <Text style={styles.finalMessageTitle}>Don't Give Up</Text>
                <Text style={styles.finalMessageText}>
                  If you're growing at 3-5% per month, you're outperforming 90% of businesses.
                  The entrepreneurs who win aren't the ones who grow the fastest initially -
                  they're the ones who keep growing consistently while others quit.
                </Text>
                <Text style={styles.finalMessageText}>
                  Your 4% monthly growth might feel slow today, but in 2-3 years,
                  you'll look back amazed at how far you've come. Trust the compound.
                </Text>
              </View>
            </>
          )}
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
    paddingBottom: 40,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
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
  horizonButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  horizonButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    alignItems: 'center',
  },
  horizonButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  horizonButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  horizonButtonTextActive: {
    color: '#ffffff',
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
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 11,
    color: '#9ca3af',
  },
  growthCard: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
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
  motivationCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
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
  projectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    marginBottom: 8,
  },
  projectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    width: 80,
    textAlign: 'right',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a2e',
    flex: 1,
    textAlign: 'right',
  },
  monthGrowth: {
    fontSize: 13,
    color: '#10b981',
    marginLeft: 8,
    width: 80,
    textAlign: 'right',
  },
  comparisonGrid: {
    gap: 16,
    marginBottom: 24,
  },
  comparisonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  comparisonHeader: {
    backgroundColor: '#f9fafb',
    padding: 16,
    alignItems: 'center',
  },
  comparisonRate: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  comparisonDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  comparisonBody: {
    padding: 20,
  },
  comparisonMetricLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  comparisonMetricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  comparisonMetricCagr: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  comparisonMetricGain: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  insightBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  insightBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  insightBoxText: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
  },
  goalResultCard: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  goalResultTitle: {
    fontSize: 16,
    color: '#ede9fe',
    marginBottom: 8,
    fontWeight: '600',
  },
  goalResultValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  goalResultSubtext: {
    fontSize: 14,
    color: '#ede9fe',
  },
  goalBreakdown: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  goalBreakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  goalBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  goalBreakdownLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  goalBreakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  goalBreakdownHighlight: {
    backgroundColor: '#fef3c7',
    marginTop: 12,
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  goalBreakdownLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  goalBreakdownValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  assessmentCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  assessmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 8,
  },
  assessmentText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 14,
    color: '#991b1b',
    textAlign: 'center',
  },
  heroInsight: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  heroInsightTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  heroInsightSubtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 16,
  },
  heroInsightText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 20,
    lineHeight: 20,
  },
  heroInsightStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  heroInsightStat: {
    alignItems: 'center',
  },
  heroInsightStatLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  heroInsightStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10b981',
  },
  heroInsightFooter: {
    fontSize: 14,
    color: '#cbd5e1',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  insightCardHighlight: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
    borderWidth: 2,
  },
  insightCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  insightCardText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  benchmarkSection: {
    marginTop: 24,
  },
  benchmarkTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  benchmarkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  benchmarkCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  benchmarkRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  benchmarkDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  finalMessage: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    marginBottom: 20,
  },
  finalMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  finalMessageText: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
    marginBottom: 12,
  },
});
