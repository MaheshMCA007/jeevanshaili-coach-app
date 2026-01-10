import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientReducer from './slices/clientSlice';
import dashboardReducer from './slices/dashboardSlice';
import followupReducer from './slices/followupSlice';

import api from '../api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        clients: clientReducer,
        followups: followupReducer,
    },
});

// Setup api interceptor to inject token
api.interceptors.request.use(
    (config: any) => {
        const state = store.getState();
        const token = state.auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
