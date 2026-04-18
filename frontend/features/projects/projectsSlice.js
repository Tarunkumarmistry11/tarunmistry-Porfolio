import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProjects,
  fetchFeaturedProjects,
  fetchProjectBySlug,
} from "../../api";

export const getProjects = createAsyncThunk(
  "projects/getAll",
  async (type, { rejectWithValue }) => {
    try {
      const data = await fetchProjects(type); // returns data directly, NOT res.data
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const getFeaturedProjects = createAsyncThunk(
  "projects/getFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchFeaturedProjects(); // data is already the array
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const getProjectBySlug = createAsyncThunk(
  "projects/getBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const data = await fetchProjectBySlug(slug);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    list: [],
    featured: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFeaturedProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(getFeaturedProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProjectBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjectBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getProjectBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrent } = projectsSlice.actions;
export default projectsSlice.reducer;
