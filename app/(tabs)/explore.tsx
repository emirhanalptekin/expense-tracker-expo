import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function OverviewScreen() {
  const [selectedTab, setSelectedTab] = useState<'income' | 'expenses'>('expenses');
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  const totalIncome = 8500;
  const totalExpenses = 3800;

  // Sample data for the bar chart
  const weeklyData = [
    { week: 'Week 1', income: 2200, expenses: 900 },
    { week: 'Week 2', income: 1800, expenses: 1100 },
    { week: 'Week 3', income: 2500, expenses: 800 },
    { week: 'Week 4', income: 2000, expenses: 1000 },
  ];

  const expenseCategories = [
    { id: 1, title: 'Shopping', amount: 1550, date: '30 Apr 2022', icon: 'bag-handle', color: '#EF4444' },
    { id: 2, title: 'Laptop', amount: 1200, date: '25 Apr 2022', icon: 'laptop-outline', color: '#6366F1' },
  ];

  const incomeCategories = [
    { id: 1, title: 'Salary', amount: 5000, date: '01 Apr 2022', icon: 'cash-outline', color: '#10B981' },
    { id: 2, title: 'Freelance', amount: 3500, date: '15 Apr 2022', icon: 'briefcase-outline', color: '#6366F1' },
  ];

  const maxValue = Math.max(...weeklyData.map(d => Math.max(d.income, d.expenses)));
  const chartHeight = 180;

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

          <Text style={styles.dateRange}>Apr 01 - Apr 30</Text>

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
                        { height: (data.income / maxValue) * chartHeight }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.bar,
                        styles.expenseBar,
                        { height: (data.expenses / maxValue) * chartHeight }
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
          {(selectedTab === 'expenses' ? expenseCategories : incomeCategories).map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                <Ionicons 
                  name={category.icon as any} 
                  size={24} 
                  color={category.color} 
                />
              </View>
              
              <View style={styles.categoryDetails}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDate}>{category.date}</Text>
              </View>
              
              <Text style={[styles.categoryAmount, { color: category.color }]}>
                {selectedTab === 'expenses' ? '-' : '+'} ${category.amount}
              </Text>
            </TouchableOpacity>
          ))}
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
});