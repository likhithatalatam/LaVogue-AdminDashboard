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

  const [colorImages, setColorImages] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [variants, setVariants] = useState([
    {
      color: "",
      size: "",
      availability: "",
    },
  ]);

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
        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load categories, subcategories and brands.",
        );
      }
    };

    fetchData();
  }, []);

  const uniqueColors = [
    ...new Set(
      variants.map((variant) => variant.color.trim()).filter((color) => color),
    ),
  ];

  const removeColorImage = (color, index) => {
    setColorImages((prev) => ({
      ...prev,
      [color]: (prev[color] || []).filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    }));

    setErrorMessage("");
  };

  const handleColorImagesChange = (color, event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage(`Please select an image file for ${color}.`);
      event.target.value = "";
      return;
    }

    const currentImages = colorImages[color] || [];

    if (currentImages.length >= 5) {
      setErrorMessage(`Maximum 5 images allowed for ${color}.`);
      event.target.value = "";
      return;
    }

    setErrorMessage("");

    setColorImages((prev) => ({
      ...prev,
      [color]: [...(prev[color] || []), selectedFile],
    }));

    event.target.value = "";
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];

    updatedVariants[index][field] = value;

    setVariants(updatedVariants);

    if (field === "color") {
      const oldColor = variants[index].color.trim();
      const newColor = value.trim();

      if (oldColor && oldColor !== newColor) {
        setColorImages((prev) => {
          const updatedImages = { ...prev };

          if (updatedImages[oldColor]) {
            if (updatedImages[newColor]) {
              updatedImages[newColor] = [
                ...updatedImages[newColor],
                ...updatedImages[oldColor],
              ].slice(0, 5);
            } else {
              updatedImages[newColor] = updatedImages[oldColor];
            }

            delete updatedImages[oldColor];
          }

          return updatedImages;
        });
      }
    }
  };

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

  const removeVariant = (index) => {
    if (variants.length === 1) {
      return;
    }

    const colorToRemove = variants[index].color.trim();

    const remainingVariants = variants.filter(
      (_, variantIndex) => variantIndex !== index,
    );

    setVariants(remainingVariants);

    if (colorToRemove) {
      const colorStillExists = remainingVariants.some(
        (variant) => variant.color.trim() === colorToRemove,
      );

      if (!colorStillExists) {
        setColorImages((prev) => {
          const updatedImages = { ...prev };
          delete updatedImages[colorToRemove];
          return updatedImages;
        });
      }
    }
  };

  const isValidNumber = (value) => {
    return /^\d+(\.\d+)?$/.test(value.trim());
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedMrp = mrp.trim();
    const trimmedOfferPrice = offerprice.trim();
    const trimmedDiscount = discount.trim();

    const invalidVariant = variants.some(
      (variant) =>
        !variant.color.trim() ||
        !variant.size.trim() ||
        variant.availability === "" ||
        !/^\d+$/.test(String(variant.availability).trim()),
    );

    if (invalidVariant) {
      setErrorMessage(
        "Please enter valid color, size and availability for every product variant.",
      );
      return;
    }

    const duplicateVariants = new Set();

    for (const variant of variants) {
      const variantKey = `${variant.color.trim().toLowerCase()}-${variant.size.trim().toLowerCase()}`;

      if (duplicateVariants.has(variantKey)) {
        setErrorMessage(
          "Duplicate color and size combinations are not allowed.",
        );
        return;
      }

      duplicateVariants.add(variantKey);
    }

    if (!isValidNumber(trimmedMrp)) {
      setErrorMessage(
        "MRP must contain only numbers. Example: 1000 or 999.99.",
      );
      return;
    }

    const mrpNumber = Number(trimmedMrp);

    if (mrpNumber <= 0) {
      setErrorMessage("MRP must be greater than 0.");
      return;
    }

    if (trimmedOfferPrice && !isValidNumber(trimmedOfferPrice)) {
      setErrorMessage(
        "Offer Price must contain only numbers. Example: 900 or 899.99.",
      );
      return;
    }

    const offerPriceNumber = trimmedOfferPrice
      ? Number(trimmedOfferPrice)
      : null;

    if (offerPriceNumber !== null && offerPriceNumber <= 0) {
      setErrorMessage("Offer Price must be greater than 0.");
      return;
    }

    if (offerPriceNumber !== null && offerPriceNumber > mrpNumber) {
      setErrorMessage("Offer Price cannot be greater than MRP.");
      return;
    }

    if (trimmedDiscount && !isValidNumber(trimmedDiscount)) {
      setErrorMessage(
        "Discount must contain only numbers. Example: 10 or 15.5.",
      );
      return;
    }

    if (trimmedDiscount) {
      const discountNumber = Number(trimmedDiscount);

      if (discountNumber < 0 || discountNumber > 100) {
        setErrorMessage("Discount must be between 0 and 100.");
        return;
      }
    }

    for (const color of uniqueColors) {
      const imagesForColor = colorImages[color] || [];

      if (imagesForColor.length === 0) {
        setErrorMessage(`Please upload at least one image for ${color}.`);
        return;
      }

      if (imagesForColor.length > 5) {
        setErrorMessage(`Maximum 5 images are allowed for ${color}.`);
        return;
      }
    }

    try {
      const formData = new FormData();

      formData.append("productTitle", title.trim());
      formData.append("productDescription", description.trim());
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("brand", brand);

      formData.append("variants", JSON.stringify(variants));

      formData.append("discount", trimmedDiscount);
      formData.append("mrp", trimmedMrp);
      formData.append("offerPrice", trimmedOfferPrice);

      const colorImageMap = {};
      let imageIndex = 0;

      uniqueColors.forEach((color) => {
        colorImageMap[color] = [];

        const files = colorImages[color] || [];

        files.forEach((file) => {
          formData.append("productImages", file);
          colorImageMap[color].push(imageIndex);
          imageIndex++;
        });
      });

      formData.append("colorImageMap", JSON.stringify(colorImageMap));

      const res = await API.post("/products", formData);

      alert(res.data.message);

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

      setColorImages({});
      setErrorMessage("");
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to add product. Please try again.";

      setErrorMessage(backendMessage);

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
                  {errorMessage && (
                    <div
                      style={{
                        color: "red",
                        marginBottom: "15px",
                        fontSize: "14px",
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

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

                      <button type="button" onClick={addVariant}>
                        + Add Color / Size
                      </button>
                    </div>
                  </div>

                  <div className="element-row">
                    <div className="element-column">
                      <label>Discount</label>

                      <input
                        type="text"
                        name="discount"
                        value={discount}
                        onChange={(e) => setdiscount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="element-row">
                    <div className="element-column">
                      <label>Product Image</label>

                      {uniqueColors.length === 0 ? (
                        <p>Please enter a product color first.</p>
                      ) : (
                        uniqueColors.map((color) => (
                          <div key={color} style={{ marginBottom: "20px" }}>
                            <label>{color}</label>

                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleColorImagesChange(color, e)
                              }
                            />

                            {colorImages[color]?.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  flexWrap: "wrap",
                                  marginTop: "10px",
                                }}
                              >
                                {colorImages[color].map((file, index) => (
                                  <div
                                    key={index}
                                    style={{ position: "relative" }}
                                  >
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`${color} ${index + 1}`}
                                      style={{
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc",
                                      }}
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeColorImage(color, index)
                                      }
                                      style={{
                                        position: "absolute",
                                        top: "-6px",
                                        right: "-6px",
                                        width: "22px",
                                        height: "22px",
                                        borderRadius: "50%",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                      }}
                                    >
                                      ×
                                    </button>

                                    <p
                                      style={{
                                        margin: "4px 0",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Image {index + 1}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

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
