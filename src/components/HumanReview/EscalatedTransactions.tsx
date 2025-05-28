import React from 'react';
import { User, ExternalLink, Flag, AlertCircle, Clock } from 'lucide-react';
import { Transaction } from '../../types';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface EscalatedTransactionsProps {
  transactions: Transaction[];
  onReview: (transaction: Transaction) => void;
}

const EscalatedTransactions: React.FC<EscalatedTransactionsProps> = ({
  transactions,
  onReview
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const escalatedTransactions = transactions.filter(
    (transaction) => transaction.status === 'escalated'
  );

  if (escalatedTransactions.length === 0) {
    return (
      <Card className="bg-white p-8 text-center">
        <User className="w-16 h-16 mx-auto text-[#A6A6A6] mb-4" />
        <h3 className="text-lg font-medium text-[#333333] mb-2">No escalated transactions</h3>
        <p className="text-[#A6A6A6]">
          Transactions requiring human review will appear here
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white divide-y divide-[#F5F5F5]">
      {escalatedTransactions.map((transaction) => (
        <div key={transaction.id} className="p-6 hover:bg-[#F5F5F5] transition-colors">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#FFCB05]/10 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-[#FFCB05]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-[#333333] truncate">
                  {transaction.merchant}
                </h4>
                <p className="text-lg font-semibold text-[#333333]">
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              
              <div className="flex items-center text-[#A6A6A6] text-sm mb-3">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(transaction.date)}
                <span className="mx-2">•</span>
                {transaction.description}
              </div>
              
              {transaction.flagReason && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{transaction.flagReason}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant="danger" className="bg-red-100 text-red-700">
                  Needs Manual Review
                </Badge>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onReview(transaction)}
                  icon={<ExternalLink className="w-4 h-4" />}
                  className="bg-[#0057B8] hover:bg-[#0046A6] text-white"
                >
                  Review Transaction
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default EscalatedTransactions;