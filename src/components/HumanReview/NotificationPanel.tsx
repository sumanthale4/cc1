import React from 'react';
import { PhoneCall, Mail, MessageSquare, Bell, RefreshCw } from 'lucide-react';
import { Notification } from '../../types';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Button from '../UI/Button';

interface NotificationPanelProps {
  notifications: Notification[];
  onRetrigger: (notificationId: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onRetrigger
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="w-5 h-5 text-blue-600" />;
      case 'email':
        return <Mail className="w-5 h-5 text-indigo-600" />;
      case 'sms':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: Notification['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'awaiting':
        return <Badge variant="warning">Awaiting Response</Badge>;
      case 'escalated':
        return <Badge variant="danger">Escalated</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  if (notifications.length === 0) {
    return (
      <Card title="Notification History" className="mb-6">
        <div className="text-center py-6">
          <Bell className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-base font-medium text-gray-900">No notifications sent</h3>
          <p className="mt-1 text-sm text-gray-500">
            Customer alerts will appear here when sent
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Notification History" className="mb-6">
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li key={notification.id} className="py-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.type === 'call' ? 'Phone Call Alert' : 
                       notification.type === 'email' ? 'Email Alert' : 'SMS Alert'}
                    </p>
                    <div>
                      {getStatusBadge(notification.status)}
                    </div>
                  </div>
                  
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      {formatDate(notification.date)}
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-800">
                      {notification.merchant} • {formatCurrency(notification.amount)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.type === 'call' ? 
                        'Customer was called about this suspicious transaction' : 
                        notification.type === 'email' ?
                        'Email notification sent to customer about suspicious activity' :
                        'SMS alert sent to customer about suspicious transaction'}
                    </p>
                  </div>
                  
                  {notification.status !== 'delivered' && (
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<RefreshCw className="w-3 h-3" />}
                        onClick={() => onRetrigger(notification.id)}
                      >
                        Re-trigger {notification.type}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default NotificationPanel;