import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFarmStore } from '../../store/farmStore'
import { PlusIcon, MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import AddFarmModal from './AddFarmModal'

export default function Farms() {
  const { farms, isLoading, fetchFarms, deleteFarm } = useFarmStore()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchFarms()
  }, [fetchFarms])

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const success = await deleteFarm(id)
      if (success) {
        toast.success('Farm deleted successfully')
      } else {
        toast.error('Failed to delete farm')
      }
    }
  }

  const getLandTypeLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      alluvial: 'Alluvial Soil',
      black: 'Black Soil',
      red: 'Red Soil',
      laterite: 'Laterite Soil',
      desert: 'Desert Soil',
      mountain: 'Mountain Soil',
      forest: 'Forest Soil',
    }
    return type ? labels[type] || type : 'Not specified'
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Farms</h1>
          <p className="text-gray-500 mt-1">Manage your farms and view their details</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Farm
        </button>
      </div>

      {/* Farms Grid */}
      {farms.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div key={farm.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {farm.village || farm.district || 'Location not set'}
                    {farm.state && `, ${farm.state}`}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Land Type:</span>
                  <span className="font-medium text-gray-900">
                    {getLandTypeLabel(farm.landType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Area:</span>
                  <span className="font-medium text-gray-900">
                    {farm.areaHectares ? `${farm.areaHectares} hectares` : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Crops:</span>
                  <span className="font-medium text-gray-900">
                    {farm.crops?.length || 0} active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Devices:</span>
                  <span className="font-medium text-gray-900">
                    {farm.devices?.length || 0} connected
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDelete(farm.id, farm.name)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
                <Link
                  to={`/farms/${farm.id}`}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Details
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No farms yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first farm</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Your First Farm
          </button>
        </div>
      )}

      {/* Add Farm Modal */}
      {showAddModal && (
        <AddFarmModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}
