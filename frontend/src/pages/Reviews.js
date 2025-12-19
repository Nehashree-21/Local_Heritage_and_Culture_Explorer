import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Reviews({ siteId = null, eventId = null }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [username, setUsername] = useState("");

  // ✅ Fetch reviews for the specific site or event
  useEffect(() => {
    let url = "http://127.0.0.1:8000/api/reviews/";

    if (siteId) url += `?site_id=${siteId}`;
    else if (eventId) url += `?event_id=${eventId}`;

    axios
      .get(url)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [siteId, eventId]);

  // ✅ Handle new review submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newReview.trim()) return;

    axios
      .post("http://127.0.0.1:8000/api/reviews/add/", {
        review_comment: newReview,
        username: username || "Anonymous",
        site: siteId,
        event: eventId,
      })
      .then(() => {
        setNewReview("");
        setUsername("");
        // reload reviews after submitting
        let url = "http://127.0.0.1:8000/api/reviews/";
        if (siteId) url += `?site_id=${siteId}`;
        else if (eventId) url += `?event_id=${eventId}`;
        return axios.get(url);
      })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error posting review:", err));
  };

  return (
    <div className="reviews-section">
      <h3>User Reviews</h3>

      {reviews.length > 0 ? (
        reviews.map((r, index) => (
          <div key={index} className="review-item">
            <strong>{r.username || "Anonymous"}</strong>
            <p>{r.review_comment}</p>
            <small>{new Date(r.created_at).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}

      <form onSubmit={handleSubmit} className="review-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name (optional)"
        />
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review..."
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}
