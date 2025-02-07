import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchTerm: '',
    filters: {
      category: null,
      date: null,
      status: null
    }
  },
  reducers: {
    setEvents: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateEvent: (state, action) => {
      const index = state.items.findIndex(event => event._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteEvent: (state, action) => {
      state.items = state.items.filter(event => event._id !== action.payload);
    }
  }
});

export const { setEvents, setLoading, setError, setSearchTerm, setFilters, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer; 