import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import API from "../../api";

function AddSubCategory() {
  const [subCategoryName, setsubCategoryName] = useState("");
  const [subCategoryImg, setsubCategoryImage] = useState(null);
  const [category, setcategoryID] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchcategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchcategories();
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!subCategoryName || !subCategoryImg || !category) {
      alert("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subCategoryName", subCategoryName);
      formData.append("subCategoryImg", subCategoryImg);
      formData.append("category", category);

      const res = await API.post("/subcategories", formData);
      alert(res.data.message);
      setcategoryID("");
      setsubCategoryName("");
      setsubCategoryImage(null);
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
          <Link to="/subcategories">View Sub-Categories</Link>
        </div>

        <form onSubmit={handlesubmit}>
          <div className="main-div">
            <div className="div">
              <div className="table-sec">
                <div className="head">
                  <h5>Add Sub-Categories</h5>
                </div>

                <div className="elements-div">
                  <div className="Categories">
                    <label>Category</label>
                    <br />
                    <select
                      value={category}
                      onChange={(e) => setcategoryID(e.target.value)}
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
                      name="sub_category_name"
                      value={subCategoryName}
                      onChange={(e) => setsubCategoryName(e.target.value)}
                    />
                  </div>

                  <div className="Sub_Category_img">
                    <label>Sub-Category image</label>
                    <input
                      type="file"
                      name="sub_category_img"
                      onChange={(e) => setsubCategoryImage(e.target.files[0])}
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

export default AddSubCategory;
