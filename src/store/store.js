import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./Slice/locationSlice";

const store = configureStore({
  reducer: {
    location: locationReducer,
  },
});

export default store;
