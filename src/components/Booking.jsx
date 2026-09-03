import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

function Booking() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [hotel, setHotel] =
    useState(null);

  const [form, setForm] = useState({

    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    room: "Standard Room"

  });

  const [loading, setLoading] =
    useState(true);

  const [booking, setBooking] =
    useState(false);

  useEffect(() => {

    loadHotel();

  }, [id]);

  async function loadHotel() {

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/hotels/${id}`
        );

      if (!response.ok) {
        throw new Error();
      }

      const data =
        await response.json();

      setHotel(data);

      if (data.rooms?.length) {

        setForm(prev => ({
          ...prev,
          room: data.rooms[0].name
        }));

      }

    } catch (error) {

      alert("Hotel not found");

      navigate("/");

    } finally {

      setLoading(false);

    }

  }

  function handleChange(e) {

    const {
      name,
      value
    } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  }

  function getRoomPrice() {

    const room =
      hotel?.rooms?.find(
        item =>
          item.name === form.room
      );

    return room
      ? Number(room.price)
      : Number(hotel?.price || 0);

  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (
      !form.guestName ||
      !form.email ||
      !form.checkIn ||
      !form.checkOut
    ) {

      alert(
        "Please fill all required fields"
      );

      return;

    }

    if (
      new Date(form.checkOut) <=
      new Date(form.checkIn)
    ) {

      alert(
        "Check-out date must be after check-in date"
      );

      return;

    }

    setBooking(true);

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/bookings",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({

              hotelId:
                Number(hotel.id),

              hotelName:
                hotel.name,

              guestName:
                form.guestName,

              email:
                form.email,

              phone:
                form.phone,

              checkIn:
                form.checkIn,

              checkOut:
                form.checkOut,

              guests:
                Number(form.guests),

              room:
                form.room,

              totalPrice:
                getRoomPrice()

            })

          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Booking failed"
        );

      }

      alert(
        `Booking confirmed! Your booking ID is ${data.id}`
      );

      navigate(
        `/hotels/${hotel.id}`
      );

    } catch (error) {

      alert(
        error.message ||
        "Unable to create booking"
      );

    } finally {

      setBooking(false);

    }

  }

  if (loading) {

    return (
      <div className="page-center">
        Loading...
      </div>
    );

  }

  if (!hotel) {
    return null;
  }

  return (

    <div className="booking-page">

      <div className="booking-container">

        <Link
          to={`/hotels/${hotel.id}`}
          className="back-link"
        >
          ← Back to Hotel
        </Link>

        <div className="booking-layout">

          <div className="booking-form-card">

            <h1>
              Book Your Stay
            </h1>

            <p>
              Complete the details below to
              confirm your reservation.
            </p>

            <form
              onSubmit={handleSubmit}
            >

              <label>
                Full Name

                <input
                  name="guestName"
                  value={form.guestName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />

              </label>

              <label>
                Email

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

              </label>

              <label>
                Phone

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />

              </label>

              <div className="date-grid">

                <label>
                  Check In

                  <input
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    required
                  />

                </label>

                <label>
                  Check Out

                  <input
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    required
                  />

                </label>

              </div>

              <label>
                Guests

                <input
                  type="number"
                  name="guests"
                  min="1"
                  max="10"
                  value={form.guests}
                  onChange={handleChange}
                />

              </label>

              <label>
                Room

                <select
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                >

                  {hotel.rooms?.map(
                    room => (

                      <option
                        key={room.id}
                        value={room.name}
                      >
                        {room.name} -
                        ₹{room.price}
                      </option>

                    )
                  )}

                </select>

              </label>

              <button
                type="submit"
                className="book-button full"
                disabled={booking}
              >
                {booking
                  ? "Confirming..."
                  : "Confirm Booking"}
              </button>

            </form>

          </div>

          <div className="booking-summary">

            <img
              src={hotel.image}
              alt={hotel.name}
            />

            <h2>
              {hotel.name}
            </h2>

            <p>
              📍 {hotel.location}
            </p>

            <hr />

            <div className="summary-row">

              <span>
                Room
              </span>

              <strong>
                {form.room}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Price
              </span>

              <strong>
                ₹{getRoomPrice()}
              </strong>

            </div>

            <div className="summary-row total">

              <span>
                Total
              </span>

              <strong>
                ₹{getRoomPrice()}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Booking;