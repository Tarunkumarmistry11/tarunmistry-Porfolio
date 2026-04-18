import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAbout } from "../../api";

export const getAbout = createAsyncThunk(
  "about/get",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAbout(); // data is already the object
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const aboutSlice = createSlice({
  name: "about",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default aboutSlice.reducer;
