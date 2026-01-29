import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchPricingPlans = createAsyncThunk('pricing/fetchPricingPlans', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/pricing/plans');
        const data = Array.isArray(response.data) ? response.data : [];
        // Normalize IDs for pricing plans
        return data.map((item: any) => ({
            ...item,
            id: item._id || item.rawId || item.id
        }));
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch pricing plans');
    }
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
                state.error = (action.payload as string) || action.error.message || 'Failed to fetch pricing plans';
            });
    },
});

export default pricingSlice.reducer;
