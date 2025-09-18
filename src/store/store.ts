import { configureStore } from '@reduxjs/toolkit'
import signupReducer from './signUpSlice'

export const store = configureStore({
  reducer: {
    signuptoken: signupReducer,
  },
})

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch