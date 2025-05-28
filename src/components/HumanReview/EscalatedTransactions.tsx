import React from 'react';
import { User, ExternalLink, Flag, AlertCircle } from 'lucide-react';
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

  // Filter to only show escalated transactions
  const escalatedTransactions = transactions.filter(
    (transaction) => transaction.status === 'escalated'
  );

  if (escalatedTransactions.length === 0) {
    return (
      <Card title="Escalated Transactions" className="mb-6">
        <div className="text-center py-6">
          <User className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-base font-medium text-gray-900">No escalated transactions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Transactions requiring human review will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Escalated Transactions" className="mb-6">
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {escalatedTransactions.map((transaction) => (
            <li key={transaction.id} className="py-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Flag className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.merchant}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.date)} • {transaction.description}
                    </p>
                  </div>
                  
                  {transaction.flagReason && (
                    <div className="mt-2 flex items-start">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-1 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">{transaction.flagReason}</p>
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="danger">Needs Manual Review</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ExternalLink className="w-3 h-3" />}
                      onClick={() => onReview(transaction)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default EscalatedTransactions;