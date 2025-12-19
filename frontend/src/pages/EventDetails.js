import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEventById} from "../api/api";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  // const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const eventRes = await fetchEventById(id);
        setEvent(eventRes.data);

        // const reviewRes = await fetchReviewsByEvent(id);
        // setReviews(reviewRes.data);
      } catch (err) {
        console.error("Error loading event details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="loading">Loading event details...</div>;
  if (!event) return <div className="empty">Event not found.</div>;

  // Generate Google Maps embed URL dynamically
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(event.venue)}&output=embed`;

  // Optional multiple image gallery (if API gives comma-separated URLs)
  const imageGallery = event.image_gallery
    ? event.image_gallery.split(",")
    : [event.image_url];

  return (
    <div className="event-details-container">
      {/* Back to events link */}
      <Link to="/events" className="back-link">Back to Events</Link>

      {/* Event header */}
      <div className="event-header">
        <h1>{event.event_name}</h1>
        <p><b>📍 Venue:</b> {event.venue}</p>
        <p><b>🗓️ Dates:</b> {event.start_date} - {event.end_date}</p>
      </div>

      {/* Image Gallery */}
      <div className="event-gallery">
        {imageGallery.map((img, index) => (
          <img key={index} src={img.trim()} alt={`${event.event_name} ${index + 1}`} className="event-image" />
        ))}
      </div>

      {/* Description */}
      <div className="event-description">{event.description}</div>

      {/* Live location map */}
      <div className="map-section">
        <h3>📍 Live Location</h3>
        <iframe
          title="event-map"
          src={mapUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Reviews section
      <div className="review-section">
        <h3>💬 Event Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet for this event.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.review_id} className="review">
              <strong>{review.user_name}</strong>
              <p>{review.comment}</p>
              <small>⭐ {review.rating}/5</small>
            </div>
          ))
        )}
      </div> */}
    </div>
  );
}
