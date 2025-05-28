import React, { useState } from 'react';
import { AlertCircle, Flag, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Transaction } from '../../types';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface TransactionTableProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
}

type SortField = 'date' | 'merchant' | 'amount';
type SortDirection = 'asc' | 'desc';

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onViewTransaction 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'disputed':
        return <Badge variant="warning">Disputed</Badge>;
      case 'escalated':
        return <Badge variant="danger">Escalated</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatCurrency(transaction.amount).includes(searchTerm)
  );

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else {
      return sortDirection === 'asc'
        ? a.merchant.localeCompare(b.merchant)
        : b.merchant.localeCompare(a.merchant);
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  return (
    <Card className="mb-6">
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center focus:outline-none"
                  onClick={() => handleSort('date')}
                >
                  Date
                  <SortIcon field="date" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center focus:outline-none"
                  onClick={() => handleSort('merchant')}
                >
                  Merchant
                  <SortIcon field="merchant" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center focus:outline-none"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  <SortIcon field="amount" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className={`hover:bg-gray-50 transition-colors ${transaction.flagged ? 'bg-red-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.merchant}
                      </span>
                      {transaction.flagged && (
                        <span className="ml-2 text-red-600">
                          <Flag className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewTransaction(transaction)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center py-6">
                    <Search className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium">No transactions found</p>
                    <p className="text-gray-500 mt-1">Try adjusting your search</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionTable;