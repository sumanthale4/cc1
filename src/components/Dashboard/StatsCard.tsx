import React from 'react';
import Card from '../UI/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  className = ''
}) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          
          {change && (
            <div className="mt-1">
              <span 
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="ml-1 text-xs text-gray-500">from last month</span>
            </div>
          )}
        </div>
        
        <div className="p-2 bg-indigo-50 rounded-md">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;