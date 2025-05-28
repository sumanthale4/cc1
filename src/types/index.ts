export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  description: string;
  flagged: boolean;
  flagReason?: string;
  confidenceScore?: number;
  status: 'pending' | 'approved' | 'disputed' | 'escalated';
}

export interface Statement {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processing' | 'completed';
  transactionCount: number;
  flaggedCount: number;
}

export interface Notification {
  id: string;
  transactionId: string;
  date: string;
  type: 'call' | 'email' | 'sms';
  status: 'delivered' | 'awaiting' | 'escalated';
  merchant: string;
  amount: number;
}

export interface DashboardStats {
  totalStatements: number;
  totalTransactions: number;
  flaggedTransactions: number;
  disputesResolved: number;
}