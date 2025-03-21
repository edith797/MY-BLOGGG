import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, setUser, setCreatePostOpen }) => {
  const handleLogout = () => {
    setUser(null);
    // Additional logout logic, if needed
  };

  return (
    <nav>
      <div className="navbar">
        <div className="navbar-logo">Blogg</div>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          {user ? (
            <>
              <Link to="#" className="navbar-link" onClick={() => setCreatePostOpen(true)}>
                Create Post
              </Link>
              <a href="#logout" className="navbar-link" onClick={handleLogout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
