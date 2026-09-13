import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import API, { getImageUrl } from "../../api";

function HomeManagement() {
  const [home, setHome] = useState({
    carouselImages: [],
    heroBanners: [],
    couponBanners: [],
    bestSellerLimit: 8,
    bestSellerActive: true,
  });

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FORM STATES
  // =====================================================

  const [carouselFile, setCarouselFile] = useState(null);
  const [carouselTitle, setCarouselTitle] = useState("");
  const [carouselDescription, setCarouselDescription] = useState("");
  const [carouselLink, setCarouselLink] = useState("");
  const [carouselOrder, setCarouselOrder] = useState(0);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [bannerButtonText, setBannerButtonText] = useState("");
  const [bannerButtonLink, setBannerButtonLink] = useState("");
  const [bannerOrder, setBannerOrder] = useState(0);

  const [couponFile, setCouponFile] = useState(null);
  const [couponTitle, setCouponTitle] = useState("");
  const [couponLink, setCouponLink] = useState("");
  const [couponOrder, setCouponOrder] = useState(0);

  const fetchHomeSettings = async () => {
    try {
      const res = await API.get("/home/settings");

      if (res.data.success) {
        setHome({
          carouselImages: res.data.data.carouselImages || [],
          heroBanners: res.data.data.heroBanners || [],
          couponBanners: res.data.data.couponBanners || [],
          bestSellerLimit: res.data.data.bestSellerLimit || 8,
          bestSellerActive: res.data.data.bestSellerActive ?? true,
        });
      }
    } catch (error) {
      console.log("HOME SETTINGS ERROR:", error);
      alert("Failed to load home settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeSettings();
  }, []);

  const handleAddCarousel = async (e) => {
    e.preventDefault();

    if (!carouselFile) {
      alert("Please select a carousel image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("carouselImage", carouselFile);
      formData.append("title", carouselTitle);
      formData.append("description", carouselDescription);
      formData.append("link", carouselLink);
      formData.append("order", carouselOrder);
      formData.append("isActive", "true");

      const res = await API.post("/home/carousel", formData);

      if (res.data.success) {
        alert("Carousel slide added successfully");

        setCarouselFile(null);
        setCarouselTitle("");
        setCarouselDescription("");
        setCarouselLink("");
        setCarouselOrder(0);

        e.target.reset();

        fetchHomeSettings();
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add carousel slide");
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();

    if (!bannerFile) {
      alert("Please select a banner image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("bannerImage", bannerFile);
      formData.append("title", bannerTitle);
      formData.append("description", bannerDescription);
      formData.append("buttonText", bannerButtonText);
      formData.append("buttonLink", bannerButtonLink);
      formData.append("order", bannerOrder);
      formData.append("isActive", "true");

      const res = await API.post("/home/banners", formData);

      if (res.data.success) {
        alert("Main banner added successfully");

        setBannerFile(null);
        setBannerTitle("");
        setBannerDescription("");
        setBannerButtonText("");
        setBannerButtonLink("");
        setBannerOrder(0);

        e.target.reset();

        fetchHomeSettings();
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add main banner");
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();

    if (!couponFile) {
      alert("Please select a coupon image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("couponImage", couponFile);
      formData.append("title", couponTitle);
      formData.append("link", couponLink);
      formData.append("order", couponOrder);
      formData.append("isActive", "true");

      const res = await API.post("/home/coupons", formData);

      if (res.data.success) {
        alert("Coupon banner added successfully");

        setCouponFile(null);
        setCouponTitle("");
        setCouponLink("");
        setCouponOrder(0);

        e.target.reset();

        fetchHomeSettings();
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add coupon banner");
    }
  };

  const handleBestSellerUpdate = async () => {
    try {
      const res = await API.put("/home/bestsellers", {
        bestSellerLimit: Number(home.bestSellerLimit),
        bestSellerActive: home.bestSellerActive,
      });

      if (res.data.success) {
        alert("Best seller settings updated successfully");

        setHome((prev) => ({
          ...prev,
          bestSellerLimit: res.data.data.bestSellerLimit,
          bestSellerActive: res.data.data.bestSellerActive,
        }));
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to update best seller settings",
      );
    }
  };

  const toggleCarousel = async (item) => {
    try {
      await API.put(`/home/carousel/${item._id}/status`, {
        isActive: !item.isActive,
      });

      fetchHomeSettings();
    } catch (error) {
      console.log(error);
      alert("Failed to update carousel status");
    }
  };

  const toggleBanner = async (item) => {
    try {
      await API.put(`/home/banners/${item._id}/status`, {
        isActive: !item.isActive,
      });

      fetchHomeSettings();
    } catch (error) {
      console.log(error);
      alert("Failed to update banner status");
    }
  };

  const toggleCoupon = async (item) => {
    try {
      await API.put(`/home/coupons/${item._id}/status`, {
        isActive: !item.isActive,
      });

      fetchHomeSettings();
    } catch (error) {
      console.log(error);
      alert("Failed to update coupon status");
    }
  };

  const deleteCarousel = async (id) => {
    if (!window.confirm("Delete this carousel slide?")) return;

    try {
      await API.delete(`/home/carousel/${id}`);

      alert("Carousel slide deleted");

      fetchHomeSettings();
    } catch (error) {
      console.log(error);
      alert("Failed to delete carousel slide");
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this main banner?")) return;

    try {
      await API.delete(`/home/banners/${id}`);

      alert("Main banner deleted");

      fetchHomeSettings();
    } catch (error) {
      console.log(error);
      alert("Failed to delete banner");
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon banner?")) return;

    try {
      await API.delete(`/home/coupons/${id}`);

      alert("Coupon banner deleted");

      fetchHomeSettings();
    } catch (error) {
      console.log(error);
      alert("Failed to delete coupon");
    }
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
  };

  const sectionHeaderStyle = {
    padding: "18px 22px",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const formStyle = {
    padding: "22px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    outline: "none",
  };

  const primaryButtonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "7px",
    background: "#a07adc",
    color: "#fff",
    cursor: "pointer",
  };

  const statusButtonStyle = (active) => ({
    padding: "6px 12px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    background: active ? "#e8f7ee" : "#f5f5f5",
    color: active ? "#198754" : "#777",
    fontSize: "12px",
  });

  if (loading) {
    return (
      <>
        <AdminHeader />

        <div
          className="home-section"
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading Home Management...
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>

          <i className="bi bi-chevron-right"></i>

          <span>Home Management</span>
        </div>

        <div
          style={{
            marginBottom: "25px",
            padding: "5px 2px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "24px",
              color: "#333",
            }}
          >
            Home Page Management
          </h3>

          <p
            style={{
              marginTop: "6px",
              color: "#777",
              fontSize: "14px",
            }}
          >
            Manage your homepage slides, promotional banners, coupons and best
            sellers.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h5 style={{ margin: 0 }}>
                <i className="bi bi-images"></i> Top Carousel / Slider
              </h5>

              <small style={{ color: "#888" }}>
                Add multiple images that appear in the top slider.
              </small>
            </div>

            <span
              style={{
                background: "#f0ebff",
                color: "#8b63d2",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              {home.carouselImages.length} Slides
            </span>
          </div>

          {/* ADD SLIDE */}

          <div style={formStyle}>
            <form onSubmit={handleAddCarousel}>
              <div style={gridStyle}>
                <div style={fieldStyle}>
                  <label>Slide Image *</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCarouselFile(e.target.files[0])}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Title</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Slide title"
                    value={carouselTitle}
                    onChange={(e) => setCarouselTitle(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Description</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Short description"
                    value={carouselDescription}
                    onChange={(e) => setCarouselDescription(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Link</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="/products"
                    value={carouselLink}
                    onChange={(e) => setCarouselLink(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Display Order</label>

                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    value={carouselOrder}
                    onChange={(e) => setCarouselOrder(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" style={primaryButtonStyle}>
                <i className="bi bi-plus-lg"></i> Add Slide
              </button>
            </form>
          </div>

          {home.carouselImages.length > 0 && (
            <div
              style={{
                padding: "0 22px 22px",
                overflowX: "auto",
              }}
            >
              <h6
                style={{
                  marginBottom: "15px",
                  color: "#555",
                }}
              >
                Existing Slides
              </h6>

              <table
                className="table table-striped"
                style={{
                  width: "100%",
                  verticalAlign: "middle",
                }}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Preview</th>
                    <th>Title</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {home.carouselImages
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>

                        <td>
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title || "Slide"}
                            style={{
                              width: "140px",
                              height: "65px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        </td>

                        <td>{item.title || "Untitled Slide"}</td>

                        <td>{item.order}</td>

                        <td>
                          <button
                            onClick={() => toggleCarousel(item)}
                            style={statusButtonStyle(item.isActive)}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td>
                          <button
                            className="delete_btn"
                            onClick={() => deleteCarousel(item._id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h5 style={{ margin: 0 }}>
                <i className="bi bi-megaphone"></i> Main Promotional Banner
              </h5>

              <small style={{ color: "#888" }}>
                Manage the large banner displayed below the carousel.
              </small>
            </div>

            <span
              style={{
                background: "#f0ebff",
                color: "#8b63d2",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              {home.heroBanners.length} Banners
            </span>
          </div>

          <div style={formStyle}>
            <form onSubmit={handleAddBanner}>
              <div style={gridStyle}>
                <div style={fieldStyle}>
                  <label>Banner Image *</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBannerFile(e.target.files[0])}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Title</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Banner title"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Description</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Banner description"
                    value={bannerDescription}
                    onChange={(e) => setBannerDescription(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Button Text</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Shop Now"
                    value={bannerButtonText}
                    onChange={(e) => setBannerButtonText(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Button Link</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="/products"
                    value={bannerButtonLink}
                    onChange={(e) => setBannerButtonLink(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Display Order</label>

                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    value={bannerOrder}
                    onChange={(e) => setBannerOrder(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" style={primaryButtonStyle}>
                <i className="bi bi-plus-lg"></i> Add Banner
              </button>
            </form>
          </div>

          {home.heroBanners.length > 0 && (
            <div
              style={{
                padding: "0 22px 22px",
                overflowX: "auto",
              }}
            >
              <h6
                style={{
                  marginBottom: "15px",
                  color: "#555",
                }}
              >
                Existing Banners
              </h6>

              <table className="table table-striped" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Preview</th>
                    <th>Title</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {home.heroBanners
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>

                        <td>
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title || "Banner"}
                            style={{
                              width: "180px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        </td>

                        <td>{item.title || "Untitled Banner"}</td>

                        <td>{item.order}</td>

                        <td>
                          <button
                            onClick={() => toggleBanner(item)}
                            style={statusButtonStyle(item.isActive)}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td>
                          <button
                            className="delete_btn"
                            onClick={() => deleteBanner(item._id)}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h5 style={{ margin: 0 }}>
                <i className="bi bi-ticket-perforated"></i> Coupon Banners
              </h5>

              <small style={{ color: "#888" }}>
                Manage the three promotional coupon images displayed on the
                homepage.
              </small>
            </div>

            <span
              style={{
                background: "#f0ebff",
                color: "#8b63d2",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
              }}
            >
              {home.couponBanners.length} Coupons
            </span>
          </div>

          <div style={formStyle}>
            <form onSubmit={handleAddCoupon}>
              <div style={gridStyle}>
                <div style={fieldStyle}>
                  <label>Coupon Image *</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCouponFile(e.target.files[0])}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Title</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Coupon title"
                    value={couponTitle}
                    onChange={(e) => setCouponTitle(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Link</label>

                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="/products"
                    value={couponLink}
                    onChange={(e) => setCouponLink(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label>Display Order</label>

                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    value={couponOrder}
                    onChange={(e) => setCouponOrder(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" style={primaryButtonStyle}>
                <i className="bi bi-plus-lg"></i> Add Coupon
              </button>
            </form>
          </div>

          {home.couponBanners.length > 0 && (
            <div
              style={{
                padding: "0 22px 22px",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              {home.couponBanners
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <div
                    key={item._id}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "#fafafa",
                    }}
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title || "Coupon"}
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    <div
                      style={{
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <strong>{item.title || `Coupon ${index + 1}`}</strong>

                        <button
                          className="delete_btn"
                          onClick={() => deleteCoupon(item._id)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <small>Order: {item.order}</small>

                        <button
                          onClick={() => toggleCoupon(item)}
                          style={statusButtonStyle(item.isActive)}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h5 style={{ margin: 0 }}>
                <i className="bi bi-star"></i> Best Sellers
              </h5>

              <small style={{ color: "#888" }}>
                Control how many best-selling products appear on the homepage.
              </small>
            </div>
          </div>

          <div
            style={{
              padding: "22px",
              display: "flex",
              alignItems: "end",
              gap: "25px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ width: "220px" }}>
              <label>Number of Products</label>

              <input
                style={{
                  ...inputStyle,
                  marginTop: "7px",
                }}
                type="number"
                min="1"
                max="50"
                value={home.bestSellerLimit}
                onChange={(e) =>
                  setHome({
                    ...home,
                    bestSellerLimit: e.target.value,
                  })
                }
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={home.bestSellerActive}
                onChange={(e) =>
                  setHome({
                    ...home,
                    bestSellerActive: e.target.checked,
                  })
                }
              />
              Show Best Sellers
            </label>

            <button
              onClick={handleBestSellerUpdate}
              style={{
                ...primaryButtonStyle,
                marginTop: 0,
              }}
            >
              <i className="bi bi-check-lg"></i> Save Settings
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default HomeManagement;
