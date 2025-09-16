import { User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface UserState {
  token: string | null;
  user: User | null;
}

const initialState: UserState = {
  token: null,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      if (action.payload?.token) {
        state.token = action.payload.token;
      }
    },
    setUser: (state, action) => {
      if (action.payload?.user) {
        state.user = action.payload.user;
      }
    },
  },
});

export const { setToken, setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserToken = (state: RootState) => state.user.token;

export default userSlice;
