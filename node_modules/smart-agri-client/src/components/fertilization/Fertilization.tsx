import { useState, useEffect } from 'react'
import { fertilizationAPI, farmsAPI } from '../../services/api'
import { BeakerIcon, CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export default function Fertilization() {
  const [farms, setFarms] = useState<any[]>([])
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    farmsAPI.getAll().then((res) => {
      setFarms(res.data.farms)
      if (res.data.farms.length > 0) {
        setSelectedFarmId(res.data.farms[0].id)
      }
    }).finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (selectedFarmId) {
      Promise.all([
        fertilizationAPI.getRecommendations(selectedFarmId),
        fertilizationAPI.getHistory({ farmId: selectedFarmId, days: 30 })
      ]).then(([recRes, histRes]) => {
        setRecommendations(recRes.data.recommendations || [])
        setHistory(histRes.data.records || [])
      })
    }
  }, [selectedFarmId])

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    }
    return colors[urgency] || 'bg-gray-100 text-gray-700'
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Smart Fertilization</h1>
        <p className="text-gray-500 mt-1">Nutrient management and fertilization recommendations</p>
      </div>

      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Farm</label>
        <select
          value={selectedFarmId}
          onChange={(e) => setSelectedFarmId(e.target.value)}
          className="input max-w-md"
        >
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>{farm.name}</option>
          ))}
        </select>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fertilization Recommendations</h3>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.cropId}
                className={clsx('p-4 rounded-lg border', getUrgencyColor(rec.urgency))}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <BeakerIcon className="w-5 h-5 mr-2" />
                      <h4 className="font-medium">{rec.cropType}</h4>
                    </div>
                    <p className="text-sm mt-2">{rec.reason}</p>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Fertilizer:</span>
                        <span className="ml-2 font-medium">{rec.fertilizerType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <span className="ml-2 font-medium">{rec.quantityKg} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-600">NPK Ratio:</span>
                        <span className="ml-2 font-medium">{rec.npkRatio}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Est. Cost:</span>
                        <span className="ml-2 font-medium">Rs. {rec.estimatedCost}</span>
                      </div>
                    </div>
                    <p className="text-xs mt-2 opacity-75">Growth Stage: {rec.growthStage}</p>
                  </div>
                  <button className="btn-primary">
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Mark Applied
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No fertilization recommendations at this time</p>
        )}
      </div>

      {/* Recent History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.slice(0, 10).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{record.fertilizerType}</p>
                  <p className="text-sm text-gray-500">
                    {record.crop?.cropType} - {record.quantityKg} kg
                  </p>
                </div>
                <div className="text-right">
                  <span className={clsx(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    record.status === 'applied' ? 'bg-green-100 text-green-700' :
                    record.status === 'recommended' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {record.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(record.recommendedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent fertilization records</p>
        )}
      </div>
    </div>
  )
}
