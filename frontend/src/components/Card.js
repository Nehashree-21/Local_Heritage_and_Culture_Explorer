import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

export default function Card({ image, title, description, link }) {
  return (
    <div className="card-container">
      <div className="card-image-wrapper">
        <img src={image} alt={title} className="card-image" />
        <div className="card-overlay">
          <h3 className="card-title">{title}</h3>
        </div>
      </div>

      <div className="card-content">
        <p className="card-description">{description}</p>
        <Link to={link} className="card-btn">
          Explore
        </Link>
      </div>
    </div>
  );
}
