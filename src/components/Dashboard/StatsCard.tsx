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
    <Card className={`group hover:scale-102 transition-all duration-300 ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            
            {change && (
              <div className="mt-2 flex items-center">
                <span 
                  className={`text-sm font-medium ${
                    change.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
                </span>
                <span className="ml-1.5 text-xs text-gray-500">from last month</span>
              </div>
            )}
          </div>
          
          <div className="p-3 rounded-xl bg-white/50 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;