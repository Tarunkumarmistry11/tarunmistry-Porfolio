import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getShopProducts = createAsyncThunk(
  "shop/getAll",
  async ({ category, sort } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (sort && sort !== "relevance")   params.set("sort", sort);
      const qs  = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${BASE}/shop${qs}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    } catch (err) { return rejectWithValue(err.message); }
  }
);

export const getProductBySlug = createAsyncThunk(
  "shop/getOne",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/shop/${slug}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    } catch (err) { return rejectWithValue(err.message); }
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    products: [],
    current:  null,
    filter:   "all",
    sort:     "relevance",
    loading:  false,
    error:    null,
  },
  reducers: {
    setFilter:    (state, { payload }) => { state.filter  = payload; },
    setSort:      (state, { payload }) => { state.sort    = payload; },
    clearCurrent: (state)              => { state.current = null;    },
  },
  extraReducers: (b) => {
    b
      .addCase(getShopProducts.pending,   (s)    => { s.loading = true;  s.error = null; })
      .addCase(getShopProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload; })
      .addCase(getShopProducts.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(getProductBySlug.pending,   (s)    => { s.loading = true; })
      .addCase(getProductBySlug.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(getProductBySlug.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setFilter, setSort, clearCurrent } = shopSlice.actions;
export default shopSlice.reducer;