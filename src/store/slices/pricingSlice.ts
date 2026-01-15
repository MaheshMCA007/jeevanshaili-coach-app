import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchPricingPlans = createAsyncThunk('pricing/fetchPricingPlans', async () => {
    const response = await api.get('/pricing/plans');
    return response.data;
});

interface PricingState {
    plans: any[];
    loading: boolean;
    error: string | null;
}

const initialState: PricingState = {
    plans: [],
    loading: false,
    error: null,
};

const pricingSlice = createSlice({
    name: 'pricing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPricingPlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPricingPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload;
            })
            .addCase(fetchPricingPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch pricing plans';
            });
    },
});

export default pricingSlice.reducer;
