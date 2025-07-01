import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { getUserTransactions, Transaction } from '../../src/services/transactionService';

const { width } = Dimensions.get('window');

export default function OverviewScreen() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'income' | 'expenses'>('expenses');
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserTransactions((userTransactions) => {
      setTransactions(userTransactions);
      calculateTotals(userTransactions);
      setIsLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const calculateTotals = (allTransactions: Transaction[]) => {
    let income = 0;
    let expenses = 0;

    allTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
  };

  const getWeeklyData = () => {
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    
    // Initialize weekly data
    const weeks: Array<{
      week: string;
      income: number;
      expenses: number;
      start: Date;
      end: Date;
    }> = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(fourWeeksAgo.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      weeks.push({
        week: `Week ${i + 1}`,
        income: 0,
        expenses: 0,
        start: weekStart,
        end: weekEnd
      });
    }

    // Calculate totals for each week
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      
      weeks.forEach(week => {
        if (transactionDate >= week.start && transactionDate < week.end) {
          if (transaction.type === 'income') {
            week.income += transaction.amount;
          } else {
            week.expenses += transaction.amount;
          }
        }
      });
    });

    return weeks;
  };

  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === selectedTab.slice(0, -1) as 'income' | 'expense')
      .forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        title: category,
        amount,
        icon: getCategoryIcon(category),
        color: selectedTab === 'income' ? '#10B981' : '#EF4444'
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Shopping': 'bag-handle',
      'Food': 'restaurant',
      'Transport': 'car',
      'Bills': 'receipt',
      'Healthcare': 'medkit',
      'Entertainment': 'game-controller',
      'Salary': 'cash',
      'Freelance': 'laptop-outline',
      'Investment': 'trending-up',
      'Business': 'briefcase-outline',
      'Gift': 'gift',
      'Other': 'ellipsis-horizontal'
    };
    return icons[category] || 'ellipsis-horizontal';
  };

  const weeklyData = getWeeklyData();
  const maxValue = Math.max(...weeklyData.map(d => Math.max(d.income, d.expenses)), 1);
  const chartHeight = 180;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Overview</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="arrow-down" size={20} color="#6366F1" />
            </View>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={styles.summaryAmount}>${totalIncome.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="arrow-up" size={20} color="#EF4444" />
            </View>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>${totalExpenses.toLocaleString()}</Text>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <TouchableOpacity style={styles.periodSelector}>
              <Text style={styles.periodText}>{selectedPeriod}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.dateRange}>Last 4 Weeks</Text>

          {/* Bar Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.bars}>
                    <View 
                      style={[
                        styles.bar,
                        styles.incomeBar,
                        { height: maxValue > 0 ? (data.income / maxValue) * chartHeight : 0 }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.bar,
                        styles.expenseBar,
                        { height: maxValue > 0 ? (data.expenses / maxValue) * chartHeight : 0 }
                      ]} 
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.week.split(' ')[1]}</Text>
                </View>
              ))}
            </View>

            {/* Y-axis labels */}
            <View style={styles.yAxis}>
              <Text style={styles.yAxisLabel}>${(maxValue / 1000).toFixed(0)}k</Text>
              <Text style={styles.yAxisLabel}>${(maxValue / 2000).toFixed(0)}k</Text>
              <Text style={styles.yAxisLabel}>$0</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'income' && styles.activeTab]}
            onPress={() => setSelectedTab('income')}
          >
            <Text style={[styles.tabText, selectedTab === 'income' && styles.activeTabText]}>
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'expenses' && styles.activeTab]}
            onPress={() => setSelectedTab('expenses')}
          >
            <Text style={[styles.tabText, selectedTab === 'expenses' && styles.activeTabText]}>
              Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories List */}
        <View style={styles.section}>
          {getCategoryData().length > 0 ? (
            getCategoryData().map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={24} 
                    color={category.color} 
                  />
                </View>
                
                <View style={styles.categoryDetails}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDate}>
                    {transactions.filter(t => t.category === category.title && t.type === selectedTab.slice(0, -1)).length} transactions
                  </Text>
                </View>
                
                <Text style={[styles.categoryAmount, { color: category.color }]}>
                  ${category.amount.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No {selectedTab} data available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  periodText: {
    fontSize: 14,
    color: '#4B5563',
  },
  dateRange: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180 + 30,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 180,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  incomeBar: {
    backgroundColor: '#6366F1',
  },
  expenseBar: {
    backgroundColor: '#EF4444',
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginLeft: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#EF4444',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#fff',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryDetails: {
    flex: 1,
    marginLeft: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
});