import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from './PropertySlice'

export const Store = configureStore({
  reducer: {
    property: propertyReducer,
  },
});
