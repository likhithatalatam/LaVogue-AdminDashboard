import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import API from "../../api";
function ViewBrand() {
  const [brands, setbrands] = useState([]);

  useEffect(() => {
    const fetchbrands = async () => {
      const res = await API.get("/brands");
      setbrands(res.data.data);
    };
    fetchbrands();
  }, []);

  const handleDelete = async (id) => {
    const confirmdelete = window.confirm("Are you sure you want to delete");
    if (!confirmdelete) {
      return;
    }
    try {
      await API.delete(`/brands/${id}`);
      setbrands((prev) => prev.filter((p) => p._id !== id));
      alert("Brand deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete brand");
    }
  };
  return (
    <>
      <AdminHeader />
      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>
          <i className="bi bi-chevron-right"></i>
          <Link to="/addbrand">Add Brands</Link>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>View Brands</h5>
            </div>

            <div className="div-table">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Brand Name</th>
                    <th>Brand Image</th>
                    <th>Created On</th>
                    <th>Updated On</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {brands.map((brand, index) => (
                    <tr key={brand._id}>
                      <td>{index + 1}</td>
                      <td>{brand.brandName}</td>
                      <td>
                        <img
                          src={`http://localhost:5000/uploads/${brand.brandImage}`}
                          width="120"
                          height="80"
                          alt=""
                        />
                      </td>
                      <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(brand.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action">
                          <div>
                            <i className="bi bi-pencil-square"></i>
                          </div>

                          <button
                            onClick={() => handleDelete(brand._id)}
                            className="delete_btn"
                          >
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

export default ViewBrand;
