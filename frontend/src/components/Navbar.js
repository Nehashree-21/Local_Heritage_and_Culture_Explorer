// import React, { useEffect, useState } from "react";
// import "./Navbar.css";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const u = localStorage.getItem("user");
//     if (u) setUser(JSON.parse(u));
//   }, []);

//   function logout() {
//     localStorage.removeItem("user");
//     window.location.reload();
//   }

//   return (
//     <nav className="navbar">
//       <h1>Local Culture and Heritage Explorer</h1>

//       <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
//         <span></span><span></span><span></span>
//       </button>

//       <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
//         <li><a href="/categories">Categories</a></li>
//         <li><a href="/sites">Sites</a></li>
//         <li><a href="/events">Events</a></li>

//         {!user ? (
//           <>
//             <li><a href="/login">Login</a></li>
//             <li><a href="/signup">Signup</a></li>
//           </>
//         ) : (
//           <>
//             <li className="username">👋 Hello, {user.username}</li>
//             <li><button onClick={logout}>Logout</button></li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// }
import React, { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAccountBtn, setShowAccountBtn] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function logout() {
    localStorage.removeItem("user");
    setUser(null);

    // Hide Account temporarily
    setShowAccountBtn(false);
    setTimeout(() => setShowAccountBtn(true), 3000);

    window.location.href = "/";
  }

  return (
    <nav className="navbar">
      <h1>Local Culture & Heritage Explorer</h1>

      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><a href="/">Home</a></li>
        <li><a href="/categories">Categories</a></li>
        <li><a href="/sites">Sites</a></li>
        <li><a href="/events">Events</a></li>

        {!user ? (
          showAccountBtn && (
            <li className="dropdown">
              <button className="account-btn">Account ▾</button>
              <div className="dropdown-menu">
                <a href="/login">Login</a>
                <a href="/signup">Signup</a>
              </div>
            </li>
          )
        ) : (
          <>
            <li className="username">👋 Hello, {user.username}</li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}
