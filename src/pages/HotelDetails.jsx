import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000";

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${API_URL}${
    image.startsWith("/") ? image : `/${image}`
  }`;
}

export default function HotelDetails() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHotel() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/hotels/${id}`
        );

        if (!response.ok) {
          throw new Error("Hotel not found");
        }

        const data = await response.json();

        setHotel(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadHotel();
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <h2>Loading hotel...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>

        <Link to="/hotels">
          Back to Hotels
        </Link>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div>
        <h2>Hotel not found</h2>

        <Link to="/hotels">
          Back to Hotels
        </Link>
      </div>
    );
  }

  const image =
    hotel.image ||
    (Array.isArray(hotel.images)
      ? hotel.images[0]
      : "");

  const rooms = Array.isArray(hotel.rooms)
    ? hotel.rooms
    : [];

  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : [];

  return (
    <div className="hotel-details">

      <Link to="/hotels">
        ← Back to Hotels
      </Link>

      <h1>
        {hotel.name}
      </h1>

      {/* MAIN IMAGE */}

      {image && (
        <img
          src={getImageUrl(image)}
          alt={hotel.name}
          style={{
            width: "100%",
            maxWidth: "700px",
            height: "400px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      )}

      {/* INFORMATION */}

      <h2>
        {hotel.location || hotel.city}
      </h2>

      <p>
        {hotel.description}
      </p>

      <h3>
        ₹{Number(hotel.price || 0).toLocaleString()}
        {" "} / night
      </h3>

      <p>
        ⭐ {hotel.rating || "No rating"}
      </p>

      {/* AMENITIES */}

      <h2>Amenities</h2>

      {amenities.length > 0 ? (
        <ul>
          {amenities.map((amenity, index) => {

            const text =
              typeof amenity === "string"
                ? amenity
                : amenity?.name ||
                  amenity?.title ||
                  "";

            if (!text) {
              return null;
            }

            return (
              <li key={index}>
                {text}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>
          No amenities listed.
        </p>
      )}

      {/* ROOMS */}

      <h2>Rooms</h2>

      {rooms.length > 0 ? (
        <div>

          {rooms.map((room) => (

            <div
              key={room.id}
              className="room-card"
            >

              <h3>
                {room.name || "Room"}
              </h3>

              <p>
                Price: ₹
                {Number(
                  room.price || 0
                ).toLocaleString()}
              </p>

              <p>
                Capacity:{" "}
                {room.capacity || "N/A"}
              </p>

            </div>

          ))}

        </div>
      ) : (
        <p>
          No room details available.
        </p>
      )}

    </div>
  );
}