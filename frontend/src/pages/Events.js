import React, { useEffect, useState } from "react";
import { fetchEvents } from "../api/api";
import "./Events.css";
import { Link, useLocation } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const query = new URLSearchParams(useLocation().search);
  const siteId = query.get("site_id");

  useEffect(() => {
    setLoading(true);
    fetchEvents(siteId) // ✅ Fetch events filtered by site if siteId is present
      .then((res) => {
        setEvents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading events:", err);
        setLoading(false);
      });
  }, [siteId]);

  if (loading) return <div className="loading">Loading events...</div>;
  if (events.length === 0)
    return (
      <div className="empty">
        No {siteId ? "upcoming events for this site" : "events available"} right
        now.
      </div>
    );

  return (
    <div className="events-container">
      <h1 className="events-title">
        {siteId ? "🎉 Upcoming Events for this Site" : "🎭 Upcoming Cultural Events"}
      </h1>

      {siteId && (
        <Link to="/sites" className="back-link">
          Back to Sites
        </Link>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <div
            key={event.event_id}
            className="event-card"
            onClick={() => setSelectedEvent(event)}
          >
            <h2>{event.event_name}</h2>
            <p>
              <b>📍</b> {event.venue}
            </p>
            <p>
              <b>🗓️</b> {event.start_date} - {event.end_date}
            </p>
            <p className="desc">
              {event.description.length > 100
                ? event.description.slice(0, 100) + "..."
                : event.description}
            </p>
            <button className="details-btn">View Details</button>
          </div>
        ))}
      </div>

      {/* 🪟 Modal for Event Details */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close-btn" onClick={() => setSelectedEvent(null)}>
              &times;
            </span>
            <h2>{selectedEvent.event_name}</h2>
            <p>
              <b>📍 Venue:</b> {selectedEvent.venue}
            </p>
            <p>
              <b>🗓️ Dates:</b> {selectedEvent.start_date} - {selectedEvent.end_date}
            </p>
            <p className="desc-full">{selectedEvent.description}</p>

            <Link
              to={`/events/${selectedEvent.event_id}`}
              className="view-btn"
            >
              View Full Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
