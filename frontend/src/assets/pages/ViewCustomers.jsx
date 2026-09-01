import React from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
function ViewCustomers() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      mobile: "9876543210",
      place: "Hyderabad",
      created: "2024-01-10",
    },
    {
      id: 2,
      name: "Likhitha",
      email: "likhitha@example.com",
      mobile: "9123456789",
      place: "Vijayawada",
      created: "2024-02-12",
    },
  ];

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
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.place}</td>
                      <td>{user.created}</td>

                      <td>
                        <div className="action">
                          <div>
                            <i className="bi bi-pencil-square"></i>
                          </div>

                          <button className="delete_btn">
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
