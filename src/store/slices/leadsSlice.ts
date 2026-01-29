import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/leads');
        // Handle different response structures: [leads] or { leads: [leads] }
        const data = Array.isArray(response.data) ? response.data : (response.data.leads || []);
        // Normalize IDs: ensure every lead has an 'id' field if it has '_id'
        // Prioritize _id or rawId for MongoDB compatibility (24 hex chars)
        return data.map((item: any) => ({
            ...item,
            id: item._id || item.rawId || item.id
        }));
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
});

export const createLead = createAsyncThunk(
    'leads/createLead',
    async (data: { name: string; email: string; phone: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post('/leads', data);
            dispatch(fetchLeads());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
        }
    }
);

export const addFollowUp = createAsyncThunk(
    'leads/addFollowUp',
    async ({ leadId, data }: { leadId: string; data: any }, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post(`/leads/${leadId}/followups`, data);
            dispatch(fetchLeads());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add follow-up');
        }
    }
);

export const assignPricingPlan = createAsyncThunk(
    'leads/assignPricingPlan',
    async (data: { userId: string; planId: string; endDate?: string }, { dispatch, rejectWithValue }) => {
        try {
            // Explicitly set role as string to fix backend "Cast to string failed for value ['consumer']" error
            const response = await api.post('/pricing/assign', { ...data, role: 'consumer' });
            dispatch(fetchLeads());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to assign plan');
        }
    }
);

export const updateLead = createAsyncThunk(
    'leads/updateLead',
    async ({ leadId, data }: { leadId: string; data: any }, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.patch(`/leads/${leadId}`, data);
            dispatch(fetchLeads());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
        }
    }
);

export const convertToClient = createAsyncThunk(
    'leads/convertToClient',
    async (leadId: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post(`/leads/${leadId}/convert`, { source: 'app' });
            dispatch(fetchLeads());
            return response.data; // Should be { message: "..." }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to convert lead');
        }
    }
);

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
                state.error = (action.payload as string) || action.error.message || 'Failed to fetch leads';
            });
    },
});

export default leadsSlice.reducer;
