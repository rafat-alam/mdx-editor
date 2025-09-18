import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TokenState {
  token: string
}

const initialState: TokenState = {
  token: "",
}

const signupSlice = createSlice({
  name: 'signuptoken',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
  },
})

export const { setToken } = signupSlice.actions
export default signupSlice.reducer