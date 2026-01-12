import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TokenState {
  signup_token: string,     // signup
  signup_loading1: boolean, // signup
  signup_loading2: boolean, // signup
  forgottoken: string,
  forgottoken2: string,
  loading4: boolean, // forgot
  loading5: boolean, // forgot
  loading6: boolean, // forgot
}

const initialState: TokenState = {
  signup_token: "",
  signup_loading1: false,
  signup_loading2: false,
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
    setSignUpToken: (state, action: PayloadAction<string>) => {
      state.signup_token = action.payload
    },
    setSignUpLoading1: (state, action: PayloadAction<boolean>) => {
      state.signup_loading1 = action.payload
    },
    setSignUpLoading2: (state, action: PayloadAction<boolean>) => {
      state.signup_loading2 = action.payload
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
  setSignUpToken,
  setSignUpLoading1,
  setSignUpLoading2,
  setForgotToken,
  setForgotToken2,
  setLoading4,
  setLoading5,
  setLoading6
} = authSlice.actions

export default authSlice.reducer