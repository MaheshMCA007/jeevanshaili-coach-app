import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

interface ClientState {
    clients: any[];
    selectedClient: any | null;
    clientHealth: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ClientState = {
    clients: [],
    selectedClient: null,
    clientHealth: [],
    loading: false,
    error: null,
};

export const fetchClients = createAsyncThunk(
    'clients/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/clients');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
        }
    }
);

export const fetchClientDetail = createAsyncThunk(
    'clients/fetchDetail',
    async (clientId: string, { rejectWithValue }) => {
        try {
            const [detail, health] = await Promise.all([
                api.get(`/clients/${clientId}`),
                api.get(`/clients/${clientId}/health?limit=60`)
            ]);
            return { detail: detail.data, health: health.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch client details');
        }
    }
);

const clientSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        clearSelectedClient: (state) => {
            state.selectedClient = null;
            state.clientHealth = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchClientDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClientDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedClient = action.payload.detail;
                state.clientHealth = action.payload.health;
            })
            .addCase(fetchClientDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedClient } = clientSlice.actions;
export default clientSlice.reducer;
