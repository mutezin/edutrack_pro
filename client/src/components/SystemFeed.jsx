import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Users, Calendar } from 'lucide-react';

function SystemFeed() {
  const notifications = [
    {
      id: 1,
      icon: Users,
      title: 'New teacher registration',
      subtitle: 'Mr. David Smith has joined',
      time: '2 hours ago',
      color: 'bg-blue-100'
    },
    {
      id: 2,
      icon: CheckCircle,
      title: 'System update complete',
      subtitle: 'Version 2.1.3 deployed',
      time: '4 hours ago',
      color: 'bg-green-100'
    },
    {
      id: 3,
      icon: AlertTriangle,
      title: 'Low attendance alert',
      subtitle: 'Class 10-A has low attendance',
      time: '5 hours ago',
      color: 'bg-yellow-100'
    },
    {
      id: 4,
      icon: Users,
      title: 'Parent Notification',
      subtitle: 'Parents notified for upcoming event',
      time: '6 hours ago',
      color: 'bg-purple-100'
    },
    {
      id: 5,
      icon: Calendar,
      title: 'Parent Meeting Scheduled',
      subtitle: 'Meeting scheduled for next week',
      time: '7 hours ago',
      color: 'bg-pink-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-800">System Feed</h3>
        <p className="text-gray-400 text-sm">View all notifications</p>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div key={notification.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex gap-3">
                <div className={`p-2 rounded ${notification.color} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.subtitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t text-center">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
          View all notifications →
        </button>
      </div>
    </div>
  );
}

export default SystemFeed;
