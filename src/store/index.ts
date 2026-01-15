import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import clientReducer from "./slices/clientSlice";
import dashboardReducer from "./slices/dashboardSlice";
import followupReducer from "./slices/followupSlice";
import foodReducer from "./slices/foodSlice";
import leadsReducer from "./slices/leadsSlice";
import pricingReducer from "./slices/pricingSlice";
import workoutReducer from "./slices/workoutSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    clients: clientReducer,
    followups: followupReducer,
    leads: leadsReducer,
    pricing: pricingReducer,
    workouts: workoutReducer,
    foods: foodReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
