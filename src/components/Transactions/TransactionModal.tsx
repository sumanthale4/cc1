import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../../types';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDispute: (id: string) => void;
  onEscalate: (id: string) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onApprove,
  onDispute,
  onEscalate
}) => {
  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getConfidenceBadge = (score?: number) => {
    if (!score) return null;

    let variant = 'default';
    if (score >= 0.8) variant = 'danger';
    else if (score >= 0.6) variant = 'warning';
    else variant = 'info';

    return (
      <Badge variant={variant}>
        {`${Math.round(score * 100)}% Confidence`}
      </Badge>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      size="lg"
      footer={
        <div className="flex justify-between">
          <div>
            {transaction.status !== 'approved' && (
              <Button
                variant="success"
                onClick={() => onApprove(transaction.id)}
                icon={<CheckCircle className="w-4 h-4" />}
                className="mr-3"
              >
                Approve
              </Button>
            )}
          </div>
          
          <div>
            {transaction.status !== 'disputed' && transaction.status !== 'escalated' && (
              <Button
                variant="warning"
                onClick={() => onDispute(transaction.id)}
                icon={<AlertTriangle className="w-4 h-4" />}
                className="mr-3"
              >
                Dispute
              </Button>
            )}
            
            {transaction.status !== 'escalated' && (
              <Button
                variant="danger"
                onClick={() => onEscalate(transaction.id)}
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                Escalate
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Transaction Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {transaction.merchant}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(transaction.date)}
            </p>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(transaction.amount)}
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-sm text-gray-900">{transaction.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <div className="mt-1">
                {transaction.status === 'approved' && (
                  <Badge variant="success">Approved</Badge>
                )}
                {transaction.status === 'disputed' && (
                  <Badge variant="warning">Disputed</Badge>
                )}
                {transaction.status === 'escalated' && (
                  <Badge variant="danger">Escalated</Badge>
                )}
                {transaction.status === 'pending' && (
                  <Badge variant="default">Pending Review</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        {transaction.flagged && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  This transaction was flagged by AI
                </h3>
                
                {transaction.flagReason && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-red-800">Reason:</h4>
                    <p className="text-sm text-red-700">
                      {transaction.flagReason}
                    </p>
                  </div>
                )}
                
                {transaction.confidenceScore && (
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-red-800 mr-2">AI Confidence:</span>
                    {getConfidenceBadge(transaction.confidenceScore)}
                  </div>
                )}
                
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-red-800">Expected Pattern:</h4>
                  <p className="text-sm text-red-700">
                    Based on your previous spending patterns, this transaction appears unusual.
                    You typically make purchases of this size less frequently or from established merchants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Additional Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              <p>Transaction ID: {transaction.id}</p>
              <p className="mt-1">Processed on: {formatDate(transaction.date)} at 14:30 EST</p>
              <p className="mt-1">Payment Method: Credit Card ending in ****4242</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;