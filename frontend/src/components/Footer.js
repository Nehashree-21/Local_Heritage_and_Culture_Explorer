// src/components/Footer.js
import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-brand">
          <h2>Local Culture Explorer</h2>
          <p>
            Discover, cherish, and celebrate the heritage that shapes your local identity.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/categories">Categories</a></li>
            <li><a href="/sites">Sites</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="footer-social">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Local Culture and Heritage Explorer. All rights reserved.</p>
      </div>
    </footer>
  );
}
