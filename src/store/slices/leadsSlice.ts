import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
    const response = await api.get('/leads');
    return response.data;
});

interface LeadsState {
    leads: any[];
    loading: boolean;
    error: string | null;
}

const initialState: LeadsState = {
    leads: [],
    loading: false,
    error: null,
};

const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeads.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = action.payload;
            })
            .addCase(fetchLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch leads';
            });
    },
});

export default leadsSlice.reducer;
