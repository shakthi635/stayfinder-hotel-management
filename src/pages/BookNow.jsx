import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

const BookNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1,
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/hotels/${id}`);

        if (!response.ok) {
          throw new Error("Hotel not found");
        }

        const data = await response.json();
        setHotel(data);
      } catch (err) {
        setError(err.message || "Unable to load hotel");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;

    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);

    const difference = end.getTime() - start.getTime();

    if (difference <= 0) return 0;

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }, [form.checkIn, form.checkOut]);

  const totalPrice = useMemo(() => {
    if (!hotel || nights <= 0) return 0;

    return Number(hotel.price || 0) * nights * Number(form.rooms || 1);
  }, [hotel, nights, form.rooms]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.guestName.trim()) {
      setError("Please enter guest name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter email.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter phone number.");
      return;
    }

    if (!form.checkIn || !form.checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    try {
      setBooking(true);

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotelId: hotel.id,
          hotelName: hotel.name,

          guestName: form.guestName,
          email: form.email,
          phone: form.phone,

          checkIn: form.checkIn,
          checkOut: form.checkOut,

          guests: Number(form.guests),
          rooms: Number(form.rooms),

          nights,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setSuccess("Booking successful!");

      setTimeout(() => {
        navigate("/hotels");
      }, 1500);
    } catch (err) {
      setError(err.message || "Unable to complete booking.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <p>Loading hotel...</p>
        </div>
      </div>
    );
  }

  if (error && !hotel) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-error">{error}</div>

          <button
            className="secondary-button"
            onClick={() => navigate("/hotels")}
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <h2>Hotel not found</h2>

          <button
            className="secondary-button"
            onClick={() => navigate("/hotels")}
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="booking-layout">
          {/* HOTEL INFORMATION */}
          <div className="booking-hotel-card">
            {hotel.image && (
              <img
                src={getImageUrl(hotel.image)}
                alt={hotel.name}
                className="booking-hotel-image"
              />
            )}

            <div className="booking-hotel-info">
              <h1>{hotel.name}</h1>

              <p className="booking-location">
                📍 {hotel.location || hotel.city || "Location unavailable"}
              </p>

              <p className="booking-description">
                {hotel.description || "Enjoy a comfortable stay at this hotel."}
              </p>

              <div className="booking-price">
                ₹{Number(hotel.price || 0).toLocaleString("en-IN")}
                <span> / night</span>
              </div>

              <div className="booking-rating">
                ⭐ {hotel.rating || 0}
              </div>
            </div>
          </div>

          {/* BOOKING FORM */}
          <div className="booking-form-card">
            <h2>Book Your Stay</h2>

            {error && (
              <div className="booking-error">
                {error}
              </div>
            )}

            {success && (
              <div className="booking-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Guest Name</label>
                <input
                  type="text"
                  name="guestName"
                  value={form.guestName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Check-in</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Check-out</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Guests</label>

                  <input
                    type="number"
                    name="guests"
                    min="1"
                    value={form.guests}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Rooms</label>

                  <input
                    type="number"
                    name="rooms"
                    min="1"
                    value={form.rooms}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* PRICE SUMMARY */}
              <div className="booking-summary">
                <div>
                  <span>Price per night</span>
                  <strong>
                    ₹{Number(hotel.price || 0).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Nights</span>
                  <strong>{nights}</strong>
                </div>

                <div>
                  <span>Rooms</span>
                  <strong>{form.rooms}</strong>
                </div>

                <div className="total-row">
                  <span>Total Price</span>
                  <strong>
                    ₹{Number(totalPrice).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                className="book-now-button"
                disabled={booking}
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;