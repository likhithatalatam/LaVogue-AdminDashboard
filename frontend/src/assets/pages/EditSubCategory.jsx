import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import API, { getImageUrl } from "../../api";

function EditSubCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryImg, setSubCategoryImg] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subCategoryRes, categoryRes] = await Promise.all([
          API.get("/subcategories"),
          API.get("/categories"),
        ]);

        const subCategory = subCategoryRes.data.data.find(
          (item) => item._id === id,
        );

        if (!subCategory) {
          alert("SubCategory not found");
          navigate("/subcategories");
          return;
        }

        setSubCategoryName(subCategory.subCategoryName || "");
        setCurrentImage(subCategory.subCategoryImg || "");
        setCategory(subCategory.category?._id || subCategory.category || "");
        setCategories(categoryRes.data.data || []);
      } catch (error) {
        console.log(error);
        alert("Failed to load subcategory");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("subCategoryName", subCategoryName);
      formData.append("category", category);

      if (subCategoryImg) {
        formData.append("subCategoryImg", subCategoryImg);
      }

      const res = await API.put(`/subcategories/${id}`, formData);

      alert(res.data.message);

      navigate("/subcategories");
    } catch (error) {
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Failed to update subcategory");
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>
          <i className="bi bi-chevron-right"></i>
          <Link to="/subcategories">View Sub-Categories</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="main-div">
            <div className="div">
              <div className="table-sec">
                <div className="head">
                  <h5>Edit Sub-Categories</h5>
                </div>

                <div className="elements-div">
                  <div className="Categories">
                    <label>Category</label>
                    <br />

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>

                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="Sub_Category">
                    <label>Sub-Category</label>

                    <input
                      type="text"
                      name="subCategoryName"
                      placeholder="Sub-Category Name"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                    />
                  </div>

                  <div className="Sub_Category_img">
                    <label>Sub-Category image</label>

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
                      name="subCategoryImg"
                      accept="image/*"
                      onChange={(e) => setSubCategoryImg(e.target.files[0])}
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

export default EditSubCategory;
