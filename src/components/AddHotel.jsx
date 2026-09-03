import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

function AddHotel() {

  const { id } = useParams();

  const navigate = useNavigate();

  const isEdit =
    Boolean(id);

  const [form, setForm] = useState({

    name: "",
    location: "",
    price: "",
    rating: "4.5",
    description: "",
    amenities: "",
    imageUrl: ""

  });

  const [imageFile, setImageFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (isEdit) {
      loadHotel();
    }

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

      const hotel =
        await response.json();

      setForm({

        name: hotel.name || "",

        location:
          hotel.location || "",

        price:
          hotel.price || "",

        rating:
          hotel.rating || "4.5",

        description:
          hotel.description || "",

        amenities:
          hotel.amenities
            ? hotel.amenities.join(", ")
            : "",

        imageUrl:
          hotel.image || ""

      });

    } catch (error) {

      alert("Unable to load hotel");

      navigate("/");

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

  function handleFileChange(e) {

    setImageFile(
      e.target.files[0]
    );

  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (
      !form.name ||
      !form.location ||
      !form.price
    ) {

      alert(
        "Please enter hotel name, location and price"
      );

      return;

    }

    setLoading(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "location",
        form.location
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "rating",
        form.rating
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "amenities",
        form.amenities
      );

      formData.append(
        "imageUrl",
        form.imageUrl
      );

      if (imageFile) {

        formData.append(
          "image",
          imageFile
        );

      }

      const url =
        isEdit
          ? `http://localhost:5000/api/hotels/${id}`
          : "http://localhost:5000/api/hotels";

      const response =
        await fetch(
          url,
          {
            method:
              isEdit
                ? "PUT"
                : "POST",

            body: formData
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to save hotel"
        );

      }

      alert(
        isEdit
          ? "Hotel updated successfully!"
          : "Hotel added successfully!"
      );

      navigate(
        isEdit
          ? `/hotels/${id}`
          : "/"
      );

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="form-page">

      <div className="form-container">

        <h1>
          {isEdit
            ? "Edit Hotel"
            : "Add New Hotel"}
        </h1>

        <p>
          {isEdit
            ? "Update the hotel information."
            : "Add a new hotel to StayFinder."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="hotel-form"
        >

          <label>
            Hotel Name

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter hotel name"
              required
            />

          </label>

          <label>
            Location

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Example: Goa, India"
              required
            />

          </label>

          <label>
            Price Per Night

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="4500"
              required
            />

          </label>

          <label>
            Rating

            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              name="rating"
              value={form.rating}
              onChange={handleChange}
            />

          </label>

          <label>
            Description

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the hotel..."
              rows="5"
            />

          </label>

          <label>
            Amenities

            <input
              name="amenities"
              value={form.amenities}
              onChange={handleChange}
              placeholder="Free WiFi, Swimming Pool, Restaurant"
            />

          </label>

          <label>
            Image URL

            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />

          </label>

          <div className="or">
            OR
          </div>

          <label>
            Upload Hotel Image

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

          </label>

          {form.imageUrl && (

            <img
              src={form.imageUrl}
              alt="Preview"
              className="image-preview"
            />

          )}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate(-1)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="book-button"
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

    </div>

  );

}

export default AddHotel;