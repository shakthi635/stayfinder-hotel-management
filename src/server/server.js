import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   UPLOADS
========================================================= */

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 100000);

    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage
});

/* =========================================================
   IN-MEMORY DATABASE
   NO POSTGRESQL
   NO SQL
========================================================= */

let hotels = [
  {
    id: 1,
    name: "Ocean Pearl Resort",
    location: "Calangute Beach",
    city: "Goa",
    description:
      "A beautiful beachfront resort with comfortable rooms, swimming pool and excellent dining.",
    price: 4500,
    rating: 4.8,
    rooms: 8,
    totalRooms: 10,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    amenities: [
      "Free WiFi",
      "Swimming Pool",
      "Beach Access",
      "Restaurant"
    ],
    reviews: [
      {
        id: 1,
        user: "Arun",
        rating: 5,
        comment: "Amazing location and very clean rooms."
      },
      {
        id: 2,
        user: "Priya",
        rating: 4.5,
        comment: "Very peaceful stay."
      }
    ]
  },

  {
    id: 2,
    name: "Mountain View Hotel",
    location: "Ooty Hills",
    city: "Ooty",
    description:
      "Enjoy peaceful mountain views and a relaxing stay surrounded by beautiful nature.",
    price: 3200,
    rating: 4.6,
    rooms: 6,
    totalRooms: 8,
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    amenities: [
      "Free WiFi",
      "Restaurant",
      "Room Service",
      "Parking"
    ],
    reviews: [
      {
        id: 1,
        user: "Karthik",
        rating: 5,
        comment: "Beautiful view and comfortable rooms."
      }
    ]
  },

  {
    id: 3,
    name: "Royal City Hotel",
    location: "MG Road",
    city: "Bangalore",
    description:
      "A modern luxury hotel located in the heart of the city with premium facilities.",
    price: 5500,
    rating: 4.7,
    rooms: 12,
    totalRooms: 15,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
    amenities: [
      "Free WiFi",
      "Gym",
      "Swimming Pool",
      "Restaurant"
    ],
    reviews: []
  },

  {
    id: 4,
    name: "Ambica Empire",
    location: "Vadapalani",
    city: "Chennai",
    description:
      "A stylish city hotel offering comfortable rooms, fine dining and convenient access to major attractions.",
    price: 3800,
    rating: 4.4,
    rooms: 7,
    totalRooms: 10,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    amenities: [
      "Free WiFi",
      "Restaurant",
      "Parking",
      "Room Service"
    ],
    reviews: []
  }
];

let bookings = [];

let nextHotelId = 5;
let nextBookingId = 1;

/* =========================================================
   HOME
========================================================= */

app.get("/", (req, res) => {
  res.json({
    message: "StayFinder API is running successfully"
  });
});

/* =========================================================
   GET ALL HOTELS
========================================================= */

app.get("/api/hotels", (req, res) => {
  res.json(hotels);
});

/* =========================================================
   GET SINGLE HOTEL
========================================================= */

app.get("/api/hotels/:id", (req, res) => {
  const id = Number(req.params.id);

  const hotel = hotels.find((item) => item.id === id);

  if (!hotel) {
    return res.status(404).json({
      message: "Hotel not found"
    });
  }

  res.json(hotel);
});

/* =========================================================
   ADD HOTEL
========================================================= */

app.post(
  "/api/hotels",
  upload.single("image"),
  (req, res) => {
    try {
      const {
        name,
        location,
        city,
        description,
        price,
        rating,
        rooms,
        amenities
      } = req.body;

      if (!name || !city || !price) {
        return res.status(400).json({
          message: "Hotel name, city and price are required"
        });
      }

      const hotel = {
        id: nextHotelId++,
        name,
        location: location || city,
        city,
        description: description || "",
        price: Number(price),
        rating: Number(rating) || 4,
        rooms: Number(rooms) || 1,
        totalRooms: Number(rooms) || 1,

        image: req.file
          ? `http://localhost:${PORT}/uploads/${req.file.filename}`
          : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",

        amenities:
          typeof amenities === "string"
            ? amenities
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],

        reviews: []
      };

      hotels.push(hotel);

      res.status(201).json({
        message: "Hotel added successfully",
        hotel
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to add hotel"
      });
    }
  }
);

/* =========================================================
   UPDATE HOTEL
========================================================= */

