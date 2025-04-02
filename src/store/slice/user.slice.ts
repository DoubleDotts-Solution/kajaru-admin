/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userDetails: any | null;
}

const persistedUserDetails = localStorage.getItem("userDetails");
const initialState: UserState = {
  userDetails: persistedUserDetails ? JSON.parse(persistedUserDetails) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<any>) => {
      state.userDetails = action.payload;
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
