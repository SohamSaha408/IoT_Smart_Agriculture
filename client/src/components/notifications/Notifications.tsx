import { useState, useEffect } from 'react'
import { notificationsAPI } from '../../services/api'
import { BellIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const fetchNotifications = async () => {
    try {
      const res = await notificationsAPI.getAll({ 
        unreadOnly: filter === 'unread',
        limit: 50 
      })
      setNotifications(res.data.notifications)
      setUnreadCount(res.data.unreadCount)
    } catch (error) {
      console.error('Failed to fetch notifications')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications(notifications.map(n => ({ 
        ...n, 
        readAt: n.readAt || new Date().toISOString() 
      })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  const getTypeIcon = (priority: string) => {
    const iconClass = clsx(
      'w-5 h-5',
      priority === 'critical' ? 'text-red-600' :
      priority === 'high' ? 'text-orange-600' :
      'text-blue-600'
    )

    if (priority === 'critical' || priority === 'high') {
      return <ExclamationTriangleIcon className={iconClass} />
    }
    return <BellIcon className={iconClass} />
  }

  const getTypeBgColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100',
      high: 'bg-orange-100',
      medium: 'bg-blue-100',
      low: 'bg-gray-100',
    }
    return colors[priority] || 'bg-gray-100'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="btn-secondary">
            <CheckIcon className="w-5 h-5 mr-2" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            filter === 'all' 
              ? 'bg-primary-100 text-primary-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            filter === 'unread' 
              ? 'bg-primary-100 text-primary-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={clsx(
                'card cursor-pointer transition-colors',
                !notification.readAt && 'bg-primary-50 border-primary-100'
              )}
              onClick={() => !notification.readAt && handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className={clsx(
                  'p-2 rounded-lg flex-shrink-0',
                  getTypeBgColor(notification.priority)
                )}>
                  {getTypeIcon(notification.priority)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={clsx(
                        'font-medium',
                        notification.readAt ? 'text-gray-700' : 'text-gray-900'
                      )}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                    </div>
                    {!notification.readAt && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded">{notification.type}</span>
                    {notification.channels?.includes('sms') && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">SMS Sent</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">
            {filter === 'unread' ? 'All notifications have been read' : 'You have no notifications yet'}
          </p>
        </div>
      )}
    </div>
  )
}
