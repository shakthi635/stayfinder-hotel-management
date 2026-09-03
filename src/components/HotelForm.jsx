import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

export default function HotelForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    location: "",
    city: "",
    description: "",
    price: "",
    rating: "",
    rooms: "",
    amenities: "",
  });

  const [hotelImage, setHotelImage] = useState(null);
  const [roomImages, setRoomImages] = useState([]);

  const [currentImage, setCurrentImage] = useState("");
  const [currentRoomImages, setCurrentRoomImages] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingHotel, setLoadingHotel] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD HOTEL FOR EDIT
  // ==========================================

  useEffect(() => {
    if (!isEdit) return;

    async function loadHotel() {
      try {
        setLoadingHotel(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/hotels/${id}`
        );

        if (!response.ok) {
          throw new Error("Hotel not found");
        }

        const hotel = await response.json();

        setForm({
          name: hotel.name || "",
          location: hotel.location || "",
          city: hotel.city || "",
          description: hotel.description || "",
          price: hotel.price ?? "",
          rating: hotel.rating ?? "",
          rooms: hotel.rooms ?? "",
          amenities: Array.isArray(hotel.amenities)
            ? hotel.amenities.join(", ")
            : hotel.amenities || "",
        });

        setCurrentImage(hotel.image || "");

        setCurrentRoomImages(
          Array.isArray(hotel.roomImages)
            ? hotel.roomImages
            : []
        );
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingHotel(false);
      }
    }

    loadHotel();
  }, [id, isEdit]);

  // ==========================================
  // TEXT INPUT
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ==========================================
  // HOTEL IMAGE
  // ==========================================

  function handleHotelImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setHotelImage(file);
  }

  // ==========================================
  // ROOM IMAGES
  // ==========================================

  function handleRoomImages(event) {
    const files = Array.from(
      event.target.files || []
    );

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    setRoomImages(validFiles);
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = new FormData();

      data.append("name", form.name);
      data.append("location", form.location);
      data.append("city", form.city);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("rating", form.rating);
      data.append("rooms", form.rooms);

      const amenities = form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append(
        "amenities",
        JSON.stringify(amenities)
      );

      // Main hotel image
      if (hotelImage) {
        data.append("image", hotelImage);
      }

      // Room images
      roomImages.forEach((file) => {
        data.append("roomImages", file);
      });

      const url = isEdit
        ? `${API_URL}/api/hotels/${id}`
        : `${API_URL}/api/hotels`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to save hotel"
        );
      }

      alert(
        isEdit
          ? "Hotel updated successfully!"
          : "Hotel added successfully!"
      );

      navigate("/hotels");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingHotel) {
    return (
      <div className="hotel-form-page">
        <h2>Loading hotel...</h2>
      </div>
    );
  }

  // ==========================================
  // FORM
  // ==========================================

  return (
    <div className="hotel-form-page">

      <h1>
        {isEdit ? "Edit Hotel" : "Add Hotel"}
      </h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* HOTEL NAME */}

        <div className="form-group">
          <label htmlFor="name">
            Hotel Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter hotel name"
            required
          />
        </div>

        {/* LOCATION */}

        <div className="form-group">
          <label htmlFor="location">
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
        </div>

        {/* CITY */}

        <div className="form-group">
          <label htmlFor="city">
            City
          </label>

          <input
            id="city"
            name="city"
            type="text"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        {/* DESCRIPTION */}

        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter hotel description"
            rows="5"
          />
        </div>

        {/* PRICE */}

        <div className="form-group">
          <label htmlFor="price">
            Price per Night
          </label>

          <input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            min="0"
            required
          />
        </div>

        {/* RATING */}

        <div className="form-group">
          <label htmlFor="rating">
            Rating
          </label>

          <input
            id="rating"
            name="rating"
            type="number"
            value={form.rating}
            onChange={handleChange}
            placeholder="0 - 5"
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* ROOMS */}

        <div className="form-group">
          <label htmlFor="rooms">
            Number of Rooms
          </label>

          <input
            id="rooms"
            name="rooms"
            type="number"
            value={form.rooms}
            onChange={handleChange}
            placeholder="Number of rooms"
            min="0"
          />
        </div>

        {/* AMENITIES */}

        <div className="form-group">
          <label htmlFor="amenities">
            Amenities
          </label>

          <input
            id="amenities"
            name="amenities"
            type="text"
            value={form.amenities}
            onChange={handleChange}
            placeholder="WiFi, Pool, Parking, Restaurant"
          />

          <small>
            Separate amenities with commas.
          </small>
        </div>

        {/* MAIN HOTEL IMAGE */}

        <div className="form-group">

          <label htmlFor="image">
            Upload Hotel Image
          </label>

          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleHotelImage}
          />

          {/* New image preview */}

          {hotelImage && (
            <div className="image-preview">

              <p>New image:</p>

              <img
                src={URL.createObjectURL(hotelImage)}
                alt="Hotel preview"
                style={{
                  width: "300px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

            </div>
          )}

          {/* Existing image */}

          {!hotelImage && currentImage && (
            <div className="image-preview">

              <p>Current hotel image:</p>

              <img
                src={getImageUrl(currentImage)}
                alt="Current hotel"
                style={{
                  width: "300px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

            </div>
          )}

        </div>

        {/* ROOM IMAGES */}

        <div className="form-group">

          <label htmlFor="roomImages">
            Upload Room Images
          </label>

          <input
            id="roomImages"
            name="roomImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleRoomImages}
          />

          {/* New room previews */}

          {roomImages.length > 0 && (
            <div>
              <p>
                Selected room images:{" "}
                {roomImages.length}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {roomImages.map(
                  (file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Room ${index + 1}`}
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* Existing room images */}

          {isEdit &&
            currentRoomImages.length > 0 &&
            roomImages.length === 0 && (
              <div>
                <p>Current room images:</p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {currentRoomImages.map(
                    (image, index) => (
                      <img
                        key={index}
                        src={getImageUrl(image)}
                        alt={`Room ${index + 1}`}
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            )}

        </div>

        {/* BUTTONS */}

        <div
          className="form-buttons"
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >

          <button
            type="button"
            onClick={() => navigate("/hotels")}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Hotel"
              : "Add Hotel"}
          </button>

        </div>

      </form>
    </div>
  );
}