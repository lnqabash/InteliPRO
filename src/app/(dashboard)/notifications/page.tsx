'use client';

import React, { useState } from 'react';
import {
  Bell, Star, AlertTriangle, Clock, FileText, Info,
  CheckCheck, Trash2, Filter, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import { formatRelativeDate } from '@/lib/utils';

type NotificationItem = {
  id: string;
  type: 'match_alert' | 'closing_reminder' | 'document_expiry' | 'system' | 'approval_required';
  title: string;
  message: string;
  entityId?: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: Timestamp;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'match_alert',
    title: 'High Match Opportunity Found',
    message: 'Gauteng ICT tender "Provision of ICT Infrastructure Services" scored 94% match against your profile.',
    entityId: 'tender-001',
    isRead: false,
    priority: 'high',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 300000)),
  },
  {
    id: '2',
    type: 'approval_required',
    title: 'Approval Required',
    message: 'Agent 2 has queued a match alert for GT/GPG/0077/2026 (88% match) in Supervised mode. Review and approve.',
    entityId: 'tender-005',
    isRead: false,
    priority: 'high',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1800000)),
  },
  {
    id: '3',
    type: 'closing_reminder',
    title: 'Tender Closing Soon',
    message: 'Eastern Cape Security Services tender (EC/DPW/0056/2026) closes in 7 days. Begin document preparation.',
    entityId: 'tender-006',
    isRead: false,
    priority: 'high',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3600000)),
  },
  {
    id: '4',
    type: 'document_expiry',
    title: 'Document Expiring Soon',
    message: 'Your BBBEE Certificate expires in 23 days. Renew it to maintain your bid readiness score.',
    isRead: false,
    priority: 'medium',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7200000)),
  },
  {
    id: '5',
    type: 'match_alert',
    title: 'New Match: Skills Development Tender',
    message: 'North West training tender (NW/DEPS/0044/2026) scored 82% match. Review opportunity.',
    entityId: 'tender-010',
    isRead: true,
    priority: 'medium',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000)),
  },
  {
    id: '6',
    type: 'system',
    title: 'AI Agents Updated',
    message: '3 new tenders discovered by Agent 1 — Tender Discovery Agent. Matching scores are being calculated.',
    isRead: true,
    priority: 'low',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 172800000)),
  },
  {
    id: '7',
    type: 'closing_reminder',
    title: 'Tender Closing Reminder',
    message: 'KZN school furniture tender (KZN/DOE/0087/2026) closes in 14 days.',
    entityId: 'tender-003',
    isRead: true,
    priority: 'medium',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 259200000)),
  },
];

const typeConfig = {
  match_alert: { icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Match Alert' },
  closing_reminder: { icon: Clock, color: 'text-red-600', bg: 'bg-red-50', label: 'Closing Reminder' },
  document_expiry: { icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Document Expiry' },
  system: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', label: 'System' },
  approval_required: { icon: AlertTriangle, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Approval Required' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="text-sm px-2.5">{unreadCount} new</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(f => f === 'all' ? 'unread' : 'all')}
            className={filter === 'unread' ? 'border-[#00A6A6] text-[#00A6A6]' : ''}
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            {filter === 'all' ? 'Show Unread' : 'Show All'}
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { type: 'match_alert', label: 'Match Alerts', count: notifications.filter(n => n.type === 'match_alert' && !n.isRead).length },
          { type: 'approval_required', label: 'Approvals', count: notifications.filter(n => n.type === 'approval_required' && !n.isRead).length },
          { type: 'closing_reminder', label: 'Reminders', count: notifications.filter(n => n.type === 'closing_reminder' && !n.isRead).length },
          { type: 'document_expiry', label: 'Doc Expiry', count: notifications.filter(n => n.type === 'document_expiry' && !n.isRead).length },
          { type: 'system', label: 'System', count: notifications.filter(n => n.type === 'system' && !n.isRead).length },
        ].map(item => {
          const config = typeConfig[item.type as keyof typeof typeConfig];
          return (
            <div key={item.type} className={`${config.bg} rounded-xl p-3 text-center`}>
              <config.icon className={`w-5 h-5 ${config.color} mx-auto mb-1`} />
              <p className={`text-lg font-bold ${config.color}`}>{item.count}</p>
              <p className="text-xs text-gray-600">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No notifications to show</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(notification => {
            const config = typeConfig[notification.type];
            return (
              <div
                key={notification.id}
                className={`rounded-xl border transition-all ${
                  !notification.isRead ? 'bg-white border-l-4 border-l-[#0A2540] shadow-sm' : 'bg-gray-50 border-gray-100'
                }`}
                onClick={() => markRead(notification.id)}
              >
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <config.icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </span>
                        <Badge variant="outline" className="text-xs">{config.label}</Badge>
                        {notification.priority === 'high' && !notification.isRead && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteNotification(notification.id); }}
                        className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{formatRelativeDate(notification.createdAt)}</span>
                      {notification.entityId && (
                        <Link
                          href={`/opportunities/${notification.entityId}`}
                          className="text-xs text-[#00A6A6] hover:underline flex items-center gap-1"
                          onClick={e => e.stopPropagation()}
                        >
                          View tender <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
