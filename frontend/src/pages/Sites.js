import React, { useEffect, useState } from "react";
import { fetchSites } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sites.css";

export default function Sites() {
  const [sites, setSites] = useState([]);
  // const [visibleReviews, setVisibleReviews] = useState({});
  const query = new URLSearchParams(useLocation().search);
  const category = query.get("category");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSites(category)
      .then((res) => setSites(res.data))
      .catch((err) => console.error("Error loading sites:", err));
  }, [category]);

  // const toggleReviews = (siteId) => {
  //   setVisibleReviews((prev) => ({ ...prev, [siteId]: !prev[siteId] }));
  // };

  const handleViewEvents = (siteId) => {
    navigate(`/events?site_id=${siteId}`);
  };

  const handleBackToCategories = () => {
    navigate("/categories");
  };

  const handleViewDetails = (siteId) => {
    navigate(`/sites/${siteId}`);
  };

  return (
    <div className="sites-container">
      <button className="back-btn" onClick={handleBackToCategories}>
        ⬅ Back to Categories
      </button>

      {sites.map((site) => {
        // ✅ Clean and deduplicate gallery URLs
        const previewImage = site.images
  ? `/images/${site.images}`
  : `https://source.unsplash.com/600x400/?${encodeURIComponent(site.site_name)}`;



        // ✅ First image for preview OR Unsplash fallback
      
        return (
          <div key={site.site_id} className="site-card">
            <h3>{site.site_name}</h3>

            {/* 🖼️ Main Preview Image */}
            <img
              src={previewImage}
              alt={site.site_name}
              className="site-img"
              onError={(e) =>
                (e.target.src = `https://source.unsplash.com/600x400/?${encodeURIComponent(
                  site.site_name
                )}`)
              }
            />

            <p className="desc">{site.description}</p>
            <p><b>📍 Location:</b> {site.city}, {site.state}</p>
            <p><b>🕒 Visiting Hours:</b> {site.visiting_hours || "N/A"}</p>
            <p><b>💰 Entry Fee:</b> {site.entry_fee || "Free"}</p>

            <div className="card-buttons">
              <button onClick={() => handleViewDetails(site.site_id)}>View Details</button>
              <button onClick={() => handleViewEvents(site.site_id)}>Upcoming Events</button>
              {/* <button onClick={() => toggleReviews(site.site_id)}>
                {visibleReviews[site.site_id] ? "Hide Reviews" : "View Reviews"}
              </button> */}

              {/* ✅ View Full Gallery Button */}
              {site.link_to_gallery && site.link_to_gallery.includes("drive.google.com/drive/folders") && (
                <a
                  href={site.link_to_gallery}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-btn"
                >
                  📂 View Full Gallery
                </a>
              )}
            </div>

            
          </div>
        );
      })}
    </div>
  );
}
