import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { UserState } from "../utils/typings.d";

// Define a type for the slice state
interface State {
  user: UserState | null;
  open: boolean;
}

// Define the initial state using that type
const initialState: State = {
  user: null,
  open: false,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState | null>) => {
      // state = { ...state, ...action.payload };
      state.user = action.payload;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    // 	state.value += action.payload;
    // }
  },
});

export const { setUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.users;

export default userSlice.reducer;
