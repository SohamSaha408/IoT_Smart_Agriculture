import { useState, useEffect } from 'react'
import { irrigationAPI, farmsAPI } from '../../services/api'
import { PlayIcon, ClockIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function Irrigation() {
  const [farms, setFarms] = useState<any[]>([])
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
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
        irrigationAPI.getRecommendations(selectedFarmId),
        irrigationAPI.getSchedules({ farmId: selectedFarmId })
      ]).then(([recRes, schedRes]) => {
        setRecommendations(recRes.data.recommendations || [])
        setSchedules(schedRes.data.schedules || [])
      })
    }
  }, [selectedFarmId])

  const handleTriggerIrrigation = async (cropId: string, duration: number) => {
    try {
      await irrigationAPI.triggerIrrigation({
        farmId: selectedFarmId,
        cropId,
        durationMinutes: duration
      })
      toast.success('Irrigation started!')
      // Refresh schedules
      const res = await irrigationAPI.getSchedules({ farmId: selectedFarmId })
      setSchedules(res.data.schedules || [])
    } catch (error) {
      toast.error('Failed to start irrigation')
    }
  }

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-700 border-red-200',
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
        <h1 className="text-2xl font-bold text-gray-900">Smart Irrigation</h1>
        <p className="text-gray-500 mt-1">AI-powered irrigation recommendations and controls</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Irrigation Recommendations</h3>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.cropId}
                className={clsx('p-4 rounded-lg border', getUrgencyColor(rec.urgency))}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{rec.cropType}</h4>
                    <p className="text-sm mt-1">{rec.reason}</p>
                    <p className="text-xs mt-2 opacity-75">{rec.weatherForecast}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {rec.recommendedDuration} min
                    </span>
                    <button
                      onClick={() => handleTriggerIrrigation(rec.cropId, rec.recommendedDuration)}
                      className="btn-primary ml-4"
                    >
                      <PlayIcon className="w-4 h-4 mr-1" />
                      Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No irrigation recommendations at this time</p>
        )}
      </div>

      {/* Active/Scheduled */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Irrigations</h3>
        {schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {schedule.farm?.name} - {schedule.crop?.cropType || 'All crops'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(schedule.scheduledTime).toLocaleString()} - {schedule.durationMinutes} min
                    </p>
                  </div>
                </div>
                <span className={clsx(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  schedule.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  schedule.status === 'completed' ? 'bg-green-100 text-green-700' :
                  schedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                )}>
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No scheduled irrigations</p>
        )}
      </div>
    </div>
  )
}
