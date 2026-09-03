import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HotelCard from "../components/HotelCard";
import "./HotelList.css";

const API_URL = "http://localhost:5000";

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const loadHotels = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/hotels`);

      if (!response.ok) {
        throw new Error("Failed to load hotels");
      }

      const data = await response.json();

      // Backend may return either an array or { hotels: [] }
      const hotelData = Array.isArray(data)
        ? data
        : Array.isArray(data.hotels)
        ? data.hotels
        : [];

      setHotels(hotelData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        String(hotel.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(hotel.location || "")
          .toLowerCase()
          .includes(searchText) ||
        String(hotel.city || "")
          .toLowerCase()
          .includes(searchText);

      const price = Number(hotel.price || 0);

      const matchesMin =
        minPrice === "" || price >= Number(minPrice);

      const matchesMax =
        maxPrice === "" || price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesMin &&
        matchesMax
      );
    });
  }, [hotels, search, minPrice, maxPrice]);

  return (
    <div className="hotel-list-page">

      {/* ================= HEADER ================= */}

      <header className="page-header">

        <div>
          <h1 className="page-title">
            Hotels
          </h1>

          <p className="page-subtitle">
            Find the perfect hotel for your stay
          </p>
        </div>

        <div className="header-actions">

          <button
            className="refresh-button"
            onClick={loadHotels}
          >
            ↻ Refresh
          </button>

          <Link
            to="/add-hotel"
            className="add-hotel-button"
          >
            + Add Hotel
          </Link>

        </div>

      </header>

      {/* ================= SEARCH ================= */}

      <section className="search-section">

        <div className="search-box">

          <label>
            Search
          </label>

          <input
            type="text"
            placeholder="Search hotels or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="price-box">

          <label>
            Minimum Price
          </label>

          <input
            type="number"
            min="0"
            placeholder="₹ Min"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
          />

        </div>

        <div className="price-box">

          <label>
            Maximum Price
          </label>

          <input
            type="number"
            min="0"
            placeholder="₹ Max"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
          />

        </div>

        <button
          className="clear-filter-button"
          onClick={() => {
            setSearch("");
            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Clear
        </button>

      </section>

      {/* ================= RESULTS ================= */}

      <div className="results-row">

        <h2>
          Available Hotels
        </h2>

        <span>
          {filteredHotels.length}{" "}
          {filteredHotels.length === 1
            ? "hotel"
            : "hotels"}
        </span>

      </div>

      {/* ================= CONTENT ================= */}

      {loading && (
        <div className="status-message">
          Loading hotels...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        filteredHotels.length === 0 && (
          <div className="empty-message">
            <h3>
              No hotels found
            </h3>

            <p>
              Try changing your search or price filters.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        filteredHotels.length > 0 && (
          <div className="hotel-grid">

            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
              />
            ))}

          </div>
        )}

    </div>
  );
}