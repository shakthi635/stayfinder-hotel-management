import React, { useState } from "react";
import {
  Leaf,
  UtensilsCrossed,
  Waves,
  Monitor,
  Presentation,
  Dumbbell,
  WashingMachine,
  Wifi,
  Flame,
  Table2,
  BellRing,
  ConciergeBell,
  Clock3,
  Hotel,
  Sparkles,
  PhoneCall,
  HandPlatter,
  SprayCan,
  HandCoins,
  Check,
} from "lucide-react";

import "./HotelAmenities.css";

const amenitiesData = {
  property: [
    {
      name: "Sustainability",
      icon: Leaf,
      included: true,
    },
    {
      name: "Restaurant On-Site",
      icon: UtensilsCrossed,
      description: "3 Restaurants",
      included: true,
    },
    {
      name: "Outdoor Pool",
      icon: Waves,
      description: "Complimentary",
      included: true,
    },
    {
      name: "Business Center",
      icon: Monitor,
      included: false,
    },
    {
      name: "Meeting Space",
      icon: Presentation,
      included: true,
    },
    {
      name: "Fitness Center",
      icon: Dumbbell,
      description: "Complimentary",
      included: true,
    },
    {
      name: "On-Site Laundry",
      icon: WashingMachine,
      included: false,
    },
    {
      name: "No Fire Pit + Grill Grate",
      icon: Flame,
      included: false,
    },
    {
      name: "No Chairs + Picnic Table",
      icon: Table2,
      included: false,
    },
  ],

  room: [
    {
      name: "Complimentary Wi-Fi",
      icon: Wifi,
      description: "Free for Marriott Bonvoy Members",
      included: true,
    },
  ],

  services: [
    {
      name: "24 Hour Room Service",
      icon: Clock3,
      included: true,
    },
    {
      name: "Room Service",
      icon: HandPlatter,
      included: true,
    },
    {
      name: "Wake-Up Calls",
      icon: PhoneCall,
      included: true,
    },
    {
      name: "Concierge",
      icon: ConciergeBell,
      included: true,
    },
    {
      name: "Housekeeping",
      icon: Sparkles,
      description: "Daily",
      included: true,
    },
    {
      name: "Front Desk",
      icon: Hotel,
      included: true,
    },
    {
      name: "Service Request",
      icon: HandCoins,
      included: true,
    },
  ],
};

const allAmenities = [
  ...amenitiesData.property,
  ...amenitiesData.room,
  ...amenitiesData.services,
];

const tabs = [
  {
    id: "property",
    label: "Property Amenities",
  },
  {
    id: "room",
    label: "Room Amenities",
  },
  {
    id: "services",
    label: "Hotel Services",
  },
  {
    id: "all",
    label: "View All",
  },
];

function AmenityCard({ amenity }) {
  const Icon = amenity.icon;

  return (
    <div className="amenity-item">
      <div className="amenity-icon">
        <Icon size={22} strokeWidth={1.8} />
      </div>

      <div className="amenity-content">
        <div className="amenity-name-row">
          <span className="amenity-name">{amenity.name}</span>

          {amenity.included && (
            <span className="included-check">
              <Check size={12} strokeWidth={3} />
            </span>
          )}
        </div>

        {amenity.description && (
          <span className="amenity-description">
            {amenity.description}
          </span>
        )}
      </div>
    </div>
  );
}

export default function HotelAmenities() {
  const [activeTab, setActiveTab] = useState("property");

  const getAmenities = () => {
    if (activeTab === "all") {
      return allAmenities;
    }

    return amenitiesData[activeTab];
  };

  const currentAmenities = getAmenities();

  return (
    <section className="hotel-amenities">
      <div className="amenities-container">

        {/* Heading */}
        <div className="amenities-heading">
          <h2>FEATURED AMENITIES ON-SITE</h2>

          <div className="heading-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Tabs */}
        <div className="amenities-tabs">
          {tabs.map((tab) => {
            const count =
              tab.id === "property"
                ? amenitiesData.property.length
                : tab.id === "room"
                ? amenitiesData.room.length
                : tab.id === "services"
                ? amenitiesData.services.length
                : allAmenities.length;

            return (
              <button
                key={tab.id}
                className={`amenity-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                <span className="tab-count">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Horizontal line */}
        <div className="amenities-divider"></div>

        {/* Section title + included */}
        <div className="amenities-subheader">
          <h3>
            {activeTab === "property" &&
              "Property Amenities On-Site"}

            {activeTab === "room" &&
              "Room Amenities On-Site"}

            {activeTab === "services" &&
              "Hotel Services On-Site"}

            {activeTab === "all" &&
              "All Amenities On-Site"}
          </h3>

          <div className="included-label">
            <span className="included-symbol">
              <Check size={13} strokeWidth={3} />
            </span>
            included amenities
          </div>
        </div>

        {/* Amenities grid */}
        <div className="amenities-grid">
          {currentAmenities.map((amenity, index) => (
            <AmenityCard
              key={`${amenity.name}-${index}`}
              amenity={amenity}
            />
          ))}
        </div>

      </div>
    </section>
  );
}