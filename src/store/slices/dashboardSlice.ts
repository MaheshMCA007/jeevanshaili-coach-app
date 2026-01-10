import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

interface DashboardState {
    summary: any | null;
    steps: any[];
    calories: any[];
    weight: any[];
    nutrition: any[];
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    summary: null,
    steps: [],
    calories: [],
    weight: [],
    nutrition: [],
    loading: false,
    error: null,
};

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            // The shared api instance already adds the Bearer token via interceptors
            const [summary, steps, calories, weight, nutrition] = await Promise.all([
                api.get('/dashboard/summary'),
                api.get('/dashboard/steps'),
                api.get('/dashboard/calories'),
                api.get('/dashboard/weight'),
                api.get('/dashboard/nutrition'),
            ]);

            return {
                summary: summary.data,
                steps: steps.data,
                calories: calories.data,
                weight: weight.data,
                nutrition: nutrition.data,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload.summary;
                state.steps = action.payload.steps;
                state.calories = action.payload.calories;
                state.weight = action.payload.weight;
                state.nutrition = action.payload.nutrition;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;
