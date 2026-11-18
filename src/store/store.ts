import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './filterSlice'
import authReducer from './authSlice'
import electricityConsumersReducer from './electricityConsumersSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    auth: authReducer,
    electricityConsumers: electricityConsumersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
