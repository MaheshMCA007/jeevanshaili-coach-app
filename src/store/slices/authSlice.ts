import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../../api";

interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      const token = res.data.tokens?.accessToken || res.data.token;
      if (token) {
        await AsyncStorage.setItem('authToken', token);
      }
      if (res.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const loadToken = createAsyncThunk(
  "auth/loadToken",
  async (_, { dispatch }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');
      if (token) {
        dispatch(authSlice.actions.setToken(token));
        if (user) {
          dispatch(authSlice.actions.setUser(JSON.parse(user)));
        }
      }
    } catch (e) {
      console.error("Failed to load token", e);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      setAuthToken(null);   // 🔥 remove token from axios
      AsyncStorage.removeItem('authToken');
      AsyncStorage.removeItem('user');
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      setAuthToken(action.payload); // 🔥 sync token to axios
    },

    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        // 👇 match your backend response
        const token = action.payload.tokens?.accessToken || action.payload.token;

        state.token = token;
        state.user = action.payload.user;

        // 🔥 push token into axios for all future calls
        setAuthToken(token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
