import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSiteById, fetchReviewsBySiteId } from "../api/api";
import "./SiteDetails.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function SiteDetails() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    username: "",
    rating: "",
    review_comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // 🔥 Load site + reviews
  useEffect(() => {
    async function loadData() {
      try {
        const siteRes = await fetchSiteById(id);
        setSite(siteRes.data);

        const reviewRes = await fetchReviewsBySiteId(id);

        const filtered = Array.isArray(reviewRes)
          ? reviewRes.filter(
              (r) =>
                String(r.site_id) === String(id) ||
                String(r.site) === String(id) ||
                (r.site?.id && String(r.site.id) === String(id))
            )
          : [];

        setReviews(filtered);
      } catch (err) {
        console.error("Error loading site details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // ⭐ Add new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = {
      site_id: id,
      username: reviewForm.username,
      rating: reviewForm.rating,
      review_comment: reviewForm.review_comment,
    };

    try {
      // 1️⃣ Store in DB
      const newReview = await fetch(`${API_BASE}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json());

      // 2️⃣ Instantly show new review in UI
      const refreshedReviews = await fetchReviewsBySiteId(id);
setReviews(refreshedReviews);


      // 3️⃣ Clear form
      setReviewForm({ username: "", rating: "", review_comment: "" });
    } catch (err) {
      console.error("Error submitting review:", err);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="loading">Loading site details...</div>;
  if (!site) return <div>Site not found.</div>;

  const imageGallery = site.images
    ? [...new Set(site.images.split(",").map((i) => i.trim()).filter(Boolean))]
    : [];

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    site.city || site.site_name
  )}&output=embed`;

  return (
    <div className="site-details-container">
      <Link to="/sites" className="back-link">
        Back to Sites
      </Link>

      <div className="site-header">
        <h1>{site.site_name}</h1>
        <p>
          <b>📍 Location:</b> {site.city}, {site.state}
        </p>
      </div>

      {/* 🖼 Gallery */}
      <div className="site-gallery">
        {imageGallery.length > 0
          ? imageGallery.map((img, idx) => (
              <img key={idx} src={img} alt={`${site.site_name} ${idx}`} className="site-image" />
            ))
          : (
            <img
              src={`https://source.unsplash.com/600x400/?${encodeURIComponent(site.site_name)}`}
              alt={site.site_name}
              className="site-image"
            />
          )}
      </div>

      {/* 📂 Full Gallery Button */}
      {site.images?.includes("drive.google.com/drive/folders") && (
        <div className="gallery-link">
          <a href={site.images} target="_blank" rel="noopener noreferrer" className="gallery-btn">
            📂 Open Full Gallery
          </a>
        </div>
      )}

      <div className="site-description">{site.description}</div>

      {/* 📍 Map */}
      <div className="map-section">
        <h3>📍 Location Map</h3>
        <iframe title="site-map" src={mapUrl} allowFullScreen loading="lazy"></iframe>
      </div>

      {/* ⭐ Toggle Reviews */}
      <button className="toggle-review-btn" onClick={() => setShowReviews((prev) => !prev)}>
        {showReviews ? "Hide Reviews" : "View Reviews"}
      </button>

      {/* 💬 Reviews */}
      {showReviews && (
        <div className="reviews-section">
          <h3>💬 Visitor Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((r, i) => (
              <div key={i} className="review-card">
                <p><b>{r.username}</b></p>
                <p>⭐ {r.rating}</p>
                <p>{r.review_comment}</p>
                <small>
  {r.created_at
    ? r.created_at.split("T")[0]
    : ""}
</small>

              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet for this site.</p>
          )}
        </div>
      )}

      {/* 📝 Review Form */}
      {showReviews && (
        <div className="review-form-section">
          <h3>📝 Add Your Review</h3>
          <form onSubmit={handleReviewSubmit} className="review-form">
            <input
              type="text"
              placeholder="Your Name"
              value={reviewForm.username}
              required
              onChange={(e) => setReviewForm({ ...reviewForm, username: e.target.value })}
            />
            <select
              value={reviewForm.rating}
              required
              onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
            >
              <option value="">Select Rating ⭐</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
            <textarea
              placeholder="Write your review..."
              rows="4"
              value={reviewForm.review_comment}
              required
              onChange={(e) => setReviewForm({ ...reviewForm, review_comment: e.target.value })}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