app.put(
  "/api/hotels/:id",
  upload.single("image"),
  (req, res) => {
    try {
      const id = Number(req.params.id);

      const hotel = hotels.find(
        (item) => item.id === id
      );

      if (!hotel) {
        return res.status(404).json({
          message: "Hotel not found"
        });
      }

      const {
        name,
        location,
        city,
        description,
        price,
        rating,
        rooms,
        amenities
      } = req.body;

      hotel.name = name ?? hotel.name;
      hotel.location = location ?? hotel.location;
      hotel.city = city ?? hotel.city;
      hotel.description =
        description ?? hotel.description;

      if (price !== undefined) {
        hotel.price = Number(price);
      }

      if (rating !== undefined) {
        hotel.rating = Number(rating);
      }

      if (rooms !== undefined) {
        const newTotalRooms = Number(rooms);

        const bookedRooms =
          hotel.totalRooms - hotel.rooms;

        hotel.totalRooms = newTotalRooms;

        hotel.rooms = Math.max(
          0,
          newTotalRooms - bookedRooms
        );
      }

      if (amenities !== undefined) {
        hotel.amenities =
          typeof amenities === "string"
            ? amenities
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : hotel.amenities;
      }

      if (req.file) {
        hotel.image =
          `http://localhost:${PORT}/uploads/${req.file.filename}`;
      }

      res.json({
        message: "Hotel updated successfully",
        hotel
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to update hotel"
      });
    }
  }
);

/* =========================================================
   DELETE HOTEL
========================================================= */

app.delete("/api/hotels/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = hotels.findIndex(
    (item) => item.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Hotel not found"
    });
  }

  hotels.splice(index, 1);

  res.json({
    message: "Hotel deleted successfully"
  });
});

/* =========================================================
   ADD REVIEW / RATING
========================================================= */

app.post("/api/hotels/:id/reviews", (req, res) => {
  const id = Number(req.params.id);

  const hotel = hotels.find(
    (item) => item.id === id
  );

  if (!hotel) {
    return res.status(404).json({
      message: "Hotel not found"
    });
  }

  const {
    user,
    rating,
    comment
  } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({
      message: "Rating and comment are required"
    });
  }

  const newReview = {
    id: Date.now(),
    user: user || "Guest",
    rating: Number(rating),
    comment
  };

  hotel.reviews.push(newReview);

  const totalRating =
    hotel.reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating),
      0
    );

  hotel.rating = Number(
    (totalRating / hotel.reviews.length).toFixed(1)
  );

  res.status(201).json({
    message: "Review added successfully",
    hotel
  });
});

/* =========================================================
   CREATE BOOKING
========================================================= */

app.post("/api/bookings", (req, res) => {
  try {
    const {
      hotelId,
      guestName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      rooms
    } = req.body;

    const hotel = hotels.find(
      (item) => item.id === Number(hotelId)
    );

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    const requestedRooms = Number(rooms) || 1;

    if (hotel.rooms < requestedRooms) {
      return res.status(400).json({
        message: `Only ${hotel.rooms} room(s) available`
      });
    }

    if (
      !guestName ||
      !email ||
      !checkIn ||
      !checkOut
    ) {
      return res.status(400).json({
        message: "Please fill all required booking details"
      });
    }

    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(checkOut) -
          new Date(checkIn)) /
          (1000 * 60 * 60 * 24)
      )
    );

    const totalPrice =
      hotel.price * requestedRooms * nights;

    hotel.rooms -= requestedRooms;

    const booking = {
      id: nextBookingId++,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      guestName,
      email,
      phone: phone || "",
      checkIn,
      checkOut,
      guests: Number(guests) || 1,
      rooms: requestedRooms,
      nights,
      pricePerNight: hotel.price,
      totalPrice,
      status: "Confirmed",
      bookedAt: new Date().toISOString()
    };

    bookings.push(booking);

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Booking failed"
    });
  }
});

/* =========================================================
   GET BOOKINGS
========================================================= */

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

/* =========================================================
   GET SINGLE BOOKING
========================================================= */

app.get("/api/bookings/:id", (req, res) => {
  const id = Number(req.params.id);

  const booking = bookings.find(
    (item) => item.id === id
  );

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  res.json(booking);
});

/* =========================================================
   CANCEL BOOKING
========================================================= */

app.delete("/api/bookings/:id", (req, res) => {
  const id = Number(req.params.id);

  const bookingIndex = bookings.findIndex(
    (item) => item.id === id
  );

  if (bookingIndex === -1) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  const booking = bookings[bookingIndex];

  const hotel = hotels.find(
    (item) => item.id === booking.hotelId
  );

  if (hotel) {
    hotel.rooms += booking.rooms;

    if (hotel.rooms > hotel.totalRooms) {
      hotel.rooms = hotel.totalRooms;
    }
  }

  booking.status = "Cancelled";

  res.json({
    message: "Booking cancelled successfully",
    booking
  });
});

/* =========================================================
   SERVER
========================================================= */

app.listen(PORT, () => {
  console.log("");
  console.log("==============================================");
  console.log("        STAYFINDER BACKEND READY");
  console.log("==============================================");
  console.log(`Server:   http://localhost:${PORT}`);
  console.log(`Hotels:   http://localhost:${PORT}/api/hotels`);
  console.log(`Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`Uploads:  http://localhost:${PORT}/uploads`);
  console.log("==============================================");
  console.log("No PostgreSQL");
  console.log("No SQL");
  console.log("No database required");
  console.log("==============================================");
});