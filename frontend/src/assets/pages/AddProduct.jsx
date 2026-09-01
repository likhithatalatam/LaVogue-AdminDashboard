import React, { useState, useEffect } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import API from "../../api";

function AddProduct() {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [category, setcategory] = useState("");
  const [subcategory, setsubcategory] = useState("");
  const [brand, setbrand] = useState("");

  const [discount, setdiscount] = useState("");
  const [mrp, setmrp] = useState("");
  const [offerprice, setofferprice] = useState("");

  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // =====================================================
  // COLOR / SIZE / AVAILABILITY
  // =====================================================

  const [variants, setVariants] = useState([
    {
      color: "",
      size: "",
      availability: "",
    },
  ]);

  // =====================================================
  // FETCH CATEGORY / SUBCATEGORY / BRAND
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get("/categories");
        const subRes = await API.get("/subcategories");
        const brandRes = await API.get("/brands");

        setCategories(catRes.data.data);
        setSubcategories(subRes.data.data);
        setBrands(brandRes.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // =====================================================
  // HANDLE VARIANT CHANGE
  // =====================================================

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];

    updatedVariants[index][field] = value;

    setVariants(updatedVariants);
  };

  // =====================================================
  // ADD VARIANT
  // =====================================================

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        size: "",
        availability: "",
      },
    ]);
  };

  // =====================================================
  // REMOVE VARIANT
  // =====================================================

  const removeVariant = (index) => {
    if (variants.length === 1) {
      return;
    }

    const updatedVariants = variants.filter(
      (_, variantIndex) => variantIndex !== index,
    );

    setVariants(updatedVariants);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handlesubmit = async (e) => {
    e.preventDefault();

    // ===================================================
    // VALIDATE VARIANTS
    // ===================================================

    const invalidVariant = variants.some(
      (variant) =>
        !variant.color.trim() ||
        !variant.size.trim() ||
        variant.availability === "",
    );

    if (invalidVariant) {
      alert(
        "Please enter color, size and availability for every product variant.",
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append("productTitle", title);
      formData.append("productDescription", description);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("brand", brand);

      // =================================================
      // SEND VARIANTS
      // =================================================

      formData.append("variants", JSON.stringify(variants));

      formData.append("discount", discount);
      formData.append("mrp", mrp);
      formData.append("offerPrice", offerprice);

      // =================================================
      // IMAGES
      // =================================================

      for (let i = 0; i < images.length; i++) {
        formData.append("productImages", images[i]);
      }

      const res = await API.post("/products", formData);

      alert(res.data.message);

      // =================================================
      // RESET FORM
      // =================================================

      settitle("");
      setdescription("");
      setcategory("");
      setsubcategory("");
      setbrand("");

      setVariants([
        {
          color: "",
          size: "",
          availability: "",
        },
      ]);

      setdiscount("");
      setmrp("");
      setofferprice("");

      setImages([]);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>

          <i className="bi bi-chevron-right"></i>

          <Link to="/products">View Products</Link>
        </div>

        <div className="main-div">
          <div className="div">
            <div className="table-sec">
              <div className="head">
                <h5>View Products</h5>
              </div>

              <form onSubmit={handlesubmit}>
                <div className="elements-div">
                  {/* =====================================
                      TITLE
                  ===================================== */}

                  <div className="title">
                    <label>Title</label>
                    <br />

                    <input
                      type="text"
                      name="title"
                      value={title}
                      onChange={(e) => settitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* =====================================
                      DESCRIPTION
                  ===================================== */}

                  <div className="title">
                    <label>Product Description</label>

                    <input
                      type="text"
                      name="description"
                      value={description}
                      onChange={(e) => setdescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* =====================================
                      CATEGORY / SUBCATEGORY
                  ===================================== */}

                  <div className="element-row">
                    <div className="element-column">
                      <label>Category</label>

                      <select
                        value={category}
                        onChange={(e) => {
                          setcategory(e.target.value);
                          setsubcategory("");
                        }}
                        required
                      >
                        <option value="">Select Category</option>

                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="element-column">
                      <label>Sub-Category</label>

                      <select
                        value={subcategory}
                        onChange={(e) => setsubcategory(e.target.value)}
                        required
                      >
                        <option value="">Select Sub-Category</option>

                        {subcategories
                          .filter((sub) => sub.category?._id === category)
                          .map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {sub.subCategoryName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* =====================================
                      BRAND
                  ===================================== */}

                  <div className="element-row">
                    <div className="element-column">
                      <label>Product Brand</label>

                      <select
                        value={brand}
                        onChange={(e) => setbrand(e.target.value)}
                        required
                      >
                        <option value="">Select Brand</option>

                        {brands.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.brandName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* =====================================
                      PRODUCT VARIANTS
                  ===================================== */}

                  <div className="element-row">
                    <div className="element-column">
                      <label>Product Color / Size / Availability</label>

                      {variants.map((variant, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "10px",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* COLOR */}
                          <div className="varientchange">
                            <input
                              type="text"
                              placeholder="Color"
                              value={variant.color}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "color",
                                  e.target.value,
                                )
                              }
                              required
                            />

                            {/* SIZE */}

                            <input
                              type="text"
                              placeholder="Size"
                              value={variant.size}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "size",
                                  e.target.value,
                                )
                              }
                              required
                            />

                            {/* AVAILABILITY */}

                            <input
                              type="number"
                              min="0"
                              placeholder="Availability"
                              value={variant.availability}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "availability",
                                  e.target.value,
                                )
                              }
                              required
                            />
                          </div>

                          {/* REMOVE */}

                          {variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                            >
                              -
                            </button>
                          )}
                        </div>
                      ))}

                      {/* ADD VARIANT */}

                      <button type="button" onClick={addVariant}>
                        + Add Color / Size
                      </button>
                    </div>
                  </div>

                  {/* =====================================
                      DISCOUNT
                  ===================================== */}

                  <div className="element-row">
                    <div className="element-column">
                      <label>Discount</label>

                      <input
                        type="number"
                        name="discount"
                        value={discount}
                        onChange={(e) => setdiscount(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* =====================================
                      IMAGES
                  ===================================== */}

                  <div className="element-row">
                    <div className="element-column">
                      <label>Product Image</label>

                      <input
                        type="file"
                        multiple
                        onChange={(e) => setImages(e.target.files)}
                        required
                      />
                    </div>
                  </div>

                  {/* =====================================
                      MRP / OFFER PRICE
                  ===================================== */}

                  <div className="element-row">
                    <div className="element-column">
                      <label>MRP</label>

                      <input
                        type="text"
                        name="mrp"
                        value={mrp}
                        onChange={(e) => setmrp(e.target.value)}
                        required
                      />
                    </div>

                    <div className="element-column">
                      <label>Offer Price</label>

                      <input
                        type="text"
                        name="offer_price"
                        value={offerprice}
                        onChange={(e) => setofferprice(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* =====================================
                      SUBMIT
                  ===================================== */}

                  <div className="Submit-button">
                    <button type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AddProduct;
