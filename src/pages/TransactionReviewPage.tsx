import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Check, AlertTriangle, ArrowUpRight, ArrowLeft } from 'lucide-react';
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
    
    setTimeout(() => {
      navigate('/human-review');
    }, 1000);
  };

  const totalTransactions = transactions.length;
  const flaggedCount = transactions.filter(t => t.flagged).length;
  const approvedCount = transactions.filter(t => t.status === 'approved').length;
  const disputedCount = transactions.filter(t => t.status === 'disputed').length;
  const escalatedCount = transactions.filter(t => t.status === 'escalated').length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#333333] mb-2">Transaction Review</h2>
          <p className="text-[#A6A6A6]">Review and manage transaction alerts</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="border-[#A6A6A6] text-[#333333] hover:bg-[#F5F5F5]"
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-white p-4 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <p className="text-sm text-[#A6A6A6] mb-1">Total</p>
            <p className="text-2xl font-bold text-[#333333]">{totalTransactions}</p>
          </div>
        </Card>
        <Card className="bg-white p-4 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <p className="text-sm text-[#A6A6A6] mb-1">Flagged</p>
            <p className="text-2xl font-bold text-[#FFCB05]">{flaggedCount}</p>
          </div>
        </Card>
        <Card className="bg-white p-4 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <p className="text-sm text-[#A6A6A6] mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          </div>
        </Card>
        <Card className="bg-white p-4 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <p className="text-sm text-[#A6A6A6] mb-1">Disputed</p>
            <p className="text-2xl font-bold text-[#0057B8]">{disputedCount}</p>
          </div>
        </Card>
        <Card className="bg-white p-4 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <p className="text-sm text-[#A6A6A6] mb-1">Escalated</p>
            <p className="text-2xl font-bold text-red-600">{escalatedCount}</p>
          </div>
        </Card>
      </div>

      <Card className="mb-6 bg-white p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-[#A6A6A6] mr-2" />
            <span className="text-sm font-medium text-[#333333]">Filter:</span>
            <div className="ml-3 space-x-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-[#FFCB05] text-[#333333] hover:bg-[#FFD633]' : ''}
              >
                All Transactions
              </Button>
              <Button
                variant={filter === 'flagged' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('flagged')}
                icon={<AlertTriangle className="w-4 h-4" />}
                className={filter === 'flagged' ? 'bg-[#FFCB05] text-[#333333] hover:bg-[#FFD633]' : ''}
              >
                Flagged Only
              </Button>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={() => navigate('/human-review')}
            icon={<ArrowUpRight className="w-4 h-4" />}
            className="bg-[#0057B8] hover:bg-[#0046A6] text-white"
          >
            View Escalated Items
          </Button>
        </div>
      </Card>

      <TransactionTable 
        transactions={filteredTransactions}
        onViewTransaction={handleViewTransaction}
      />

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