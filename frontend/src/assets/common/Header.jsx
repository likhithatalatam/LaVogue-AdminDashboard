import React, { useState, useEffect } from "react";
import "../css/global.css";
import { Link } from "react-router-dom";

function AdminHeader() {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdown(!dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setDropdown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header>
      <div className="main-container">
        {/* SIDEBAR */}
        <div className="side-header">
          <div className="logo">
            <img src="/images/Logo_png.png" alt="logo" />
          </div>

          <hr id="logo-hr" />

          <div className="List">
            <ul>
              {/* DASHBOARD */}
              <li id="dashboard">
                <Link to="/">
                  <i className="bi bi-house-door"></i>
                  Dashboard
                </Link>
              </li>

              {/* MASTERS */}
              <li className="dropdown">
                <button
                  onClick={toggleDropdown}
                  className="dropbtn"
                  id="master"
                >
                  <i className="bi bi-mask"></i>
                  Masters
                  <i className="bi bi-chevron-down"></i>
                </button>

                <div className={`dropdown-content ${dropdown ? "show" : ""}`}>
                  <Link to="/categories">Category</Link>

                  <Link to="/subcategories">Sub-Category</Link>

                  <Link to="/brands">Brand</Link>
                </div>
              </li>

              {/* HOME MANAGEMENT */}
              <li id="home-management">
                <Link to="/homemanagement">
                  <i className="bi bi-house-heart"></i>
                  Home Management
                </Link>
              </li>

              {/* PRODUCTS */}
              <li id="product">
                <Link to="/products">
                  <i className="bi bi-grid-fill"></i>
                  Products
                </Link>
              </li>

              {/* CUSTOMER */}
              <li id="customer">
                <Link to="/customers">
                  <i className="bi bi-people"></i>
                  Customer
                </Link>
              </li>

              {/* ORDERS */}
              <li id="orders">
                <Link to="/orders">
                  <i className="bi bi-cart"></i>
                  Orders
                </Link>
              </li>
              <li id="contact-messages">
                <Link to="/contactmessages">
                  <i className="bi bi-envelope"></i>
                  Contact Messages
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT SECTION (TOP HEADER) */}
        <div className="section">
          <div className="top-header">
            <Link to="/profile">
              <div className="user_icon">
                <img src="/images/6997668-removebg-preview.png" alt="user" />
              </div>

              <div className="top-header-user">
                <h5>Ms.Likhitha</h5>
                <h6>Admin</h6>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
