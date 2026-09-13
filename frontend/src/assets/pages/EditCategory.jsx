import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import API, { getImageUrl } from "../../api";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get("/categories");

        const category = res.data.data.find((item) => item._id === id);

        if (!category) {
          alert("Category not found");
          navigate("/categories");
          return;
        }

        setCategoryName(category.categoryName || "");
        setCurrentImage(category.categoryImage || "");
      } catch (error) {
        console.log(error);
        alert("Failed to load category");
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("categoryName", categoryName);

      if (categoryImage) {
        formData.append("categoryImage", categoryImage);
      }

      const res = await API.put(`/categories/${id}`, formData);

      alert(res.data.message);

      navigate("/categories");
    } catch (error) {
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Failed to update category");
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

        <form onSubmit={handleSubmit}>
          <div className="main-div">
            <div className="div">
              <div className="table-sec">
                <div className="head">
                  <h5>Edit Categories</h5>
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
                      name="categoryimg"
                      onChange={(e) => setCategoryImage(e.target.files[0])}
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

export default EditCategory;
