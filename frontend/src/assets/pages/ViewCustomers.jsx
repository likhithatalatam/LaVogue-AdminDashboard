import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import API from "../../api";

function ViewCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/users");

      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      console.log("GET CUSTOMERS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load customers. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await API.delete(`/users/${id}`);

      if (res.data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

        alert("Customer deleted successfully");
      }
    } catch (error) {
      console.log("DELETE CUSTOMER ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete customer. Please try again.",
      );
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>
          <i className="bi bi-chevron-right"></i>
          <a href="#">Forms</a>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>View Customers</h5>
            </div>

            <div className="div-table">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Place</th>
                    <th>Created On</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        Loading customers...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>

                        <td>{user.userName || "-"}</td>

                        <td>{user.email || "-"}</td>

                        <td>{user.phone || "-"}</td>

                        <td>{user.location || "-"}</td>

                        <td>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          <div className="action">
                            <div>
                              <i className="bi bi-pencil-square"></i>
                            </div>

                            <button
                              className="delete_btn"
                              onClick={() => handleDelete(user._id)}
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ViewCustomers;
