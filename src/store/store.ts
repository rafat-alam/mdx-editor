import { configureStore } from '@reduxjs/toolkit'
import signupReducer from './signUpSlice'

export const store = configureStore({
  reducer: {
    signup: signupReducer,
  },
})

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch