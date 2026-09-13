import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import API, { getImageUrl } from "../../api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [category, setcategory] = useState("");
  const [subcategory, setsubcategory] = useState("");
  const [brand, setbrand] = useState("");

  const [discount, setdiscount] = useState("");
  const [mrp, setmrp] = useState("");
  const [offerprice, setofferprice] = useState("");

  const [colorImages, setColorImages] = useState({});
  const [existingColorImages, setExistingColorImages] = useState({});
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
        const [catRes, subRes, brandRes, productRes] = await Promise.all([
          API.get("/categories"),
          API.get("/subcategories"),
          API.get("/brands"),
          API.get(`/products/${id}`),
        ]);

        setCategories(catRes.data.data);
        setSubcategories(subRes.data.data);
        setBrands(brandRes.data.data);

        const product = productRes.data.data;

        settitle(product.productTitle || "");
        setdescription(product.productDescription || "");
        setcategory(product.category?._id || product.category || "");
        setsubcategory(product.subCategory?._id || product.subCategory || "");
        setbrand(product.brand?._id || product.brand || "");

        setdiscount(
          product.discount !== undefined && product.discount !== null
            ? String(product.discount)
            : "",
        );

        setmrp(
          product.mrp !== undefined && product.mrp !== null
            ? String(product.mrp)
            : "",
        );

        setofferprice(
          product.offerPrice !== undefined && product.offerPrice !== null
            ? String(product.offerPrice)
            : "",
        );

        setVariants(
          product.variants?.length > 0
            ? product.variants.map((variant) => ({
                color: variant.color || "",
                size: variant.size || "",
                availability:
                  variant.availability !== undefined
                    ? String(variant.availability)
                    : "",
              }))
            : [
                {
                  color: "",
                  size: "",
                  availability: "",
                },
              ],
        );

        const existingImages = {};

        if (product.colorImages?.length > 0) {
          product.colorImages.forEach((colorItem) => {
            existingImages[colorItem.color] = colorItem.images || [];
          });
        } else if (product.images?.length > 0) {
          const firstColor = product.variants?.[0]?.color;

          if (firstColor) {
            existingImages[firstColor] = product.images;
          }
        }

        setExistingColorImages(existingImages);
      } catch (error) {
        console.log(error);
        setErrorMessage(
          error.response?.data?.message || "Unable to load product details.",
        );
      }
    };

    fetchData();
  }, [id]);

  const uniqueColors = [
    ...new Set(
      variants.map((variant) => variant.color.trim()).filter((color) => color),
    ),
  ];

  const removeExistingImage = (color, index) => {
    setExistingColorImages((prev) => ({
      ...prev,
      [color]: (prev[color] || []).filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    }));

    setErrorMessage("");
  };

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

    const existingCount = (existingColorImages[color] || []).length;
    const newCount = (colorImages[color] || []).length;

    if (existingCount + newCount >= 5) {
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
        setExistingColorImages((prev) => {
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
        setExistingColorImages((prev) => {
          const updatedImages = { ...prev };
          delete updatedImages[colorToRemove];
          return updatedImages;
        });

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

  const handleSubmit = async (e) => {
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
      const variantKey = `${variant.color.trim().toLowerCase()}-${variant.size
        .trim()
        .toLowerCase()}`;

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

      if (discountNumber < 0 || discountNumber > 90) {
        setErrorMessage("Discount must be between 0 and 90.");
        return;
      }
    }

    for (const color of uniqueColors) {
      const existingCount = (existingColorImages[color] || []).length;
      const newCount = (colorImages[color] || []).length;

      if (existingCount + newCount === 0) {
        setErrorMessage(`Please add at least one image for ${color}.`);
        return;
      }

      if (existingCount + newCount > 5) {
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

        const newFiles = colorImages[color] || [];

        newFiles.forEach((file) => {
          formData.append("productImages", file);
          colorImageMap[color].push(imageIndex);
          imageIndex++;
        });
      });

      formData.append("colorImageMap", JSON.stringify(colorImageMap));

      const keptExistingColorImages = {};

      uniqueColors.forEach((color) => {
        keptExistingColorImages[color] = existingColorImages[color] || [];
      });

      formData.append(
        "existingColorImages",
        JSON.stringify(keptExistingColorImages),
      );

      const res = await API.put(`/products/${id}`, formData);

      alert(res.data.message);

      navigate("/products");
    } catch (error) {
      console.log(error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to update product. Please try again.",
      );
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
                <h5>Edit Product</h5>
              </div>

              <form onSubmit={handleSubmit}>
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
                      <label>Product Image</label>

                      {uniqueColors.length === 0 ? (
                        <p>Please enter a product color first.</p>
                      ) : (
                        uniqueColors.map((color) => (
                          <div key={color} style={{ marginBottom: "20px" }}>
                            <label>{color}</label>

                            {existingColorImages[color]?.map((image, index) => (
                              <div
                                key={`existing-${image}-${index}`}
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  marginRight: "10px",
                                  verticalAlign: "top",
                                }}
                              >
                                <img
                                  src={getImageUrl(image)}
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
                                    removeExistingImage(color, index)
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
                                  Existing {index + 1}
                                </p>
                              </div>
                            ))}

                            {colorImages[color]?.map((file, index) => (
                              <div
                                key={`new-${index}`}
                                style={{
                                  display: "inline-block",
                                  position: "relative",
                                  marginRight: "10px",
                                  verticalAlign: "top",
                                }}
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
                                  onClick={() => removeColorImage(color, index)}
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
                                  New {index + 1}
                                </p>
                              </div>
                            ))}

                            <div style={{ marginTop: "10px" }}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleColorImagesChange(color, e)
                                }
                              />
                            </div>
                          </div>
                        ))
                      )}
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
                    <button type="submit">Update</button>
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

export default EditProduct;
