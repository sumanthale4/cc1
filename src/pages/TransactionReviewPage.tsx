import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Check, AlertTriangle, ArrowUpRight } from 'lucide-react';
import TransactionTable from '../components/Transactions/TransactionTable';
import TransactionModal from '../components/Transactions/TransactionModal';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { Transaction } from '../types';
import { mockTransactions } from '../data/mockData';

const TransactionReviewPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');
  const navigate = useNavigate();

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.flagged);

  const handleViewTransaction = (transaction: Transaction) => {
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
    setTransactions(
      transactions.map(t => 
        t.id === id ? { ...t, status: 'escalated' } : t
      )
    );
    setIsModalOpen(false);
    
    // Navigate to human review after a short delay
    setTimeout(() => {
      navigate('/human-review');
    }, 1000);
  };

  // Calculate stats
  const totalTransactions = transactions.length;
  const flaggedCount = transactions.filter(t => t.flagged).length;
  const approvedCount = transactions.filter(t => t.status === 'approved').length;
  const disputedCount = transactions.filter(t => t.status === 'disputed').length;
  const escalatedCount = transactions.filter(t => t.status === 'escalated').length;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="text-center p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-semibold text-gray-900">{totalTransactions}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-500">Flagged</p>
          <p className="text-2xl font-semibold text-red-600">{flaggedCount}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-500">Disputed</p>
          <p className="text-2xl font-semibold text-amber-600">{disputedCount}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-sm text-gray-500">Escalated</p>
          <p className="text-2xl font-semibold text-indigo-600">{escalatedCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="ml-3 space-x-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Transactions
              </Button>
              <Button
                variant={filter === 'flagged' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('flagged')}
                icon={<AlertTriangle className="w-4 h-4" />}
              >
                Flagged Only
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="info" className="flex items-center">
              <Filter className="w-3 h-3 mr-1" />
              {filter === 'all' ? 'Showing all transactions' : 'Showing flagged transactions'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Transaction Table */}
      <TransactionTable 
        transactions={filteredTransactions}
        onViewTransaction={handleViewTransaction}
      />

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
        
        <Button
          variant="primary"
          onClick={() => navigate('/human-review')}
          icon={<ArrowUpRight className="w-4 h-4" />}
        >
          View Escalated Items
        </Button>
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

export default TransactionReviewPage;