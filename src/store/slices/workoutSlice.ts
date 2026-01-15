import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchWorkouts = createAsyncThunk('workouts/fetchWorkouts', async () => {
    const response = await api.get('/library/workouts?q=&limit=48');
    return response.data;
});

interface WorkoutState {
    workouts: any[];
    loading: boolean;
    error: string | null;
}

const initialState: WorkoutState = {
    workouts: [],
    loading: false,
    error: null,
};

const workoutSlice = createSlice({
    name: 'workouts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkouts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkouts.fulfilled, (state, action) => {
                state.loading = false;
                state.workouts = action.payload;
            })
            .addCase(fetchWorkouts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch workouts';
            });
    },
});

export default workoutSlice.reducer;
