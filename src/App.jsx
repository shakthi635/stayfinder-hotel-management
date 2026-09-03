import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";

const API = "https://stayfinder-hotel-management.onrender.com/api";
/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div
        className="brand"
        onClick={() => navigate("/")}
      >
        <div className="brand-icon">✦</div>

        <div>
          <div className="brand-name">
            StayFinder
          </div>

          <div className="brand-tag">
            Find your perfect stay
          </div>
        </div>
      </div>

      <div className="nav-links">
        <button
          className={
            location.pathname === "/"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => navigate("/")}
        >
          🏨 Hotels
        </button>

        <button
          className={
            location.pathname === "/add-hotel"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => navigate("/add-hotel")}
        >
          ＋ Add Hotel
        </button>

        <button
          className={
            location.pathname === "/bookings"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => navigate("/bookings")}
        >
          🎫 My Bookings
        </button>
      </div>
    </nav>
  );
}

/* =========================================================
   STAR RATING
========================================================= */

function Stars({ rating = 0 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= Math.round(rating)
              ? "star filled"
              : "star"
          }
        >
          ★
        </span>
      ))}

      <span className="rating-number">
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );
}

/* =========================================================
   HOTEL CARD
========================================================= */

function HotelCard({ hotel, onDetails }) {
  const navigate = useNavigate();

  return (
    <article className="hotel-card">
      <div className="hotel-image-wrapper">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="hotel-image"
        />

        <div className="image-badge">
          {hotel.rooms > 0
            ? `${hotel.rooms} rooms available`
            : "Sold out"}
        </div>
      </div>

      <div className="hotel-content">
        <div className="hotel-heading">
          <div>
            <h3>{hotel.name}</h3>

            <div className="location">
              📍 {hotel.location}, {hotel.city}
            </div>
          </div>

          <Stars rating={hotel.rating} />
        </div>

        <p className="hotel-description">
          {hotel.description}
        </p>

        <div className="amenity-row">
          {hotel.amenities
            ?.slice(0, 4)
            .map((amenity, index) => (
              <span
                className="amenity"
                key={index}
              >
                ✓ {amenity}
              </span>
            ))}
        </div>

        <div className="card-bottom">
          <div className="price">
            <strong>
              ₹{Number(hotel.price).toLocaleString()}
            </strong>

            <span>/ night</span>
          </div>

          <div className="rooms">
            🛏️ {hotel.rooms} rooms
          </div>
        </div>

        <div className="card-actions">
          <button
            className="secondary-button"
            onClick={() => onDetails(hotel)}
          >
            View Details
          </button>

          <button
            className="primary-button"
            disabled={hotel.rooms <= 0}
            onClick={() =>
              navigate(`/book/${hotel.id}`)
            }
          >
            {hotel.rooms > 0
              ? "Book Now →"
              : "Sold Out"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HotelList() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [maxPrice, setMaxPrice] =
    useState(10000);

  const [selectedHotel, setSelectedHotel] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const loadHotels = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/hotels`
      );

      const data = await response.json();

      setHotels(data);
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to backend. Make sure server.js is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const cities = [
    "All",
    ...new Set(
      hotels.map((hotel) => hotel.city)
    )
  ];

  const filteredHotels = hotels.filter(
    (hotel) => {
      const matchesSearch =
        hotel.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        hotel.city
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        hotel.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCity =
        city === "All" || hotel.city === city;

      const matchesPrice =
        Number(hotel.price) <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCity &&
        matchesPrice
      );
    }
  );

  return (
    <div>
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-label">
              ✨ SMART HOTEL DISCOVERY
            </span>

            <h1>
              Find a stay
              <br />
              <span>worth remembering.</span>
            </h1>

            <p>
              Discover beautiful hotels, compare
              prices and book your next stay in
              seconds.
            </p>

            <div className="search-box">
              <div className="search-input-wrapper">
                🔍
                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search hotel, city or location..."
                />
              </div>

              <select
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
              >
                {cities.map((item) => (
                  <option
                    value={item}
                    key={item}
                  >
                    {item === "All"
                      ? "All destinations"
                      : item}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  document
                    .getElementById(
                      "hotel-results"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth"
                    });
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <main
        className="main-container"
        id="hotel-results"
      >
        <div className="section-header">
          <div>
            <span className="section-label">
              CURATED FOR YOU
            </span>

            <h2>
              Explore beautiful stays
            </h2>

            <p>
              Handpicked hotels with verified
              ratings and comfortable rooms.
            </p>
          </div>

          <button
            className="add-hotel-button"
            onClick={() =>
              navigate("/add-hotel")
            }
          >
            ＋ Add New Hotel
          </button>
        </div>

        <div className="filter-panel">
          <div className="filter-title">
            Filter by price
          </div>

          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
          />

          <span>
            Up to ₹
            {Number(maxPrice).toLocaleString()}
          </span>

          <button
            className="clear-filter"
            onClick={() => {
              setSearch("");
              setCity("All");
              setMaxPrice(10000);
            }}
          >
            Reset
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loader"></div>
            Loading beautiful stays...
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              🔎
            </div>

            <h3>
              No hotels found
            </h3>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="hotel-grid">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onDetails={setSelectedHotel}
              />
            ))}
          </div>
        )}
      </main>

      {selectedHotel && (
        <HotelDetails
          hotel={selectedHotel}
          close={() =>
            setSelectedHotel(null)
          }
          refresh={loadHotels}
        />
      )}
    </div>
  );
}

/* =========================================================
   HOTEL DETAILS
========================================================= */

function HotelDetails({
  hotel,
  close,
  refresh
}) {
  const navigate = useNavigate();

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a review.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/hotels/${hotel.id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user: "Guest",
            rating,
            comment
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Thank you! Your review was added.");

      setComment("");

      await refresh();

      close();
    } catch {
      alert("Unable to submit review.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="details-modal">
        <button
          className="close-button"
          onClick={close}
        >
          ×
        </button>

        <img
          src={hotel.image}
          alt={hotel.name}
          className="details-image"
        />

        <div className="details-body">
          <div className="details-title">
            <div>
              <span className="section-label">
                HOTEL DETAILS
              </span>

              <h2>{hotel.name}</h2>

              <p className="location">
                📍 {hotel.location}, {hotel.city}
              </p>
            </div>

            <div className="rating-box">
              <strong>
                {Number(hotel.rating).toFixed(1)}
              </strong>

              <Stars rating={hotel.rating} />

              <small>
                {hotel.reviews?.length || 0} reviews
              </small>
            </div>
          </div>

          <p className="details-description">
            {hotel.description}
          </p>

          <div className="details-stats">
            <div>
              <span>From</span>
              <strong>
                ₹{Number(
                  hotel.price
                ).toLocaleString()}
              </strong>
              <small>per night</small>
            </div>

            <div>
              <span>Availability</span>
              <strong>
                {hotel.rooms}
              </strong>
              <small>rooms left</small>
            </div>

            <div>
              <span>Guest Rating</span>
              <strong>
                {Number(
                  hotel.rating
                ).toFixed(1)}
              </strong>
              <small>out of 5</small>
            </div>
          </div>

          <h3 className="subheading">
            Amenities
          </h3>

          <div className="details-amenities">
            {hotel.amenities?.map(
              (item, index) => (
                <span key={index}>
                  ✓ {item}
                </span>
              )
            )}
          </div>

          <div className="review-section">
            <h3 className="subheading">
              Guest Reviews
            </h3>

            {hotel.reviews?.length ? (
              hotel.reviews.map((review) => (
                <div
                  className="review-card"
                  key={review.id}
                >
                  <div className="review-top">
                    <strong>
                      {review.user}
                    </strong>

                    <Stars
                      rating={review.rating}
                    />
                  </div>

                  <p>
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="muted">
                No reviews yet.
              </p>
            )}

            <div className="write-review">
              <h4>
                Leave a review
              </h4>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(
                    Number(e.target.value)
                  )
                }
              >
                <option value="5">
                  ⭐⭐⭐⭐⭐ 5
                </option>

                <option value="4">
                  ⭐⭐⭐⭐ 4
                </option>

                <option value="3">
                  ⭐⭐⭐ 3
                </option>

                <option value="2">
                  ⭐⭐ 2
                </option>

                <option value="1">
                  ⭐ 1
                </option>
              </select>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Share your experience..."
              />

              <button
                className="secondary-button"
                onClick={submitReview}
              >
                Submit Review
              </button>
            </div>
          </div>

          <div className="details-actions">
            <button
              className="edit-button"
              onClick={() =>
                navigate(
                  `/edit-hotel/${hotel.id}`
                )
              }
            >
              ✏️ Edit Hotel
            </button>

            <button
              className="primary-button"
              disabled={hotel.rooms <= 0}
              onClick={() => {
                close();
                navigate(
                  `/book/${hotel.id}`
                );
              }}
            >
              {hotel.rooms > 0
                ? "Book This Hotel →"
                : "No Rooms Available"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ADD HOTEL
========================================================= */

function AddHotel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    city: "",
    description: "",
    price: "",
    rating: "4",
    rooms: "",
    amenities: ""
  });

  const [image, setImage] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const update = (field, value) => {
    setForm((old) => ({
      ...old,
      [field]: value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.city ||
      !form.price ||
      !form.rooms
    ) {
      alert(
        "Please fill hotel name, city, price and rooms."
      );
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          data.append(key, value);
        }
      );

      if (image) {
        data.append("image", image);
      }

      const response = await fetch(
        `${API}/hotels`,
        {
          method: "POST",
          body: data
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert("🎉 Hotel added successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        "Unable to add hotel. Check backend."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <span className="section-label">
          HOTEL MANAGEMENT
        </span>

        <h1>Add a new hotel</h1>

        <p>
          Add your property to StayFinder and
          make it discoverable to guests.
        </p>
      </div>

      <form
        className="hotel-form"
        onSubmit={submit}
      >
        <div className="form-section">
          <h3>🏨 Basic Information</h3>

          <div className="form-grid">
            <Input
              label="Hotel Name"
              value={form.name}
              onChange={(v) =>
                update("name", v)
              }
              placeholder="e.g. Grand Palace Hotel"
              required
            />

            <Input
              label="Location"
              value={form.location}
              onChange={(v) =>
                update("location", v)
              }
              placeholder="e.g. MG Road"
            />

            <Input
              label="City"
              value={form.city}
              onChange={(v) =>
                update("city", v)
              }
              placeholder="e.g. Chennai"
              required
            />

            <Input
              label="Price per Night"
              type="number"
              value={form.price}
              onChange={(v) =>
                update("price", v)
              }
              placeholder="2500"
              required
            />

            <Input
              label="Number of Rooms"
              type="number"
              value={form.rooms}
              onChange={(v) =>
                update("rooms", v)
              }
              placeholder="10"
              required
            />

            <div className="form-control">
              <label>Initial Rating</label>

              <select
                value={form.rating}
                onChange={(e) =>
                  update(
                    "rating",
                    e.target.value
                  )
                }
              >
                <option value="5">
                  5.0 ⭐⭐⭐⭐⭐
                </option>

                <option value="4">
                  4.0 ⭐⭐⭐⭐
                </option>

                <option value="3">
                  3.0 ⭐⭐⭐
                </option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label>Description</label>

            <textarea
              value={form.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
              placeholder="Describe the hotel, rooms and experience..."
              rows="5"
            />
          </div>

          <div className="form-control">
            <label>Amenities</label>

            <input
              value={form.amenities}
              onChange={(e) =>
                update(
                  "amenities",
                  e.target.value
                )
              }
              placeholder="Free WiFi, Swimming Pool, Parking, Restaurant"
            />

            <small>
              Separate amenities with commas.
            </small>
          </div>

          <div className="form-control">
            <label>Hotel Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
            />

            {image && (
              <small>
                Selected: {image.name}
              </small>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>

          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Adding..."
              : "＋ Add Hotel"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   INPUT COMPONENT
========================================================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required
}) {
  return (
    <div className="form-control">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

/* =========================================================
   EDIT HOTEL
========================================================= */

function EditHotel() {
  const navigate = useNavigate();
  const location = useLocation();

  const id = Number(
    location.pathname.split("/").pop()
  );

  const [form, setForm] =
    useState(null);

  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetch(`${API}/hotels/${id}`)
      .then((response) =>
        response.json()
      )
      .then((data) => {
        setForm({
          name: data.name,
          location: data.location,
          city: data.city,
          description: data.description,
          price: data.price,
          rating: data.rating,
          rooms: data.totalRooms,
          amenities:
            data.amenities?.join(", ") || ""
        });

        setLoading(false);
      })
      .catch(() => {
        alert("Unable to load hotel.");
        navigate("/");
      });
  }, [id]);

  const update = (field, value) => {
    setForm((old) => ({
      ...old,
      [field]: value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          data.append(key, value);
        }
      );

      if (image) {
        data.append("image", image);
      }

      const response = await fetch(
        `${API}/hotels/${id}`,
        {
          method: "PUT",
          body: data
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert(
        "✅ Hotel details updated successfully!"
      );

      navigate("/");
    } catch {
      alert("Unable to update hotel.");
    }
  };

  if (loading || !form) {
    return (
      <div className="loading">
        Loading hotel details...
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <span className="section-label">
          HOTEL MANAGEMENT
        </span>

        <h1>Edit hotel</h1>

        <p>
          Update your hotel information,
          pricing and availability.
        </p>
      </div>

      <form
        className="hotel-form"
        onSubmit={submit}
      >
        <div className="form-section">
          <h3>✏️ Hotel Information</h3>

          <div className="form-grid">
            <Input
              label="Hotel Name"
              value={form.name}
              onChange={(v) =>
                update("name", v)
              }
            />

            <Input
              label="Location"
              value={form.location}
              onChange={(v) =>
                update("location", v)
              }
            />

            <Input
              label="City"
              value={form.city}
              onChange={(v) =>
                update("city", v)
              }
            />

            <Input
              label="Price per Night"
              type="number"
              value={form.price}
              onChange={(v) =>
                update("price", v)
              }
            />

            <Input
              label="Total Rooms"
              type="number"
              value={form.rooms}
              onChange={(v) =>
                update("rooms", v)
              }
            />

            <div className="form-control">
              <label>Rating</label>

              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) =>
                  update(
                    "rating",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="form-control">
            <label>Description</label>

            <textarea
              rows="5"
              value={form.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-control">
            <label>Amenities</label>

            <input
              value={form.amenities}
              onChange={(e) =>
                update(
                  "amenities",
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-control">
            <label>
              Replace Hotel Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   BOOKING PAGE
========================================================= */

function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const hotelId = Number(
    location.pathname.split("/").pop()
  );

  const [hotel, setHotel] =
    useState(null);

  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1
  });

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetch(`${API}/hotels/${hotelId}`)
      .then((response) =>
        response.json()
      )
      .then((data) => {
        setHotel(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Hotel not found.");
        navigate("/");
      });
  }, [hotelId]);

  const update = (field, value) => {
    setForm((old) => ({
      ...old,
      [field]: value
    }));
  };

  const nights =
    form.checkIn && form.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(
              form.checkOut
            ) -
              new Date(
                form.checkIn
              )) /
              (1000 *
                60 *
                60 *
                24)
          )
        )
      : 1;

  const total =
    hotel
      ? Number(hotel.price) *
        Number(form.rooms) *
        nights
      : 0;

  const submit = async (e) => {
    e.preventDefault();

    if (!hotel) return;

    if (
      Number(form.rooms) >
      Number(hotel.rooms)
    ) {
      alert(
        `Only ${hotel.rooms} room(s) are available.`
      );
      return;
    }

    try {
      const response = await fetch(
        `${API}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            hotelId,
            ...form
          })
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setBooking(result.booking);
    } catch {
      alert(
        "Booking failed. Make sure backend is running."
      );
    }
  };

  if (loading || !hotel) {
    return (
      <div className="loading">
        Loading booking page...
      </div>
    );
  }

  if (booking) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-card">
          <div className="success-icon">
            ✓
          </div>

          <span className="section-label">
            BOOKING CONFIRMED
          </span>

          <h1>
            Your stay is booked!
          </h1>

          <p>
            Your reservation at{" "}
            <strong>
              {booking.hotelName}
            </strong>{" "}
            has been confirmed successfully.
          </p>

          <div className="booking-summary">
            <img
              src={booking.hotelImage}
              alt={booking.hotelName}
            />

            <div>
              <h3>
                {booking.hotelName}
              </h3>

              <p>
                👤 {booking.guestName}
              </p>

              <p>
                📅 {booking.checkIn} →{" "}
                {booking.checkOut}
              </p>

              <p>
                🛏️ {booking.rooms} room(s)
              </p>

              <p>
                👥 {booking.guests} guest(s)
              </p>
            </div>

            <div className="summary-price">
              ₹
              {Number(
                booking.totalPrice
              ).toLocaleString()}
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              className="secondary-button"
              onClick={() =>
                navigate("/bookings")
              }
            >
              View My Bookings
            </button>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/")
              }
            >
              Back to Hotels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-hotel">
          <img
            src={hotel.image}
            alt={hotel.name}
          />

          <div className="booking-hotel-content">
            <span className="section-label">
              YOUR SELECTED HOTEL
            </span>

            <h1>{hotel.name}</h1>

            <p className="location">
              📍 {hotel.location},{" "}
              {hotel.city}
            </p>

            <Stars
              rating={hotel.rating}
            />

            <p>
              {hotel.description}
            </p>

            <div className="booking-price">
              ₹
              {Number(
                hotel.price
              ).toLocaleString()}
              <span>
                / night
              </span>
            </div>

            <div className="availability">
              ✓ {hotel.rooms} rooms
              currently available
            </div>
          </div>
        </div>

        <form
          className="booking-form"
          onSubmit={submit}
        >
          <div className="form-header">
            <span className="section-label">
              RESERVATION
            </span>

            <h2>
              Complete your booking
            </h2>

            <p>
              Enter your details to confirm
              your stay.
            </p>
          </div>

          <div className="form-grid">
            <Input
              label="Guest Name"
              value={form.guestName}
              onChange={(v) =>
                update(
                  "guestName",
                  v
                )
              }
              placeholder="Your full name"
              required
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) =>
                update(
                  "email",
                  v
                )
              }
              placeholder="you@example.com"
              required
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) =>
                update(
                  "phone",
                  v
                )
              }
              placeholder="9876543210"
            />

            <Input
              label="Number of Guests"
              type="number"
              value={form.guests}
              onChange={(v) =>
                update(
                  "guests",
                  v
                )
              }
              required
            />

            <Input
              label="Check-in"
              type="date"
              value={form.checkIn}
              onChange={(v) =>
                update(
                  "checkIn",
                  v
                )
              }
              required
            />

            <Input
              label="Check-out"
              type="date"
              value={form.checkOut}
              onChange={(v) =>
                update(
                  "checkOut",
                  v
                )
              }
              required
            />

            <Input
              label="Rooms"
              type="number"
              value={form.rooms}
              onChange={(v) =>
                update(
                  "rooms",
                  Math.max(
                    1,
                    Math.min(
                      Number(v),
                      hotel.rooms
                    )
                  )
                )
              }
              required
            />
          </div>

          <div className="price-breakdown">
            <div>
              <span>
                ₹
                {Number(
                  hotel.price
                ).toLocaleString()}{" "}
                × {form.rooms} room(s)
              </span>

              <span>
                ₹
                {Number(
                  hotel.price *
                    form.rooms *
                    nights
                ).toLocaleString()}
              </span>
            </div>

            <div>
              <span>
                {nights} night(s)
              </span>

              <span>
                Included
              </span>
            </div>

            <hr />

            <div className="total-line">
              <strong>
                Total Amount
              </strong>

              <strong>
                ₹
                {Number(
                  total
                ).toLocaleString()}
              </strong>
            </div>
          </div>

          <button
            type="submit"
            className="primary-button large-button"
          >
            Confirm Booking →
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   BOOKINGS PAGE
========================================================= */

