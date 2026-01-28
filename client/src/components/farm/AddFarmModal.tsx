import { useState } from 'react'
import { useFarmStore } from '../../store/farmStore'
import { XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
}

const LAND_TYPES = [
  { value: 'alluvial', label: 'Alluvial Soil' },
  { value: 'black', label: 'Black Soil (Regur)' },
  { value: 'red', label: 'Red Soil' },
  { value: 'laterite', label: 'Laterite Soil' },
  { value: 'desert', label: 'Desert Soil' },
  { value: 'mountain', label: 'Mountain Soil' },
  { value: 'forest', label: 'Forest Soil' },
]

export default function AddFarmModal({ onClose }: Props) {
  const { createFarm } = useFarmStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    areaHectares: '',
    landType: '',
    soilPh: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(8),
          longitude: position.coords.longitude.toFixed(8),
        }))
        toast.success('Location detected!')
      },
      (error) => {
        toast.error('Unable to get your location')
        console.error('Geolocation error:', error)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast.error('Please fill in required fields')
      return
    }

    setIsLoading(true)
    const success = await createFarm({
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      areaHectares: formData.areaHectares ? parseFloat(formData.areaHectares) : null,
      landType: formData.landType || null,
      soilPh: formData.soilPh ? parseFloat(formData.soilPh) : null,
    })
    setIsLoading(false)

    if (success) {
      toast.success('Farm created successfully!')
      onClose()
    } else {
      toast.error('Failed to create farm')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Farm</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farm Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter farm name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 28.6139"
                  step="any"
                  min="-90"
                  max="90"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 77.2090"
                  step="any"
                  min="-180"
                  max="180"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="btn-secondary w-full"
            >
              Use Current Location
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Land Type
              </label>
              <select
                name="landType"
                value={formData.landType}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select land type</option>
                {LAND_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (Hectares)
                </label>
                <input
                  type="number"
                  name="areaHectares"
                  value={formData.areaHectares}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 5.5"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soil pH
                </label>
                <input
                  type="number"
                  name="soilPh"
                  value={formData.soilPh}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 6.5"
                  step="0.1"
                  min="0"
                  max="14"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Farm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
