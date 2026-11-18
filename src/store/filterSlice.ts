import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface FilterState {
  minPower: number
  maxPower: number
  appliedMin: number
  appliedMax: number
}

const initialState: FilterState = {
  minPower: 0,
  maxPower: 5,
  appliedMin: 0,
  appliedMax: 5,
}

const filterSlice = createSlice({
  name: 'electricityConsumersFilter',
  initialState,
  reducers: {
    setMinPower: (state, action: PayloadAction<number>) => {
      state.minPower = action.payload
    },
    setMaxPower: (state, action: PayloadAction<number>) => {
      state.maxPower = action.payload
    },
    applyFilter: (state) => {
      state.appliedMin = state.minPower
      state.appliedMax = state.maxPower
    },
    resetFilter: () => initialState,
  },
})

export const {
  setMinPower,
  setMaxPower,
  applyFilter,
  resetFilter,
} = filterSlice.actions

export default filterSlice.reducer
