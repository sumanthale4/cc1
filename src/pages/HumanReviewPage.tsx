import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import EscalatedTransactions from '../components/HumanReview/EscalatedTransactions';
import NotificationPanel from '../components/HumanReview/NotificationPanel';
import TransactionModal from '../components/Transactions/TransactionModal';
import Button from '../components/UI/Button';
import { Transaction, Notification } from '../types';
import { mockTransactions, mockNotifications } from '../data/mockData';

const HumanReviewPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleReviewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    setTransactions(
      transactions.map(t => 
        t.id === id ? { ...t, status: 'approved', flagged: false } : t
      )
    );
    setIsModalOpen(false);
  };

  const handleDispute = (id: string) => {
    setTransactions(
      transactions.map(t => 
        t.id === id ? { ...t, status: 'disputed' } : t
      )
    );
    setIsModalOpen(false);
  };

  const handleEscalate = (id: string) => {
    // Already escalated, so no change needed
    setIsModalOpen(false);
  };

  const handleRetriggerNotification = (notificationId: string) => {
    // Simulate re-triggering notification
    setNotifications(
      notifications.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'delivered', date: new Date().toISOString() } 
          : n
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Action */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/transactions')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Transactions
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            // Simulate refreshing data
            setTransactions([...transactions]);
            setNotifications([...notifications]);
          }}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh Data
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Human Review Panel</h2>
          <EscalatedTransactions
            transactions={transactions}
            onReview={handleReviewTransaction}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Notification History</h2>
          <NotificationPanel
            notifications={notifications}
            onRetrigger={handleRetriggerNotification}
          />
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onDispute={handleDispute}
        onEscalate={handleEscalate}
      />
    </div>
  );
};

export default HumanReviewPage;