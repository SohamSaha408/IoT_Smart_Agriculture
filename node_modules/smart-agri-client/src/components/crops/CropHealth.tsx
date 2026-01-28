import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { cropsAPI } from '../../services/api'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import clsx from 'clsx'

export default function CropHealth() {
  const { id } = useParams<{ id: string }>()
  const [crop, setCrop] = useState<any>(null)
  const [healthHistory, setHealthHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      Promise.all([
        cropsAPI.getById(id),
        cropsAPI.getHealth(id, { limit: 30 })
      ]).then(([cropRes, healthRes]) => {
        setCrop(cropRes.data.crop)
        setHealthHistory(healthRes.data.healthRecords || [])
        setIsLoading(false)
      }).catch(() => setIsLoading(false))
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!crop) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Crop not found</p>
        <Link to="/crops" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
          Go back to crops
        </Link>
      </div>
    )
  }

  const latestHealth = healthHistory[0]
  const chartData = healthHistory.slice().reverse().map((h) => ({
    date: new Date(h.recordedAt).toLocaleDateString(),
    ndvi: h.ndviValue ? parseFloat(h.ndviValue) : null,
    score: h.healthScore,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/crops" className="p-2 rounded-lg hover:bg-gray-100">
          <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{crop.cropType} Health</h1>
          <p className="text-gray-500">{crop.variety || 'Health monitoring and analytics'}</p>
        </div>
      </div>

      {/* Current Health Stats */}
      {latestHealth && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-gray-500">Health Score</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{latestHealth.healthScore}%</p>
            <span className={clsx(
              'inline-block px-2 py-1 text-xs font-medium rounded-full mt-2',
              latestHealth.healthStatus === 'excellent' ? 'bg-green-100 text-green-700' :
              latestHealth.healthStatus === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
              latestHealth.healthStatus === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
              latestHealth.healthStatus === 'stressed' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            )}>
              {latestHealth.healthStatus}
            </span>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">NDVI Value</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {latestHealth.ndviValue?.toFixed(3) || 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-2">Vegetation Index</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Soil Moisture</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {latestHealth.moistureLevel ? `${latestHealth.moistureLevel}%` : 'N/A'}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {latestHealth.temperature ? `${latestHealth.temperature}°C` : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Health Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trend</h3>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e' }}
                  name="Health Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No health data available</p>
        )}
      </div>

      {/* Recommendations */}
      {latestHealth?.recommendations?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {latestHealth.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
