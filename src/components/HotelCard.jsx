import React from "react";
import { Link } from "react-router-dom";

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
    image.startsWith("/")
      ? image
      : `/${image}`
  }`;
}

function getRoomCount(rooms) {
  if (Array.isArray(rooms)) {
    return rooms.length;
  }

  if (typeof rooms === "number") {
    return rooms;
  }

  if (typeof rooms === "string") {
    const number = Number(rooms);

    if (!Number.isNaN(number)) {
      return number;
    }
  }

  return 0;
}

export default function HotelCard({ hotel }) {
  if (!hotel) {
    return null;
  }

  const image =
    hotel.image ||
    (Array.isArray(hotel.images)
      ? hotel.images[0]
      : "");

  const roomCount = getRoomCount(
    hotel.rooms
  );

  const amenities = Array.isArray(
    hotel.amenities
  )
    ? hotel.amenities
    : [];

  return (
    <article className="hotel-card">

      {/* IMAGE */}

      <div className="hotel-card-image">

        {image ? (
          <img
            src={getImageUrl(image)}
            alt={hotel.name || "Hotel"}
            onError={(e) => {
              e.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="no-image">
            No Image Available
          </div>
        )}

      </div>

      {/* CONTENT */}

      <div className="hotel-card-content">

        <div className="hotel-card-top">

          <h3>
            {hotel.name ||
              "Unnamed Hotel"}
          </h3>

          <div className="rating">
            ⭐{" "}
            {hotel.rating
              ? Number(
                  hotel.rating
                ).toFixed(1)
              : "N/A"}
          </div>

        </div>

        <p className="hotel-location">
          📍{" "}
          {hotel.location ||
            hotel.city ||
            "Location unavailable"}
        </p>

        <p className="hotel-description">
          {hotel.description
            ? hotel.description.length >
              110
              ? `${hotel.description.substring(
                  0,
                  110
                )}...`
              : hotel.description
            : "No description available."}
        </p>

        {/* PRICE + ROOMS */}

        <div className="hotel-meta">

          <div className="price">

            <strong>
              ₹
              {Number(
                hotel.price || 0
              ).toLocaleString()}
            </strong>

            <span>
              / night
            </span>

          </div>

          <div className="rooms">
            🛏️ {roomCount}{" "}
            {roomCount === 1
              ? "Room"
              : "Rooms"}
          </div>

        </div>

        {/* AMENITIES */}

        {amenities.length > 0 && (
          <div className="hotel-amenities">

            {amenities
              .slice(0, 4)
              .map((amenity, index) => {

                const text =
                  typeof amenity ===
                  "string"
                    ? amenity
                    : amenity?.name ||
                      amenity?.title ||
                      "";

                if (!text) {
                  return null;
                }

                return (
                  <span
                    key={index}
                    className="amenity"
                  >
                    {text}
                  </span>
                );
              })}

          </div>
        )}

        {/* BUTTONS */}

        <div className="hotel-card-actions">

          <Link
            to={`/hotels/${hotel.id}`}
            className="card-button details-button"
          >
            View Details
          </Link>

          <Link
            to={`/book/${hotel.id}`}
            className="card-button book-button"
          >
            Book Now
          </Link>

        </div>

      </div>

    </article>
  );
}