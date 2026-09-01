import React from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
function AdminDashboard() {
  return (
    <>
      <AdminHeader />
      <div className="home-section">
        <div className="cards">
          <div className="card1">
            <div>
              <h2>50</h2>
              <p>Products</p>
            </div>
            <i className="bi bi-grid-fill"></i>
          </div>

          <div className="card2">
            <div>
              <h2>15</h2>
              <p>Orders</p>
            </div>
            <i className="bi bi-cart"></i>
          </div>

          <div className="card3">
            <div>
              <h2>50</h2>
              <p>Users</p>
            </div>
            <i className="bi bi-people"></i>
          </div>

          <div className="card4">
            <div>
              <h2>5</h2>
              <p>Categories</p>
            </div>
            <i className="bi bi-grid-fill"></i>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
