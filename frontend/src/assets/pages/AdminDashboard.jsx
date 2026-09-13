import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import API from "../../api";

function AdminDashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    users: 0,
    categories: 0,
  });

  const fetchDashboardCounts = async () => {
    try {
      const res = await API.get("/admin/dashboard-counts");

      if (res.data.success) {
        setCounts(res.data.data);
      }
    } catch (error) {
      console.log("GET DASHBOARD COUNTS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="cards">
          <div className="card1">
            <div>
              <h2>{counts.products}</h2>
              <p>Products</p>
            </div>
            <i className="bi bi-grid-fill"></i>
          </div>

          <div className="card2">
            <div>
              <h2>{counts.orders}</h2>
              <p>Orders</p>
            </div>
            <i className="bi bi-cart"></i>
          </div>

          <div className="card3">
            <div>
              <h2>{counts.users}</h2>
              <p>Users</p>
            </div>
            <i className="bi bi-people"></i>
          </div>

          <div className="card4">
            <div>
              <h2>{counts.categories}</h2>
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
