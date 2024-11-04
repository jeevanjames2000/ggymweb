// store/locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    selectedLocation: "GYM",
  },
  reducers: {
    stateLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
  },
});

export const { stateLocation } = locationSlice.actions;
export default locationSlice.reducer;
