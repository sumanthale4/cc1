import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Statement } from '../../types';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import { useNavigate } from 'react-router-dom';

interface UploadHistoryProps {
  statements: Statement[];
}

const UploadHistory: React.FC<UploadHistoryProps> = ({ statements }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const handleReviewClick = () => {
    navigate('/transactions');
  };

  if (statements.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-base font-medium text-gray-900">No statements uploaded</h3>
          <p className="mt-1 text-sm text-gray-500">Upload your first statement to begin analysis</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Uploads" className="transition-all duration-300">
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {statements.map((statement) => (
            <li key={statement.id} className="py-4 animate-fadeIn">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{statement.fileName}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{formatDate(statement.uploadDate)}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge variant={statement.status === 'completed' ? 'success' : 'warning'}>
                        <div className="flex items-center">
                          {statement.status === 'completed' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {statement.status === 'completed' ? 'Completed' : 'Processing'}
                        </div>
                      </Badge>
                      {statement.flaggedCount > 0 && (
                        <Badge variant="danger" className="ml-2">
                          <div className="flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {statement.flaggedCount} flagged
                          </div>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {statement.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReviewClick}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
              
              {statement.status === 'completed' && (
                <div className="mt-3 pl-13">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Transactions:</span>{' '}
                      <span className="font-medium text-gray-900">{statement.transactionCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Flagged:</span>{' '}
                      <span className="font-medium text-gray-900">{statement.flaggedCount}</span>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default UploadHistory;