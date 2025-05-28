import { Transaction, Statement, Notification, DashboardStats } from '../types';

export const mockStatements: Statement[] = [
  {
    id: '1',
    fileName: 'April_2025_Statement.pdf',
    uploadDate: '2025-05-02T14:30:00',
    status: 'completed',
    transactionCount: 42,
    flaggedCount: 3
  },
  {
    id: '2',
    fileName: 'March_2025_Statement.pdf',
    uploadDate: '2025-04-03T09:15:00',
    status: 'completed',
    transactionCount: 38,
    flaggedCount: 1
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-04-28',
    merchant: 'Amazon',
    amount: 129.99,
    description: 'Amazon.com #A12B34CD5',
    flagged: false,
    status: 'approved'
  },
  {
    id: '2',
    date: '2025-04-25',
    merchant: 'Netflix',
    amount: 17.99,
    description: 'Netflix Subscription',
    flagged: false,
    status: 'approved'
  },
  {
    id: '3',
    date: '2025-04-22',
    merchant: 'Tech Gadget Store',
    amount: 899.99,
    description: 'Electronics Purchase',
    flagged: true,
    flagReason: 'Unusual purchase amount for this merchant',
    confidenceScore: 0.78,
    status: 'pending'
  },
  {
    id: '4',
    date: '2025-04-20',
    merchant: 'Foreign Transaction LLC',
    amount: 245.00,
    description: 'Foreign Transaction',
    flagged: true,
    flagReason: 'Unusual location - transaction from unrecognized region',
    confidenceScore: 0.92,
    status: 'disputed'
  },
  {
    id: '5',
    date: '2025-04-18',
    merchant: 'Local Grocery',
    amount: 52.49,
    description: 'Groceries',
    flagged: false,
    status: 'approved'
  },
  {
    id: '6',
    date: '2025-04-15',
    merchant: 'Unknown Merchant',
    amount: 499.99,
    description: 'Online Purchase',
    flagged: true,
    flagReason: 'Unrecognized merchant with high transaction value',
    confidenceScore: 0.85,
    status: 'escalated'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    transactionId: '3',
    date: '2025-04-22T14:30:00',
    type: 'call',
    status: 'delivered',
    merchant: 'Tech Gadget Store',
    amount: 899.99
  },
  {
    id: '2',
    transactionId: '4',
    date: '2025-04-20T10:15:00',
    type: 'sms',
    status: 'awaiting',
    merchant: 'Foreign Transaction LLC',
    amount: 245.00
  },
  {
    id: '3',
    transactionId: '6',
    date: '2025-04-15T16:45:00',
    type: 'email',
    status: 'escalated',
    merchant: 'Unknown Merchant',
    amount: 499.99
  }
];

export const mockDashboardStats: DashboardStats = {
  totalStatements: 2,
  totalTransactions: 80,
  flaggedTransactions: 4,
  disputesResolved: 1
};

// Helper function to get transactions by status
export const getTransactionsByStatus = (status: Transaction['status']) => {
  return mockTransactions.filter(transaction => transaction.status === status);
};

// Helper function to get flagged transactions
export const getFlaggedTransactions = () => {
  return mockTransactions.filter(transaction => transaction.flagged);
};