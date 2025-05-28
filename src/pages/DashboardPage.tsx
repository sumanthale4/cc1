import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, File, AlertCircle } from 'lucide-react';
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
    // Simulate adding a new statement
    const newStatement: Statement = {
      id: `${statements.length + 1}`,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      status: 'processing',
      transactionCount: 0,
      flaggedCount: 0
    };

    setStatements([newStatement, ...statements]);

    // Simulate processing
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

      // Update stats
      setStats({
        ...stats,
        totalStatements: stats.totalStatements + 1,
        totalTransactions: stats.totalTransactions + 35,
        flaggedTransactions: stats.flaggedTransactions + 2
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Statements"
          value={stats.totalStatements}
          icon={<File className="h-6 w-6 text-indigo-600" />}
          change={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={<CreditCard className="h-6 w-6 text-indigo-600" />}
          change={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Flagged Transactions"
          value={stats.flaggedTransactions}
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          change={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Disputes Resolved"
          value={stats.disputesResolved}
          icon={<Shield className="h-6 w-6 text-green-600" />}
          change={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FileUpload onUpload={handleFileUpload} />
          
          {statements.length > 0 && (
            <div className="flex justify-end">
              <Link to="/transactions">
                <Button 
                  variant="primary"
                  size="md"
                >
                  Review Transactions
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <UploadHistory statements={statements} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;