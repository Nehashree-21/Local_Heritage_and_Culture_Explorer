import React from "react";
import Card from "../components/Card";
import "./Home.css";
import temple from "../images/temple.jpg";
import festival from "../images/festival.jpg";
import monument from "../images/monuments.jpg";

export default function Home() {
  const featuredItems = [
    {
      title: "Ancient Temples",
      description: "Witness India's spiritual essence through its centuries-old temple architecture.",
      image: temple,
      link: "/sites?category_name=temple",
    },
    {
      title: "Colorful Festivals",
      description: "Celebrate the rhythm of India’s vibrant traditions and joyful festivals.",
      image: festival,
      link: "/sites?category_name=festival",
    },
    {
      title: "Historic Monuments",
      description: "Explore the glorious monuments that narrate India’s timeless history.",
      image: monument,
      link: "/sites?category=category_id",
    },
    {
      title: "Traditional Arts",
      description: "Discover India’s heritage through intricate art, music, and dance forms.",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Bharatanatyam_dancer.jpg",
      link: "/sites?category=category_id",
    },
  ];

  return (
    <div className="home-container">
      {/* 🌅 Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Discover India’s Cultural Heritage</h1>
          <p>
            Travel through traditions, festivals, monuments, and art forms that define the spirit of India.
          </p>
          <a href="/categories" className="hero-btn">
            Explore Now
          </a>
        </div>
      </section>

      {/* 🧭 Featured Section */}
      <section className="featured-section">
        <h2>Explore by Theme</h2>
        <div className="card-grid">
          {featuredItems.map((item, index) => (
            <Card
              key={index}
              image={item.image}
              title={item.title}
              description={item.description}
              link={item.link}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
