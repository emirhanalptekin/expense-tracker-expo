import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TransactionsScreen() {
  const [filter, setFilter] = useState('all'); // all, income, expense

  const transactions = [
    {
      title: 'Today',
      data: [
        { id: 1, title: 'Grocery Shopping', amount: -85.50, time: '2:30 PM', icon: 'cart', category: 'Shopping' },
        { id: 2, title: 'Salary', amount: 2500, time: '9:00 AM', icon: 'cash', category: 'Income' },
      ]
    },
    {
      title: 'Yesterday',
      data: [
        { id: 3, title: 'Netflix Subscription', amount: -15.99, time: '11:00 PM', icon: 'tv', category: 'Entertainment' },
        { id: 4, title: 'Gas Station', amount: -45.00, time: '6:30 PM', icon: 'car', category: 'Transport' },
        { id: 5, title: 'Restaurant', amount: -67.80, time: '1:00 PM', icon: 'restaurant', category: 'Food' },
      ]
    },
    {
      title: 'This Week',
      data: [
        { id: 6, title: 'Freelance Project', amount: 850, time: 'Mon', icon: 'laptop', category: 'Income' },
        { id: 7, title: 'Electric Bill', amount: -120, time: 'Mon', icon: 'flash', category: 'Bills' },
        { id: 8, title: 'Gym Membership', amount: -50, time: 'Sun', icon: 'fitness', category: 'Healthcare' },
      ]
    }
  ];

  const getFilteredTransactions = () => {
    if (filter === 'all') return transactions;
    
    return transactions.map(section => ({
      ...section,
      data: section.data.filter(transaction => 
        filter === 'income' ? transaction.amount > 0 : transaction.amount < 0
      )
    })).filter(section => section.data.length > 0);
  };

  const getIconColor = (amount: number) => {
    return amount > 0 ? '#10B981' : '#EF4444';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'income' && styles.activeFilterTab]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.activeFilterText]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'expense' && styles.activeFilterTab]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.activeFilterText]}>Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <SectionList
        sections={getFilteredTransactions()}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: getIconColor(item.amount) + '20' }]}>
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={getIconColor(item.amount)} 
              />
            </View>
            
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionCategory}>{item.category} • {item.time}</Text>
            </View>
            
            <Text style={[
              styles.transactionAmount,
              { color: getIconColor(item.amount) }
            ]}>
              {item.amount > 0 ? '+' : ''} ${Math.abs(item.amount).toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#6366F1',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 20,
    marginBottom: 12,
  },
  transactionItem: {
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
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});