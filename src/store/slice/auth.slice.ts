import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  id: number;
  email: string;
  full_name: string;
}

export interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  user: IUser | null;
}

const initialState: AuthState = {
  access_token: sessionStorage.getItem("__kajaru_access_") || null,
  refresh_token: localStorage.getItem("__kajaru_refresh_") || null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      const { access_token, refresh_token, user } = action.payload;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.user = user;

      if (access_token && refresh_token) {
        sessionStorage.setItem("__kajaru_access_", access_token);
        localStorage.setItem("__kajaru_refresh_", refresh_token);
      }
    },
    clearCredentials: (state) => {
      state.access_token = null;
      state.refresh_token = null;
      state.user = null;

      sessionStorage.removeItem("__kajaru_access_");
      localStorage.removeItem("__kajaru_refresh_");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
