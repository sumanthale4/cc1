import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, File, AlertCircle, ArrowRight } from 'lucide-react';
import FileUpload from '../components/Dashboard/FileUpload';
import UploadHistory from '../components/Dashboard/UploadHistory';
import StatsCard from '../components/Dashboard/StatsCard';
import Button from '../components/UI/Button';
import { Statement } from '../types';
import { mockStatements, mockDashboardStats } from '../data/mockData';

const DashboardPage: React.FC = () => {
  const [statements, setStatements] = useState<Statement[]>(mockStatements);
  const [stats, setStats] = useState(mockDashboardStats);

  const handleFileUpload = (file: File) => {
    const newStatement: Statement = {
      id: `${statements.length + 1}`,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      status: 'processing',
      transactionCount: 0,
      flaggedCount: 0
    };

    setStatements([newStatement, ...statements]);

    setTimeout(() => {
      const updatedStatements = statements.map(s => {
        if (s.id === newStatement.id) {
          return {
            ...s,
            status: 'completed',
            transactionCount: 35,
            flaggedCount: 2
          };
        }
        return s;
      });

      setStatements([
        {
          ...newStatement,
          status: 'completed',
          transactionCount: 35,
          flaggedCount: 2
        },
        ...statements
      ]);

      setStats({
        ...stats,
        totalStatements: stats.totalStatements + 1,
        totalTransactions: stats.totalTransactions + 35,
        flaggedTransactions: stats.flaggedTransactions + 2
      });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Overview</h2>
        <p className="text-gray-600">Monitor your credit card activity and manage potential fraud</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Statements"
          value={stats.totalStatements}
          icon={<File className="h-6 w-6 text-indigo-600" />}
          change={{ value: 12, isPositive: true }}
          className="bg-gradient-to-br from-indigo-50 to-white"
        />
        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={<CreditCard className="h-6 w-6 text-blue-600" />}
          change={{ value: 8, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-white"
        />
        <StatsCard
          title="Flagged Transactions"
          value={stats.flaggedTransactions}
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          change={{ value: 2, isPositive: false }}
          className="bg-gradient-to-br from-red-50 to-white"
        />
        <StatsCard
          title="Disputes Resolved"
          value={stats.disputesResolved}
          icon={<Shield className="h-6 w-6 text-green-600" />}
          change={{ value: 5, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
            <h3 className="text-xl font-semibold mb-2">Upload Statement</h3>
            <p className="text-indigo-100 mb-6">
              Upload your credit card statement to begin fraud detection analysis
            </p>
            <FileUpload onUpload={handleFileUpload} />
          </div>
          
          {statements.length > 0 && (
            <div className="flex justify-end">
              <Link to="/transactions">
                <Button 
                  variant="primary"
                  size="lg"
                  className="group"
                >
                  Review Transactions
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <UploadHistory statements={statements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;