import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import API, { getImageUrl } from "../../api";

function EditBrand() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await API.get("/brands");

        const brand = res.data.data.find((item) => item._id === id);

        if (!brand) {
          alert("Brand not found");
          navigate("/brands");
          return;
        }

        setBrandName(brand.brandName || "");
        setCurrentImage(brand.brandImage || "");
      } catch (error) {
        console.log(error);
        alert("Failed to load brand");
      }
    };

    fetchBrand();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("brandName", brandName);

      if (brandImage) {
        formData.append("brandImage", brandImage);
      }

      const res = await API.put(`/brands/${id}`, formData);

      alert(res.data.message);

      navigate("/brands");
    } catch (error) {
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Failed to update brand");
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>
          <i className="bi bi-chevron-right"></i>
          <Link to="/brands">View Brands</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="main-div">
            <div className="div">
              <div className="table-sec">
                <div className="head">
                  <h5>Edit Brand</h5>
                </div>

                <div className="elements-div">
                  <div className="Sub_Category">
                    <label>Brand Name</label>

                    <input
                      type="text"
                      name="brandName"
                      placeholder="Brand Name"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                    />
                  </div>

                  <div className="Sub_Category_img">
                    <label>Brand image</label>

                    {currentImage && (
                      <div>
                        <img
                          src={getImageUrl(currentImage)}
                          width="120"
                          height="80"
                          alt=""
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      name="brandImage"
                      accept="image/*"
                      onChange={(e) => setBrandImage(e.target.files[0])}
                    />
                  </div>

                  <div className="Submit-button">
                    <button type="submit">Update</button>
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

export default EditBrand;
