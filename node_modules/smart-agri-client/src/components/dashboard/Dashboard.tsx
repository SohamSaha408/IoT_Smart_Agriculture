import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { farmsAPI, cropsAPI, notificationsAPI } from '../../services/api'
import {
  MapIcon,
  BeakerIcon,
  CloudIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface DashboardStats {
  totalFarms: number
  totalCrops: number
  activeCrops: number
  pendingIrrigations: number
  criticalAlerts: number
}

interface CropRanking {
  id: string
  cropType: string
  farmName: string
  healthScore: number
  healthStatus: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [healthiest, setHealthiest] = useState<CropRanking[]>([])
  const [weakest, setWeakest] = useState<CropRanking[]>([])
  const [recentNotifications, setRecentNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [farmsRes, rankingsRes, notificationsRes] = await Promise.all([
          farmsAPI.getAll(),
          cropsAPI.getRankings(),
          notificationsAPI.getAll({ limit: 5 }),
        ])

        const farms = farmsRes.data.farms
        const totalCrops = farms.reduce((sum: number, f: any) => sum + (f.crops?.length || 0), 0)
        const activeCrops = farms.reduce(
          (sum: number, f: any) =>
            sum + (f.crops?.filter((c: any) => c.status === 'active').length || 0),
          0
        )

        setStats({
          totalFarms: farms.length,
          totalCrops,
          activeCrops,
          pendingIrrigations: 0, // Would come from irrigation API
          criticalAlerts: notificationsRes.data.notifications.filter(
            (n: any) => n.priority === 'critical' && !n.readAt
          ).length,
        })

        setHealthiest(rankingsRes.data.healthiest || [])
        setWeakest(rankingsRes.data.weakest || [])
        setRecentNotifications(notificationsRes.data.notifications)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const getHealthColor = (status: string) => {
    const colors: Record<string, string> = {
      excellent: 'text-green-600 bg-green-100',
      healthy: 'text-emerald-600 bg-emerald-100',
      moderate: 'text-yellow-600 bg-yellow-100',
      stressed: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100',
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your farm.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/farms" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Farms</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalFarms || 0}</p>
            </div>
          </div>
        </Link>

        <Link to="/crops" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BeakerIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Crops</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeCrops || 0}</p>
            </div>
          </div>
        </Link>

        <Link to="/irrigation" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <CloudIcon className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Irrigation Due</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingIrrigations || 0}</p>
            </div>
          </div>
        </Link>

        <Link to="/notifications" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={clsx(
              'p-3 rounded-lg',
              (stats?.criticalAlerts || 0) > 0 ? 'bg-red-100' : 'bg-gray-100'
            )}>
              <BellAlertIcon className={clsx(
                'w-6 h-6',
                (stats?.criticalAlerts || 0) > 0 ? 'text-red-600' : 'text-gray-600'
              )} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.criticalAlerts || 0}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Crop Health Rankings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Healthiest Crops */}
        <div className="card">
          <div className="flex items-center mb-4">
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Healthiest Crops</h2>
          </div>
          {healthiest.length > 0 ? (
            <div className="space-y-3">
              {healthiest.map((crop, index) => (
                <div
                  key={crop.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{crop.cropType}</p>
                      <p className="text-sm text-gray-500">{crop.farmName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={clsx(
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      getHealthColor(crop.healthStatus)
                    )}>
                      {crop.healthScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No crop data available</p>
          )}
        </div>

        {/* Weakest Crops */}
        <div className="card">
          <div className="flex items-center mb-4">
            <ArrowTrendingDownIcon className="w-5 h-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Crops Needing Attention</h2>
          </div>
          {weakest.length > 0 ? (
            <div className="space-y-3">
              {weakest.map((crop, index) => (
                <div
                  key={crop.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{crop.cropType}</p>
                      <p className="text-sm text-gray-500">{crop.farmName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={clsx(
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      getHealthColor(crop.healthStatus)
                    )}>
                      {crop.healthScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">All crops are healthy!</p>
          )}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
          <Link to="/notifications" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        {recentNotifications.length > 0 ? (
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={clsx(
                  'flex items-start p-3 rounded-lg',
                  notification.readAt ? 'bg-gray-50' : 'bg-primary-50'
                )}
              >
                <div className={clsx(
                  'p-2 rounded-lg',
                  notification.priority === 'critical' ? 'bg-red-100' :
                  notification.priority === 'high' ? 'bg-orange-100' :
                  'bg-blue-100'
                )}>
                  {notification.priority === 'critical' || notification.priority === 'high' ? (
                    <ExclamationTriangleIcon className={clsx(
                      'w-5 h-5',
                      notification.priority === 'critical' ? 'text-red-600' : 'text-orange-600'
                    )} />
                  ) : (
                    <BellAlertIcon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No notifications</p>
        )}
      </div>
    </div>
  )
}
