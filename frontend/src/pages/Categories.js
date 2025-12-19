import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../api/api';
import { Link } from 'react-router-dom';
import './Categories.css';
import temple from "../images/temple.jpg";
import festival from "../images/festival.jpg";
import monument from "../images/monuments.jpg";
import museum from "../images/museum.jpg";
import fort from "../images/fort.jpg";
import park from "../images/park.jpg";
import beach from "../images/beach.jpg";
import wildlife_sanctuary from "../images/wildlife_sanctuary.jpg";
import heritage_site from "../images/heritage_sites.jpg";
import cave from "../images/cave.jpg";
// ✅ Google Drive image mapping
const categoryImages = {
  "Temple": temple,
  "Fort": fort,
  "Museum": museum,
  "Monument": monument,
  "Festival":festival,
  "Park":park,
  "Beach":beach,
  "Wildlife Sanctuary":wildlife_sanctuary,
  "Heritage Site":heritage_site,
  "Cave":cave
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(res => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  const getCategoryImage = (name) => {
  // Use drive link if available, otherwise fallback to Unsplash
  return categoryImages[name] || `https://source.unsplash.com/600x400/?${encodeURIComponent(name)}, India`;
};


  return (
    <div className="categories-container">
      <section className="all-sites-banner">
        <div className="banner-overlay">
          <h1 className="banner-title">Discover All Heritage Sites of India</h1>
          <p className="banner-subtitle">
            Explore ancient temples, forts, and cultural wonders from every corner of the country.
          </p>
          <Link to="/sites" className="banner-btn">
            Explore All Sites →
          </Link>
        </div>
      </section>

      <section className="category-section">
        <h2 className="section-title">Explore by Category</h2>
        {loading ? (
          <p className="loading-text">Loading categories...</p>
        ) : (
          <div className="category-grid">
            {categories.map(cat => (
              <div
                key={cat.category_id}
                className="category-card"
                style={{
                  backgroundImage: `url(${getCategoryImage(cat.category_name)})`,
                }}
              >
                <div className="overlay">
                  <h3>{cat.category_name}</h3>
                  <p>{cat.description}</p>
                  <Link to={`/sites?category=${cat.category_id}`} className="category-btn">
                    View Sites →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
