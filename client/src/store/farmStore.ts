import { create } from 'zustand'
import { farmsAPI, cropsAPI } from '../services/api'

interface Farm {
  id: string
  name: string
  latitude: number
  longitude: number
  boundary: any
  areaHectares: number | null
  landType: string | null
  soilPh: number | null
  village: string | null
  district: string | null
  state: string | null
  crops?: any[]
  devices?: any[]
}

interface FarmState {
  farms: Farm[]
  selectedFarm: Farm | null
  isLoading: boolean
  error: string | null
  fetchFarms: () => Promise<void>
  fetchFarmById: (id: string) => Promise<void>
  createFarm: (data: any) => Promise<boolean>
  updateFarm: (id: string, data: any) => Promise<boolean>
  deleteFarm: (id: string) => Promise<boolean>
  setSelectedFarm: (farm: Farm | null) => void
}

export const useFarmStore = create<FarmState>((set, get) => ({
  farms: [],
  selectedFarm: null,
  isLoading: false,
  error: null,

  fetchFarms: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await farmsAPI.getAll()
      set({ farms: response.data.farms, isLoading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch farms',
        isLoading: false,
      })
    }
  },

  fetchFarmById: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await farmsAPI.getById(id)
      set({ selectedFarm: response.data.farm, isLoading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch farm',
        isLoading: false,
      })
    }
  },

  createFarm: async (data: any) => {
    try {
      set({ error: null })
      const response = await farmsAPI.create(data)
      const newFarm = response.data.farm
      set((state) => ({ farms: [newFarm, ...state.farms] }))
      return true
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create farm' })
      return false
    }
  },

  updateFarm: async (id: string, data: any) => {
    try {
      set({ error: null })
      const response = await farmsAPI.update(id, data)
      const updatedFarm = response.data.farm
      set((state) => ({
        farms: state.farms.map((f) => (f.id === id ? updatedFarm : f)),
        selectedFarm: state.selectedFarm?.id === id ? updatedFarm : state.selectedFarm,
      }))
      return true
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to update farm' })
      return false
    }
  },

  deleteFarm: async (id: string) => {
    try {
      set({ error: null })
      await farmsAPI.delete(id)
      set((state) => ({
        farms: state.farms.filter((f) => f.id !== id),
        selectedFarm: state.selectedFarm?.id === id ? null : state.selectedFarm,
      }))
      return true
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to delete farm' })
      return false
    }
  },

  setSelectedFarm: (farm: Farm | null) => {
    set({ selectedFarm: farm })
  },
}))
