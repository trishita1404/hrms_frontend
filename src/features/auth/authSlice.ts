import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';
import axiosInstance from '../../api/axiosInstance';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  accessToken: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ErrorResponse {
  message: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

// --- NEW LOGIC: Hydrate state from localStorage on load ---
const savedUser = localStorage.getItem('user');
const userPayload = savedUser ? JSON.parse(savedUser) : null;
const tokenPayload = localStorage.getItem('accessToken') || null;

const initialState: AuthState = {
  user: userPayload,     // Now starts with the saved user instead of null
  accessToken: tokenPayload,
  isLoading: false,
  isError: false,
  message: '',
};

export const login = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post<User>('/auth/login', userData);
      if (response.data) {
        // Save to localStorage so it persists across refreshes
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        return thunkAPI.rejectWithValue(axiosError.response?.data?.message || 'Login failed');
      }
      return thunkAPI.rejectWithValue('An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to login';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;