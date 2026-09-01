import React, { useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import API from "../../api";

function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("categoryName", categoryName);
      formData.append("categoryImage", categoryImage);

      const res = await API.post("/categories", formData);

      alert(res.data.message);

      setCategoryName("");
      setCategoryImage(null);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>
          <i className="bi bi-chevron-right"></i>
          <Link to="/categories">View Categories</Link>
        </div>

        <form onSubmit={handlesubmit}>
          <div className="main-div">
            <div className="div">
              <div className="table-sec">
                <div className="head">
                  <h5>Add Categories</h5>
                </div>

                <div className="elements-div">
                  <div className="Sub_Category">
                    <label>Category Name</label>
                    <input
                      type="text"
                      name="categoryname"
                      placeholder="Category Name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>

                  <div className="Sub_Category_img">
                    <label>Category image</label>
                    <input
                      type="file"
                      name="categoryimg"
                      onChange={(e) => setCategoryImage(e.target.files[0])}
                    />
                  </div>

                  <div className="Submit-button">
                    <button type="submit">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default AddCategory;
