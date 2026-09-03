import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

// ==================================================
// GET HOTELS
// ==================================================

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",

  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters.name) {
        params.append("name", filters.name);
      }

      if (filters.minPrice) {
        params.append(
          "minPrice",
          filters.minPrice
        );
      }

      if (filters.maxPrice) {
        params.append(
          "maxPrice",
          filters.maxPrice
        );
      }

      const query =
        params.toString();

      const response = await fetch(
        `${API_URL}/hotels${
          query ? `?${query}` : ""
        }`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load hotels"
        );
      }

      return await response.json();

    } catch (error) {
      return rejectWithValue(
        error.message
      );
    }
  }
);

// ==================================================
// GET SINGLE HOTEL
// ==================================================

export const fetchHotelById =
  createAsyncThunk(
    "hotels/fetchHotelById",

    async (id, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/hotels/${id}`
        );

        if (!response.ok) {
          const data =
            await response.json();

          throw new Error(
            data.message ||
              "Hotel not found"
          );
        }

        return await response.json();

      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

// ==================================================
// ADD HOTEL
// ==================================================

export const addHotel =
  createAsyncThunk(
    "hotels/addHotel",

    async (hotel, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/hotels`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(hotel),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to add hotel"
          );
        }

        return data;

      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

// ==================================================
// UPDATE HOTEL
// ==================================================

export const updateHotel =
  createAsyncThunk(
    "hotels/updateHotel",

    async (
      { id, hotel },
      { rejectWithValue }
    ) => {
      try {
        const response = await fetch(
          `${API_URL}/hotels/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(hotel),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to update hotel"
          );
        }

        return data;

      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

// ==================================================
// DELETE HOTEL
// ==================================================

export const deleteHotel =
  createAsyncThunk(
    "hotels/deleteHotel",

    async (id, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/hotels/${id}`,
          {
            method: "DELETE",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to delete hotel"
          );
        }

        return id;

      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

// ==================================================
// INITIAL STATE
// ==================================================

const initialState = {
  items: [],

  selectedHotel: null,

  loading: false,

  detailsLoading: false,

  saving: false,

  error: null,

  detailsError: null,

  successMessage: null,
};

// ==================================================
// SLICE
// ==================================================

const hotelSlice = createSlice({
  name: "hotels",

  initialState,

  reducers: {
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
      state.detailsError = null;
    },

    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ------------------------------------------
      // FETCH HOTELS
      // ------------------------------------------

      .addCase(
        fetchHotels.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchHotels.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      .addCase(
        fetchHotels.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Unable to load hotels";
        }
      )

      // ------------------------------------------
      // FETCH SINGLE HOTEL
      // ------------------------------------------

      .addCase(
        fetchHotelById.pending,
        (state) => {
          state.detailsLoading = true;
          state.detailsError = null;
          state.selectedHotel = null;
        }
      )

      .addCase(
        fetchHotelById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedHotel =
            action.payload;
        }
      )

      .addCase(
        fetchHotelById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.detailsError =
            action.payload ||
            "Hotel not found";
        }
      )

      // ------------------------------------------
      // ADD HOTEL
      // ------------------------------------------

      .addCase(
        addHotel.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        addHotel.fulfilled,
        (state, action) => {
          state.saving = false;

          state.items.push(
            action.payload
          );

          state.successMessage =
            "Hotel added successfully";
        }
      )

      .addCase(
        addHotel.rejected,
        (state, action) => {
          state.saving = false;
          state.error =
            action.payload ||
            "Unable to add hotel";
        }
      )

      // ------------------------------------------
      // UPDATE HOTEL
      // ------------------------------------------

      .addCase(
        updateHotel.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addCase(
        updateHotel.fulfilled,
        (state, action) => {
          state.saving = false;

          const index =
            state.items.findIndex(
              (hotel) =>
                Number(hotel.id) ===
                Number(action.payload.id)
            );

          if (index !== -1) {
            state.items[index] =
              action.payload;
          }

          state.selectedHotel =
            action.payload;

          state.successMessage =
            "Hotel updated successfully";
        }
      )

      .addCase(
        updateHotel.rejected,
        (state, action) => {
          state.saving = false;
          state.error =
            action.payload ||
            "Unable to update hotel";
        }
      )

      // ------------------------------------------
      // DELETE HOTEL
      // ------------------------------------------

      .addCase(
        deleteHotel.fulfilled,
        (state, action) => {
          state.items =
            state.items.filter(
              (hotel) =>
                Number(hotel.id) !==
                Number(action.payload)
            );

          state.successMessage =
            "Hotel deleted successfully";
        }
      )

      .addCase(
        deleteHotel.rejected,
        (state, action) => {
          state.error =
            action.payload ||
            "Unable to delete hotel";
        }
      );
  },
});

export const {
  clearSelectedHotel,
  clearMessages,
} = hotelSlice.actions;

export default hotelSlice.reducer;