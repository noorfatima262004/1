

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Register Admin User
export const registerAdmin = createAsyncThunk(
  'admin/register',
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/register`,
        { name, email, password, confirmPassword },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data.message || error.message,
      });
    }
  }
);


// Login Admin User
export const loginAdmin = createAsyncThunk(
  'admin/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/login`,
        { email, password },
        config
      );
      console.log("login user", data);

      // Store token in local storage and update Redux state
      localStorage.setItem('adminToken', data.token); // Save token
      console.log(localStorage.getItem('adminToken'));

      return data; // Return data to update state
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data.message || error.message,
      });
    }
  }
);

// Admin Update Profile
export const updateAdminProfile = createAsyncThunk(
  'admin/updateProfile',
  async ({ name, email, password, confirmPassword }, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      // Check if token exists
      if (!adminUserInfo.token) {
        throw new Error('No token found, please log in again.');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/profile`,
        { name, email, password, confirmPassword },
        config
      );

      return data;
    } catch (error) {
      // Handle 401 Unauthorized error
      if (error.response?.status === 401) {
        console.error('Unauthorized access, redirecting to login...');
        // Optionally redirect to login here
      }
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data.message || error.message,
      });
    }
  }
);

// Admin User Details
export const getAdminUserDetails = createAsyncThunk(
  'admin/userDetails',
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      // Check if token exists
      if (!adminUserInfo.token) {
        throw new Error('No token found, please log in again.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/profile`,
        config
      );

      return data;
    } catch (error) {
      // Handle 401 Unauthorized error
      if (error.response?.status === 401) {
        console.error('Unauthorized access, redirecting to login...');
        // Optionally redirect to login here
      }
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data.message || error.message,
      });
    }
  }
);

// Admin List Users
export const listAdminUsers = createAsyncThunk(
  'admin/listUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      // Check if token exists
      if (!adminUserInfo.token) {
        throw new Error('No token found, please log in again.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/admin`,
        config
      );

      return data;
    } catch (error) {
      // Handle 401 Unauthorized error
      if (error.response?.status === 401) {
        console.error('Unauthorized access, redirecting to login...');
        // Optionally redirect to login here
      }
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data.message || error.message,
      });
    }
  }
);

// Admin User Details By ID
export const getAdminUserDetailsById = createAsyncThunk(
  'admin/userDetailsById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      // Check if token exists
      if (!adminUserInfo.token) {
        throw new Error('No token found, please log in again.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/${id}`,
        config
      );

      return data;
    } catch (error) {
      // Handle 401 Unauthorized error
      if (error.response?.status === 401) {
        console.error('Unauthorized access, redirecting to login...');
        // Optionally redirect to login here
      }
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data.message || error.message,
      });
    }
  }
);

// Admin Update User By ID
export const updateAdminUserById = createAsyncThunk(
  'admin/updateUserById',
  async ({ id, name, email, role, permissions, isApproved }, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      // Check if token exists
      if (!adminUserInfo.token) {
        throw new Error('No token found, please log in again.');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/${id}`,
        { name, email, role, permissions, isApproved },
        config
      );

      return data;
    } catch (error) {
      // Handle 401 Unauthorized error
      if (error.response?.status === 401) {
        console.error('Unauthorized access, redirecting to login...');
        // Optionally redirect to login here
      }
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data.message || error.message,
      });
    }
  }
);

// Admin Delete User By ID

export const deleteAdminUserById = createAsyncThunk(
  'admin/deleteUserById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      // Check if token exists
      if (!adminUserInfo.token) {
        throw new Error('No token found, please log in again.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/${id}`,
        config
      );

      return data;
    } catch (error) {
      // Handle 401 Unauthorized error
      if (error.response?.status === 401) {
        console.error('Unauthorized access, redirecting to login...');
        // Optionally redirect to login here
      }
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data.message || error.message,
      });
    }
  }
);
