import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Async Thunks

// User Login
export const loginUser = createAsyncThunk(
  'user/userLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/login`,
        { email, password },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Register
export const registerUser = createAsyncThunk(
  'user/userRegister',
  async (
    { name, email, password, confirmPassword, phoneNumber, address },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/register`,
        {
          name,
          email,
          password,
          confirmPassword,
          phoneNumber,
          address,
        },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Email Verification
export const verifyEmail = createAsyncThunk(
  'user/userVerifyEmail',
  async ({ email, verificationCode }, { rejectWithValue, getState }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/verify`,
        { email, verificationCode },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Forgot Password
export const forgotPassword = createAsyncThunk(
  'user/userForgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/forgotpassword`,
        { email },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Reset Password
export const resetPassword = createAsyncThunk(
  'user/userResetPassword',
  async (
    { email, resetToken, newPassword, confirmNewPassword },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/resetpassword`,
        { email, resetToken, newPassword, confirmNewPassword },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Update Profile
export const updateUserProfile = createAsyncThunk(
  'user/userUpdateProfile',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/profile`,
        {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Details
export const getUserDetails = createAsyncThunk(
  'user/userDetails',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/users/profile`,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User List (Admin)
export const listUsers = createAsyncThunk(
  'user/userList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };
      console.log("list user user thunk ",adminUserInfo.token);
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/users`,
        config
      );
      console.log("list user user thunk data" , data );
      return data;
    } catch (error) {
      console.log("error",adminUserInfo.token);
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Details By Id (Admin)
export const getUserDetailsById = createAsyncThunk(
  'user/userDetailsById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/users/${id}`,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Update Profile By Id (Admin)
export const updateUserProfileById = createAsyncThunk(
  'user/userUpdateProfileById',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/${formData._id}`,
        {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);

// User Delete By Id (Admin)
export const deleteUserById = createAsyncThunk(
  'user/userDeleteById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        admin: { adminUserInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${adminUserInfo.token}`,
        },
      };

      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/users/${id}`,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.response && error.response.status,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
);
