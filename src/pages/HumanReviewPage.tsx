import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Users, Bell } from 'lucide-react';
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
    setIsModalOpen(false);
  };

  const handleRetriggerNotification = (notificationId: string) => {
    setNotifications(
      notifications.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'delivered', date: new Date().toISOString() } 
          : n
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#333333] mb-2">Human Review Panel</h2>
          <p className="text-[#A6A6A6]">Review escalated transactions and manage customer notifications</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/transactions')}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="border-[#A6A6A6] text-[#333333] hover:bg-[#F5F5F5]"
          >
            Back to Transactions
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setTransactions([...transactions]);
              setNotifications([...notifications]);
            }}
            icon={<RefreshCw className="w-4 h-4" />}
            className="bg-[#F5F5F5] text-[#333333] hover:bg-[#E5E5E5]"
          >
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-[#FFCB05]" />
            <h3 className="text-lg font-medium text-[#333333]">Escalated Transactions</h3>
          </div>
          <EscalatedTransactions
            transactions={transactions}
            onReview={handleReviewTransaction}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5 text-[#0057B8]" />
            <h3 className="text-lg font-medium text-[#333333]">Notification History</h3>
          </div>
          <NotificationPanel
            notifications={notifications}
            onRetrigger={handleRetriggerNotification}
          />
        </div>
      </div>

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