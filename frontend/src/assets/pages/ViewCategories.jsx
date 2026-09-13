import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import API, { getImageUrl } from "../../api";

function ViewCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      const res = await API.get("/categories");
      setCategories(res.data.data);
    };
    fetchdata();
  }, []);

  const handleDelete = async (id) => {
    const confirmdelete = window.confirm("Are you sure you want to delete");
    if (!confirmdelete) {
      return;
    }
    try {
      await API.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((p) => p._id !== id));
      alert("category deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete category");
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>
          <i className="bi bi-chevron-right"></i>
          <Link to="/addcategory">Add Categories</Link>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>View Categories</h5>
            </div>

            <div className="div-table">
              <table
                className="table table-striped display dataTable"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Category Name</th>
                    <th>Category Image</th>
                    <th>Created on</th>
                    <th>Updated on</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat._id}>
                      <td>{index + 1}</td>
                      <td>{cat.categoryName}</td>
                      <td>
                        <img
                          src={getImageUrl(cat.categoryImage)}
                          width="120"
                          height="80"
                          alt=""
                        />
                      </td>
                      <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(cat.updatedAt).toLocaleDateString()}</td>

                      <td>
                        <div className="action">
                          <div>
                            <i className="bi bi-pencil-square"></i>
                          </div>
                          <button
                            onClick={() => handleDelete(cat._id)}
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

export default ViewCategories;
