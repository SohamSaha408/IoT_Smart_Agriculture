import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Profile() {
  const { farmer, updateProfile, logout } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: farmer?.name || '',
    email: farmer?.email || '',
    address: farmer?.address || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const success = await updateProfile({
      name: formData.name || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
    })
    
    setIsLoading(false)
    
    if (success) {
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } else {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account information</p>
      </div>

      <div className="card">
        {/* Profile Header */}
        <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-12 h-12 text-primary-600" />
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {farmer?.name || 'Farmer'}
            </h2>
            <p className="text-gray-500">{farmer?.phone}</p>
            {farmer?.isVerified && (
              <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Verified Account
              </span>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={farmer?.phone || ''}
                disabled
                className="input bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Phone number cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="input disabled:bg-gray-50"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="input disabled:bg-gray-50"
                placeholder="Enter your email"
              />
              <p className="text-xs text-gray-400 mt-1">Used for email notifications</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="input disabled:bg-gray-50"
                placeholder="Enter your address"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: farmer?.name || '',
                      email: farmer?.email || '',
                      address: farmer?.address || '',
                    })
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            )}

            <button
              type="button"
              onClick={logout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Account ID</span>
            <span className="text-gray-900 font-mono">{farmer?.id?.substring(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Verification Status</span>
            <span className="text-green-600 font-medium">Verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}
