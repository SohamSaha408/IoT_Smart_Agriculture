import { useState, useEffect } from 'react'
import { cropsAPI, farmsAPI } from '../../services/api'
import { BeakerIcon, PlusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function Crops() {
  const [farms, setFarms] = useState<any[]>([])
  const [selectedFarmId, setSelectedFarmId] = useState<string>('')
  const [crops, setCrops] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    farmsAPI.getAll().then((res) => {
      setFarms(res.data.farms)
      if (res.data.farms.length > 0) {
        setSelectedFarmId(res.data.farms[0].id)
      }
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (selectedFarmId) {
      setIsLoading(true)
      cropsAPI.getByFarm(selectedFarmId).then((res) => {
        setCrops(res.data.crops)
        setIsLoading(false)
      }).catch(() => setIsLoading(false))
    }
  }, [selectedFarmId])

  const getHealthColor = (status: string) => {
    const colors: Record<string, string> = {
      excellent: 'bg-green-100 text-green-700',
      healthy: 'bg-emerald-100 text-emerald-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      stressed: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  if (isLoading && farms.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Crops</h1>
          <p className="text-gray-500 mt-1">Monitor and manage your crops</p>
        </div>
        <button className="btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Crop
        </button>
      </div>

      {/* Farm Selector */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Farm
        </label>
        <select
          value={selectedFarmId}
          onChange={(e) => setSelectedFarmId(e.target.value)}
          className="input max-w-md"
        >
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </div>

      {/* Crops Grid */}
      {crops.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => {
            const health = crop.healthRecords?.[0]
            return (
              <div key={crop.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BeakerIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{crop.cropType}</h3>
                      {crop.variety && (
                        <p className="text-sm text-gray-500">{crop.variety}</p>
                      )}
                    </div>
                  </div>
                  <span className={clsx(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    crop.status === 'active' ? 'bg-green-100 text-green-700' :
                    crop.status === 'harvested' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {crop.status}
                  </span>
                </div>

                {health && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Health Score</span>
                      <span className={clsx(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getHealthColor(health.healthStatus)
                      )}>
                        {health.healthStatus}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={clsx(
                          'h-2 rounded-full',
                          health.healthScore >= 80 ? 'bg-green-500' :
                          health.healthScore >= 60 ? 'bg-emerald-500' :
                          health.healthScore >= 40 ? 'bg-yellow-500' :
                          health.healthScore >= 20 ? 'bg-orange-500' :
                          'bg-red-500'
                        )}
                        style={{ width: `${health.healthScore}%` }}
                      />
                    </div>
                    <p className="text-right text-sm font-medium text-gray-900 mt-1">
                      {health.healthScore}%
                    </p>
                  </div>
                )}

                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                  {crop.plantedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Planted:</span>
                      <span className="text-gray-900">
                        {new Date(crop.plantedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {crop.expectedHarvestDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected Harvest:</span>
                      <span className="text-gray-900">
                        {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {crop.areaHectares && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Area:</span>
                      <span className="text-gray-900">{crop.areaHectares} ha</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BeakerIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-500">Add crops to this farm to start monitoring</p>
        </div>
      )}
    </div>
  )
}
