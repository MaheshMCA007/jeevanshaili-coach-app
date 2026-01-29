import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

interface FollowupState {
    dueToday: any[];
    dueNextWeek: any[];
    loading: boolean;
    error: string | null;
}

const initialState: FollowupState = {
    dueToday: [],
    dueNextWeek: [],
    loading: false,
    error: null,
};

export const fetchFollowups = createAsyncThunk(
    'followups/fetchAll',
    async (date: string, { rejectWithValue }) => {
        try {
            const [today, nextWeek] = await Promise.all([
                api.get(`/followups/due?date=${date}`),
                api.get(`/followups/due?date=${date}&rangeDays=7`),
            ]);
            return {
                today: today.data,
                nextWeek: nextWeek.data,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch follow-ups');
        }
    }
);

const followupSlice = createSlice({
    name: 'followups',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowups.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFollowups.fulfilled, (state, action) => {
                state.loading = false;
                state.dueToday = action.payload.today;
                state.dueNextWeek = action.payload.nextWeek;
            })
            .addCase(fetchFollowups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default followupSlice.reducer;
