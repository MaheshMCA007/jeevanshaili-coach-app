import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

interface ClientState {
    clients: any[];
    selectedClientId: string | null;
    selectedClient: any | null;
    clientHealth: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ClientState = {
    clients: [],
    selectedClientId: null,
    selectedClient: null,
    clientHealth: [],
    loading: false,
    error: null,
};

/* ---------------------------------------------
   Fetch all clients
---------------------------------------------- */
export const fetchClients = createAsyncThunk(
    "clients/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/clients");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch clients"
            );
        }
    }
);

/* ---------------------------------------------
   Fetch selected client detail
---------------------------------------------- */
export const fetchClientDetail = createAsyncThunk(
    "clients/fetchDetail",
    async (clientId: string, { rejectWithValue }) => {
        try {
            if (!clientId) {
                throw new Error("Client ID missing");
            }

            console.log("Fetching client:", clientId);

            const [detailRes, healthRes] = await Promise.all([
                api.get(`/clients/${clientId}`),
                api.get(`/clients/${clientId}/health?limit=60`),
            ]);

            return {
                detail: detailRes.data,
                health: healthRes.data,
            };
        } catch (error: any) {
            console.error("Client detail error:", error?.response?.data || error.message);
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch client details"
            );
        }
    }
);

const clientSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {
        setSelectedClientId: (state, action) => {
            state.selectedClientId = action.payload;
        },
        clearSelectedClient: (state) => {
            state.selectedClientId = null;
            state.selectedClient = null;
            state.clientHealth = [];
        },
    },
    extraReducers: (builder) => {
        builder
            /* -------- fetchClients -------- */
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;

                // auto select first client if not selected
                if (action.payload.length > 0 && !state.selectedClientId) {
                    state.selectedClientId = action.payload[0]._id;
                }
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* -------- fetchClientDetail -------- */
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

export const { clearSelectedClient, setSelectedClientId } = clientSlice.actions;
export default clientSlice.reducer;
