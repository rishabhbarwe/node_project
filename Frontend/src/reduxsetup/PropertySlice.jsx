

import { createSlice } from "@reduxjs/toolkit";



const propertySlice = createSlice({
  name: "property",
  initialState : {
    properties : []
  },
  reducers: {
    addProperty: (state, action) => {
      console.log("Data in slice : ",action.payload)
      state.properties.push(action.payload);
    },
    removeProperty: (state, action) => {
      const propertyIndex = state.properties.findIndex(
        (property) => property.buildingName === action.payload.buildingName
      );
      if (propertyIndex !== -1) {
        state.properties.splice(propertyIndex, 1);

      }
     
    },
      requestProperty: (state, action) => {
      const { propertyId, tenantDetails } = action.payload;
      const property = state.properties.find(p => p.id === propertyId);
      if (property) {
        property.requests.push(tenantDetails); // Store tenant details
      }
    },
  },
});

export const { addProperty, removeProperty,requestProperty } = propertySlice.actions;

export default propertySlice.reducer;
