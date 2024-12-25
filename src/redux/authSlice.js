import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { loginApi } from '../configs/api/auth';

const initialState = {
  user: null,
  role: null,
  isLoggedIn: false,
  accessToken: localStorage.getItem('accessToken') || '',
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (value, { rejectWithValue }) => {
    try {
      const response = await loginApi(value);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null; 
      state.accessToken = null;
      state.status = 'logged out';
      state.isLoggedIn = false;
      localStorage.clear(); // Clear localStorage when logging out
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data;
        state.accessToken = action.payload.data.accessToken;
        // Decode the access token and store the user role
        const decodedToken = jwtDecode(action.payload.data.accessToken);
        state.role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        state.isLoggedIn = true;

        // Store the access token and role in localStorage
        localStorage.setItem('accessToken', action.payload.data.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
