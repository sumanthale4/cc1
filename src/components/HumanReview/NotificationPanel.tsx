import React from 'react';
import { PhoneCall, Mail, MessageSquare, Bell, RefreshCw, Clock } from 'lucide-react';
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
    const iconClasses = "w-6 h-6";
    switch (type) {
      case 'call':
        return <PhoneCall className={`${iconClasses} text-green-600`} />;
      case 'email':
        return <Mail className={`${iconClasses} text-[#0057B8]`} />;
      case 'sms':
        return <MessageSquare className={`${iconClasses} text-[#FFCB05]`} />;
      default:
        return <Bell className={`${iconClasses} text-[#A6A6A6]`} />;
    }
  };

  const getStatusBadge = (status: Notification['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success\" className="bg-green-100 text-green-700">Delivered</Badge>;
      case 'awaiting':
        return <Badge variant="warning" className="bg-[#FFCB05]/10 text-[#333333]">Awaiting Response</Badge>;
      case 'escalated':
        return <Badge variant="danger" className="bg-red-100 text-red-700">Escalated</Badge>;
      default:
        return <Badge variant="default" className="bg-[#F5F5F5] text-[#333333]">Unknown</Badge>;
    }
  };

  if (notifications.length === 0) {
    return (
      <Card className="bg-white p-8 text-center">
        <Bell className="w-16 h-16 mx-auto text-[#A6A6A6] mb-4" />
        <h3 className="text-lg font-medium text-[#333333] mb-2">No notifications sent</h3>
        <p className="text-[#A6A6A6]">
          Customer alerts will appear here when sent
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white divide-y divide-[#F5F5F5]">
      {notifications.map((notification) => (
        <div key={notification.id} className="p-6 hover:bg-[#F5F5F5] transition-colors">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                {getNotificationIcon(notification.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-[#333333]">
                  {notification.type === 'call' ? 'Phone Call Alert' : 
                   notification.type === 'email' ? 'Email Alert' : 'SMS Alert'}
                </h4>
                {getStatusBadge(notification.status)}
              </div>
              
              <div className="flex items-center text-[#A6A6A6] text-sm mb-3">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(notification.date)}
              </div>
              
              <div className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#333333]">{notification.merchant}</span>
                  <span className="font-semibold text-[#333333]">
                    {formatCurrency(notification.amount)}
                  </span>
                </div>
                <p className="text-sm text-[#A6A6A6]">
                  {notification.type === 'call' ? 
                    'Customer was called about this suspicious transaction' : 
                    notification.type === 'email' ?
                    'Email notification sent to customer about suspicious activity' :
                    'SMS alert sent to customer about suspicious transaction'}
                </p>
              </div>
              
              {notification.status !== 'delivered' && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetrigger(notification.id)}
                    icon={<RefreshCw className="w-4 h-4" />}
                    className="border-[#A6A6A6] text-[#333333] hover:bg-[#F5F5F5]"
                  >
                    Re-send {notification.type}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default NotificationPanel;