function Bookings() {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadBookings = async () => {
    try {
      const response = await fetch(
        `${API}/bookings`
      );

      const data = await response.json();

      setBookings(data);
    } catch {
      alert("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (id) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `${API}/bookings/${id}`,
        {
          method: "DELETE"
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(
        "Booking cancelled successfully."
      );

      loadBookings();
    } catch {
      alert(
        "Unable to cancel booking."
      );
    }
  };

  return (
    <div className="bookings-page">
      <div className="page-heading">
        <span className="section-label">
          RESERVATIONS
        </span>

        <h1>
          My Bookings
        </h1>

        <p>
          Manage all your StayFinder
          reservations in one place.
        </p>
      </div>

      {loading ? (
        <div className="loading">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            🎫
          </div>

          <h3>
            No bookings yet
          </h3>

          <p>
            Your confirmed reservations
            will appear here.
          </p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings
            .slice()
            .reverse()
            .map((booking) => (
              <div
                className="booking-card"
                key={booking.id}
              >
                <img
                  src={booking.hotelImage}
                  alt={booking.hotelName}
                />

                <div className="booking-info">
                  <div className="booking-status">
                    <span
                      className={
                        booking.status ===
                        "Confirmed"
                          ? "status confirmed"
                          : "status cancelled"
                      }
                    >
                      {booking.status}
                    </span>

                    <small>
                      Booking #
                      {booking.id}
                    </small>
                  </div>

                  <h3>
                    {booking.hotelName}
                  </h3>

                  <p>
                    👤 {booking.guestName}
                  </p>

                  <p>
                    📅 {booking.checkIn} →{" "}
                    {booking.checkOut}
                  </p>

                  <p>
                    🛏️ {booking.rooms} room(s)
                    &nbsp; • &nbsp;
                    👥 {booking.guests} guest(s)
                  </p>
                </div>

                <div className="booking-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      booking.totalPrice
                    ).toLocaleString()}
                  </strong>

                  {booking.status ===
                    "Confirmed" && (
                    <button
                      className="cancel-booking"
                      onClick={() =>
                        cancelBooking(
                          booking.id
                        )
                      }
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HotelList />}
        />

        <Route
          path="/add-hotel"
          element={<AddHotel />}
        />

        <Route
          path="/edit-hotel/:id"
          element={<EditHotel />}
        />

        <Route
          path="/book/:id"
          element={<BookingPage />}
        />

        <Route
          path="/bookings"
          element={<Bookings />}
        />

        <Route
          path="*"
          element={
            <div className="not-found">
              <div>
                <span>404</span>
                <h1>Page not found</h1>
                <button
                  className="primary-button"
                  onClick={() =>
                    (window.location.href =
                      "/")
                  }
                >
                  Go to Hotels
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}