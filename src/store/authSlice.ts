import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TokenState {
  signup_token: string,     // signup
  signup_loading1: boolean, // signup
  signup_loading2: boolean, // signup
  forgot_token: string,     // forgot
  forgot_loading1: boolean, // forgot
  forgot_loading2: boolean, // forgot
  forgot_loading3: boolean, // forgot
}

const initialState: TokenState = {
  signup_token: "",
  signup_loading1: false,
  signup_loading2: false,
  forgot_token: "",
  forgot_loading1: false,
  forgot_loading2: false,
  forgot_loading3: false,
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
      state.forgot_token = action.payload
    },
    setForgotLoading1: (state, action: PayloadAction<boolean>) => {
      state.forgot_loading1 = action.payload
    },
    setForgotLoading2: (state, action: PayloadAction<boolean>) => {
      state.forgot_loading2 = action.payload
    },
    setForgotLoading3: (state, action: PayloadAction<boolean>) => {
      state.forgot_loading3 = action.payload
    },
  },
})

export const {
  setSignUpToken,
  setSignUpLoading1,
  setSignUpLoading2,
  setForgotToken,
  setForgotLoading1,
  setForgotLoading2,
  setForgotLoading3,
} = authSlice.actions

export default authSlice.reducer