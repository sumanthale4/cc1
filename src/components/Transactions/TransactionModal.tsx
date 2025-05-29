import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Store,
  FileText,
  Shield,
  TrendingUp,
  X,
  Info,
  Flag
} from "lucide-react";
import { Transaction } from "../../types";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Badge from "../UI/Badge";

interface TransactionModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onDispute?: (id: string) => void;
  onEscalate?: (id: string) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onApprove,
  onDispute,
  onEscalate
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'analysis'>('details');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700";
      case "disputed":
        return "bg-red-100 text-red-700";
      case "escalated":
        return "bg-[#FFCB05]/10 text-[#333333]";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 mr-1.5" />;
      case "disputed":
        return <AlertTriangle className="h-4 w-4 mr-1.5" />;
      case "escalated":
        return <Flag className="h-4 w-4 mr-1.5" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1.5" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      size="lg"
    >
      <div className="flex flex-col h-full">
        {/* Status Banner */}
        <div className={`px-4 py-2 mb-4 rounded-lg flex items-center justify-between ${getStatusColor()}`}>
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="font-medium capitalize">{transaction.status}</span>
          </div>
          {transaction.flagged && (
            <Badge variant="danger" className="bg-red-100 text-red-700">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Flagged
            </Badge>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors duration-150 border-b-2 ${
              activeTab === 'details'
                ? 'border-[#FFCB05] text-[#333333]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            <Info className="w-4 h-4 inline mr-2" />
            Transaction Details
          </button>
          {transaction.flagged && (
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors duration-150 border-b-2 ${
                activeTab === 'analysis'
                  ? 'border-[#FFCB05] text-[#333333]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('analysis')}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Risk Analysis
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Transaction Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="font-medium">Amount</span>
                  </div>
                  <div className="text-2xl font-bold text-[#333333]">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="font-medium">Date</span>
                  </div>
                  <div className="text-lg text-[#333333]">
                    {formatDate(transaction.date)}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <Store className="h-5 w-5 mr-2" />
                    <span className="font-medium">Merchant</span>
                  </div>
                  <div className="text-lg text-[#333333]">
                    {transaction.merchant}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FileText className="h-5 w-5 mr-2" />
                    <span className="font-medium">Description</span>
                  </div>
                  <div className="text-lg text-[#333333] break-words">
                    {transaction.description}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Analysis Section */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-[#333333]">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="font-medium">Risk Score</span>
                  </div>
                  <div className="text-lg font-bold text-[#333333]">
                    {Math.round((transaction.confidenceScore || 0.5) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#FFCB05] h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${(transaction.confidenceScore || 0.5) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-red-800">
                      Reason for Flagging
                    </h4>
                    <p className="mt-1 text-sm text-red-700 break-words">
                      {transaction.flagReason || "Unusual transaction pattern detected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">
                      AI Analysis Details
                    </h4>
                    <p className="mt-1 text-sm text-blue-700">
                      Our AI system has detected anomalies in this transaction based on:
                      <ul className="list-disc ml-4 mt-2">
                        <li>Transaction amount pattern</li>
                        <li>Merchant category analysis</li>
                        <li>Historical spending behavior</li>
                        <li>Location-based risk assessment</li>
                      </ul>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300"
          >
            <X className="h-4 w-4 mr-1.5" />
            Close
          </Button>
          
          {transaction.status === "pending" && (
            <>
              <Button 
                variant="success" 
                onClick={() => onApprove?.(transaction.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Approve
              </Button>
              
              <Button 
                variant="danger" 
                onClick={() => onDispute?.(transaction.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="h-4 w-4 mr-1.5" />
                Dispute
              </Button>
              
              {transaction.flagged && (
                <Button 
                  variant="warning" 
                  onClick={() => onEscalate?.(transaction.id)}
                  className="bg-[#FFCB05] text-[#333333] hover:bg-[#FFD633]"
                >
                  <Flag className="h-4 w-4 mr-1.5" />
                  Escalate
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;