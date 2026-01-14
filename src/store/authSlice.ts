import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TokenState {
  signup_token: string,     // signup
  signup_loading1: boolean, // signup
  signup_loading2: boolean, // signup
  signup_step: number,      // signup
  forgot_token: string,     // forgot
  forgot_loading1: boolean, // forgot
  forgot_loading2: boolean, // forgot
  forgot_loading3: boolean, // forgot
  forgot_step: number,      // forgot
}

const initialState: TokenState = {
  signup_token: "",
  signup_loading1: false,
  signup_loading2: false,
  signup_step: 1,
  forgot_token: "",
  forgot_loading1: false,
  forgot_loading2: false,
  forgot_loading3: false,
  forgot_step: 1,
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
    setSignUpStep: (state, action: PayloadAction<number>) => {
      state.signup_step = action.payload
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
    setForgotStep: (state, action: PayloadAction<number>) => {
      state.forgot_step = action.payload
    },
  },
})

export const {
  setSignUpToken,
  setSignUpLoading1,
  setSignUpLoading2,
  setSignUpStep,
  setForgotToken,
  setForgotLoading1,
  setForgotLoading2,
  setForgotLoading3,
  setForgotStep,
} = authSlice.actions

export default authSlice.reducer