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
        return <Badge variant="warning" className="bg-[#0057B8]/10 text-[#0057B8]">Disputed</Badge>;
      case 'escalated':
        return <Badge variant="danger">Escalated</Badge>;
      default:
        return <Badge variant="default" className="bg-[#F5F5F5] text-[#333333]">Pending</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatCurrency(transaction.amount).includes(searchTerm)
  );

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
    <Card className="bg-white overflow-hidden">
      <div className="p-4 border-b border-[#F5F5F5]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#A6A6A6]" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            className="block w-full pl-10 pr-3 py-2 border border-[#F5F5F5] rounded-lg text-[#333333] placeholder-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#FFCB05] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#F5F5F5]">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <button 
                  className="flex items-center text-sm font-medium text-[#333333] hover:text-[#FFCB05] transition-colors"
                  onClick={() => handleSort('date')}
                >
                  Date
                  <SortIcon field="date" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <button 
                  className="flex items-center text-sm font-medium text-[#333333] hover:text-[#FFCB05] transition-colors"
                  onClick={() => handleSort('merchant')}
                >
                  Merchant
                  <SortIcon field="merchant" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <button 
                  className="flex items-center text-sm font-medium text-[#333333] hover:text-[#FFCB05] transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  <SortIcon field="amount" />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#333333]">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#333333]">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-[#333333]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#F5F5F5]">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className={`hover:bg-[#F5F5F5] transition-colors ${
                    transaction.flagged ? 'bg-[#FFCB05]/5' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-[#333333]">
                        {transaction.merchant}
                      </span>
                      {transaction.flagged && (
                        <span className="ml-2 text-[#FFCB05]">
                          <Flag className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#A6A6A6] max-w-xs truncate">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewTransaction(transaction)}
                      className="border-[#F5F5F5] text-[#333333] hover:bg-[#F5F5F5] hover:border-[#A6A6A6]"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-[#A6A6A6] mb-2" />
                    <p className="text-[#333333] font-medium">No transactions found</p>
                    <p className="text-[#A6A6A6] mt-1">Try adjusting your search</p>
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