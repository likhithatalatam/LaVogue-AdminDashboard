import React from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../../api";

function AddBrand() {
  const [brandName, setbrandName] = useState("");
  const [brandImage, setbrandImage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("brandName", brandName);
      formData.append("brandImage", brandImage);

      const res = await API.post("/brands", formData);

      alert(res.data.message);
      setbrandName("");
      setbrandImage(null);
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
          <Link to="/brands">View Brand</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="main-div">
            <div className="div">
              <div className="table-sec">
                <div className="head">
                  <h5>Add Brand</h5>
                </div>

                <div className="elements-div">
                  <div className="Sub_Category">
                    <label>Brand Name</label>
                    <input
                      type="text"
                      name="brand_name"
                      value={brandName}
                      onChange={(e) => setbrandName(e.target.value)}
                    />
                  </div>

                  <div className="Sub_Category_img">
                    <label>Brand image</label>
                    <input
                      type="file"
                      name="brand_img"
                      onChange={(e) => setbrandImage(e.target.files[0])}
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

export default AddBrand;
