// src/api/api.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

// 🏛️ Sites
export const fetchSites = (category) => {
  if (category) {
    return axios.get(`${API_BASE}/sites/?category=${category}`);
  }
  return axios.get(`${API_BASE}/sites/`);
};

// ✅ Fetch single site by ID
export const fetchSiteById = (id) => axios.get(`${API_BASE}/sites/${id}/`);



// 🏷️ Categories
export const fetchCategories = () => axios.get(`${API_BASE}/categories/`);

// 🎉 Events
export const fetchEvents = (siteId = null) => {
  const url = siteId
    ? `${API_BASE}/events/?site_id=${siteId}`
    : `${API_BASE}/events/`;
  return axios.get(url);
};
export const fetchEventById = (id) => axios.get(`${API_BASE}/events/${id}/`);

export const fetchEventsNearby = async (latitude, longitude, radius = 25) => {
  try {
    const response = await axios.get(`${API_BASE}/events/nearby/`, {
      params: { lat: latitude, lng: longitude, radius },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching nearby events:", err);
    return [];
  }
};

export const fetchEventsNearbyByCity = async (location) => {
  try {
    const response = await axios.get(`${API_BASE}/events/by-location/`, {
      params: { location },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching events by city/state:", err);
    return [];
  }
};

// 💬 Reviews
// CREATE review
export const createReview = async (data, token) => {
  const response = await fetch(`${API_BASE}/reviews/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

// GET reviews
// export const fetchReviewsBySite = (siteId) =>
//   fetch(`${API_BASE}/reviews/?site_id=${siteId}`).then((r) => r.json());
export const fetchReviewsBySiteId = (siteId) =>
  fetch(`${API_BASE}/reviews/?site_id=${siteId}`)
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching reviews by site ID:", err);
      return [];
    });

export const fetchReviewsByEvent = (eventId) =>
  fetch(`${API_BASE}/reviews/?event_id=${eventId}`).then((r) => r.json());

// 👤 Auth


export async function loginUser(userData) {
  // 1️⃣ Login to get tokens
  const res = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const tokenData = await res.json();

  if (tokenData.access) {
    // 2️⃣ Fetch user details with token
    const userRes = await fetch(`${API_BASE}/user/`, {
      headers: {
        Authorization: `Bearer ${tokenData.access}`
      }
    });

    const user = await userRes.json();

    // 3️⃣ Merge token + user info
    return {
      ...user,
      ...tokenData
    };
  }

  return tokenData; // login failed
}

export async function registerUser(userData) {
  // 1️⃣ Register
  const res = await fetch(`${API_BASE}/register_user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  // 2️⃣ Automatically login after successful signup
  if (data.username) {
    return await loginUser({
      email: userData.email,
      password: userData.password
    });
  }

  return data;
}

export const logoutUser = () => localStorage.removeItem("user");
