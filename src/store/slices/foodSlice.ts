import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchFoods = createAsyncThunk('foods/fetchFoods', async () => {
    const response = await api.get('/library/foods?q=&limit=48');
    return response.data;
});

interface FoodState {
    foods: any[];
    loading: boolean;
    error: string | null;
}

const initialState: FoodState = {
    foods: [],
    loading: false,
    error: null,
};

const foodSlice = createSlice({
    name: 'foods',
    initialState,
    reducers: {},
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
            });
    },
});

export default foodSlice.reducer;
