import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TokenState {
  token: string,
  loading: boolean,
  loading2: boolean,
  loading3: boolean,
}

const initialState: TokenState = {
  token: "",
  loading: false,
  loading2: false,
  loading3: false,
}

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setLoading2: (state, action: PayloadAction<boolean>) => {
      state.loading2 = action.payload
    },
    setLoading3: (state, action: PayloadAction<boolean>) => {
      state.loading3 = action.payload
    },
  },
})

export const {
  setToken,
  setLoading,
  setLoading2,
  setLoading3
} = signupSlice.actions

export default signupSlice.reducer