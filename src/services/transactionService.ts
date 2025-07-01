// src/services/transactionService.ts
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
  
  export interface Transaction {
    id?: string;
    userId: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    notes?: string;
    createdAt: any;
  }
  
  // Add a new transaction
  export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now()
      });
      
      // Update user's balance
      await updateUserBalance(auth.currentUser.uid);
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };
  
  // Get all transactions for current user
  export const getUserTransactions = (callback: (transactions: Transaction[]) => void) => {
    if (!auth.currentUser) return;
    
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      callback(transactions);
    });
  };
  
  // Update user balance based on transactions
  export const updateUserBalance = async (userId: string) => {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      let totalIncome = 0;
      let totalExpenses = 0;
      let totalTransactions = snapshot.size;
      
      snapshot.forEach((doc) => {
        const transaction = doc.data();
        if (transaction.type === 'income') {
          totalIncome += transaction.amount;
        } else {
          totalExpenses += transaction.amount;
        }
      });
      
      const balance = totalIncome - totalExpenses;
      
      // Update user document
      await updateDoc(doc(db, 'users', userId), {
        totalIncome,
        totalExpenses,
        balance,
        totalTransactions,
        lastUpdated: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };
  
  // Delete transaction
  export const deleteTransaction = async (transactionId: string) => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
      await updateUserBalance(auth.currentUser.uid);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };
  
  // Get user statistics
  export const getUserStats = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  };