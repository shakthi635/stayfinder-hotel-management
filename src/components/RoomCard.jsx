import React from "react";

const API_URL = "http://localhost:5000";

function RoomCard({ room }) {
  if (!room) {
    return null;
  }

  return (
    <div className="room-card">

      {/* ROOM IMAGES */}

      <div className="room-images">

        {Array.isArray(room.images) &&
        room.images.length > 0 ? (

          room.images.map(
            (image, index) => (
              <img
                key={index}
                src={`${API_URL}${image}`}
                alt={`${room.name} ${index + 1}`}
                className="room-image"
              />
            )
          )

        ) : (

          <div className="room-no-image">
            No room image
          </div>

        )}

      </div>

      {/* ROOM INFORMATION */}

      <div className="room-content">

        <h3>{room.name}</h3>

        {room.description && (
          <p>
            {room.description}
          </p>
        )}

        <h4>
          ₹
          {Number(
            room.price
          ).toLocaleString("en-IN")}

          <span> / night</span>
        </h4>

        <p>
          👤 Capacity:{" "}
          {room.capacity} guest
          {Number(room.capacity) !== 1
            ? "s"
            : ""}
        </p>

        {/* AMENITIES */}

        {Array.isArray(
          room.amenities
        ) &&
          room.amenities.length >
            0 && (
            <div className="room-amenities">

              {room.amenities.map(
                (
                  amenity,
                  index
                ) => (
                  <span
                    key={index}
                    className="amenity"
                  >
                    {amenity}
                  </span>
                )
              )}

            </div>
          )}

      </div>

    </div>
  );
}

export default RoomCard;