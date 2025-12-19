import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Import here
import Home from './pages/Home';
import Categories from './pages/Categories';
import Sites from './pages/Sites';
import SiteDetails from "./pages/SiteDetails";
import Events from './pages/Events';
import EventDetails from "./pages/EventDetails";
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* ✅ Navbar at the top */}
        
        <main style={{ minHeight: "80vh", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/sites/:id" element={<SiteDetails />} />

            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <Footer /> {/* ✅ Footer at the bottom */}
      </div>
    </Router>
  );
}
