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
    "dashboard/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const results = await Promise.allSettled([
                api.get("/dashboard/summary"),
                api.get("/dashboard/steps"),
                api.get("/dashboard/calories"),
                api.get("/dashboard/weight"),
                api.get("/dashboard/nutrition"),

            ]);
            // const res = await api.get("/dashboard/steps",{
            //     headers: {
            //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDE0ZmNiZTY0OWY2M2I3MzRjYzBmMyIsInJvbGUiOiJjb2FjaCIsInRlbmFudElkIjoiNjk0MTRmY2NlNjQ5ZjYzYjczNGNjMGY1IiwiaWF0IjoxNzY4MDUyMzM4LCJleHAiOjE3NjgwNTMyMzh9.Dj5yX6CkCkUxe1dUIPRDwJLYS4GOoAssGimN9rmYAko`,
            //     },
            // });
            // console.log("res.config.headers.Authorization",res.config.headers.Authorization);

            const get = (i: number) =>
                results[i].status === "fulfilled"
                    ? (results[i] as any).value.data
                    : [];

            return {
                summary: get(0),
                steps: get(1),
                calories: get(2),
                weight: get(3),
                nutrition: get(4),
            };
        } catch {
            return rejectWithValue("Dashboard failed");
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
