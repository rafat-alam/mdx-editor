import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TokenState {
  token: string,
  loading: boolean, // signup
  loading2: boolean, // signup
  loading3: boolean, // signin
  forgottoken: string,
  forgottoken2: string,
  loading4: boolean, // forgot
  loading5: boolean, // forgot
  loading6: boolean, // forgot
}

const initialState: TokenState = {
  token: "",
  loading: false,
  loading2: false,
  loading3: false,
  forgottoken: "",
  forgottoken2: "",
  loading4: false,
  loading5: false,
  loading6: false,
}

const authSlice = createSlice({
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
    setForgotToken: (state, action: PayloadAction<string>) => {
      state.forgottoken = action.payload
    },
    setForgotToken2: (state, action: PayloadAction<string>) => {
      state.forgottoken2 = action.payload
    },
    setLoading4: (state, action: PayloadAction<boolean>) => {
      state.loading4 = action.payload
    },
    setLoading5: (state, action: PayloadAction<boolean>) => {
      state.loading5 = action.payload
    },
    setLoading6: (state, action: PayloadAction<boolean>) => {
      state.loading6 = action.payload
    },
  },
})

export const {
  setToken,
  setLoading,
  setLoading2,
  setLoading3,
  setForgotToken,
  setForgotToken2,
  setLoading4,
  setLoading5,
  setLoading6
} = authSlice.actions

export default authSlice.reducer