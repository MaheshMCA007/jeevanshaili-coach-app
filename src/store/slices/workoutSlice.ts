import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchWorkouts = createAsyncThunk('workouts/fetchWorkouts', async (query: string = '') => {
    const response = await api.get(`/library/workouts?q=${query}&limit=8`);
    return response.data;
});

export const assignWorkout = createAsyncThunk(
    'workouts/assignWorkout',
    async ({ clientId, data }: { clientId: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/clients/${clientId}/assign-workout`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to assign workout');
        }
    }
);

interface WorkoutState {
    workouts: any[];
    loading: boolean;
    assigning: boolean;
    error: string | null;
}

const initialState: WorkoutState = {
    workouts: [],
    loading: false,
    assigning: false,
    error: null,
};

const workoutSlice = createSlice({
    name: 'workouts',
    initialState,
    reducers: {
        clearWorkouts: (state) => {
            state.workouts = [];
        }
    },
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
            })
            .addCase(assignWorkout.pending, (state) => {
                state.assigning = true;
            })
            .addCase(assignWorkout.fulfilled, (state) => {
                state.assigning = false;
            })
            .addCase(assignWorkout.rejected, (state, action) => {
                state.assigning = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearWorkouts } = workoutSlice.actions;
export default workoutSlice.reducer;
