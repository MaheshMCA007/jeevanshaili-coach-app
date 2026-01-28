import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchFoods = createAsyncThunk('foods/fetchFoods', async (query: string = '') => {
    const response = await api.get(`/library/foods?q=${query}&limit=20`);
    return response.data;
});

export const assignMeal = createAsyncThunk(
    'foods/assignMeal',
    async ({ clientId, data }: { clientId: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/clients/${clientId}/assign-meal`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to assign meal');
        }
    }
);

interface FoodState {
    foods: any[];
    loading: boolean;
    assigning: boolean;
    error: string | null;
}

const initialState: FoodState = {
    foods: [],
    loading: false,
    assigning: false,
    error: null,
};

const foodSlice = createSlice({
    name: 'foods',
    initialState,
    reducers: {
        clearFoods: (state) => {
            state.foods = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoods.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFoods.fulfilled, (state, action) => {
                state.loading = false;
                state.foods = action.payload;
            })
            .addCase(fetchFoods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch foods';
            })
            .addCase(assignMeal.pending, (state) => {
                state.assigning = true;
            })
            .addCase(assignMeal.fulfilled, (state) => {
                state.assigning = false;
            })
            .addCase(assignMeal.rejected, (state, action) => {
                state.assigning = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearFoods } = foodSlice.actions;
export default foodSlice.reducer;
