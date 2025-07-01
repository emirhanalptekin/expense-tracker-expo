import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { deleteTransaction, getUserTransactions, Transaction } from '../../src/services/transactionService';

export default function TransactionsScreen() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserTransactions((userTransactions) => {
      setTransactions(userTransactions);
      setIsLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    if (filter === 'income') {
      filtered = transactions.filter(t => t.type === 'income');
    } else if (filter === 'expense') {
      filtered = transactions.filter(t => t.type === 'expense');
    }

    // Group transactions by date
    const grouped: { [key: string]: Transaction[] } = {};
    
    filtered.forEach(transaction => {
      const date = new Date(transaction.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey: string;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        dateKey = 'This Week';
      } else if (date > new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)) {
        dateKey = 'This Month';
      } else {
        dateKey = 'Older';
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    // Convert to sections array
    const sections = Object.entries(grouped).map(([title, data]) => ({
      title,
      data
    }));

    // Sort sections
    const sectionOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];
    sections.sort((a, b) => sectionOrder.indexOf(a.title) - sectionOrder.indexOf(b.title));

    return sections;
  };

  const getIconColor = (type: 'income' | 'expense') => {
    return type === 'income' ? '#10B981' : '#EF4444';
  };

  const getTransactionIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Shopping': 'cart',
      'Food': 'restaurant',
      'Transport': 'car',
      'Bills': 'receipt',
      'Healthcare': 'medkit',
      'Entertainment': 'game-controller',
      'Salary': 'cash',
      'Freelance': 'laptop',
      'Investment': 'trending-up',
      'Business': 'briefcase',
      'Gift': 'gift',
      'Other': 'ellipsis-horizontal'
    };
    return icons[category] || 'ellipsis-horizontal';
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

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
      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="wallet-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No transactions yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first transaction to get started</Text>
        </View>
      ) : (
        <SectionList
          sections={getFilteredTransactions()}
          keyExtractor={(item) => item.id || ''}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.transactionItem}
              onLongPress={() => handleDeleteTransaction(item.id!)}
            >
              <View style={[styles.transactionIcon, { backgroundColor: getIconColor(item.type) + '20' }]}>
                <Ionicons 
                  name={getTransactionIcon(item.category) as any} 
                  size={24} 
                  color={getIconColor(item.type)} 
                />
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionCategory}>
                  {item.category} • {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                { color: getIconColor(item.type) }
              ]}>
                {item.type === 'income' ? '+' : '-'} ${Math.abs(item.amount).toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No transactions found</Text>
          }
        />
      )}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
});