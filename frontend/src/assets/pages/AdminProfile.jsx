import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import API from "../../api";

function AdminProfile() {
  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    designation: "Admin",
    phone: "",
    location: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getImageUrl = (image) => {
    if (!image) {
      return "/images/6997668-removebg-preview.png";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000/uploads/${image.replace(
      /^\/?uploads\//,
      "",
    )}`;
  };

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        return;
      }

      const res = await API.get("/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setProfile({
          userName: res.data.data.userName || "",
          email: res.data.data.email || "",
          designation: res.data.data.designation || "Admin",
          phone: res.data.data.phone || "",
          location: res.data.data.location || "",
          profileImage: res.data.data.profileImage || "",
        });
      }
    } catch (error) {
      console.log("ADMIN PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/login";
      } else {
        alert(error.response?.data?.message || "Failed to load admin profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }

      setSaving(true);

      const res = await API.put(
        "/admin/profile",
        {
          userName: profile.userName,
          email: profile.email,
          designation: profile.designation,
          phone: profile.phone,
          location: profile.location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        const updatedAdmin = res.data.data;

        setProfile((prev) => ({
          ...prev,
          userName: updatedAdmin.userName,
          email: updatedAdmin.email,
          designation: updatedAdmin.designation,
          phone: updatedAdmin.phone,
          location: updatedAdmin.location,
          profileImage: updatedAdmin.profileImage || "",
        }));

        localStorage.setItem(
          "admin",
          JSON.stringify({
            id: updatedAdmin.id,
            userName: updatedAdmin.userName,
            email: updatedAdmin.email,
          }),
        );

        alert("Profile updated successfully");
      }
    } catch (error) {
      console.log("UPDATE ADMIN PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        alert("Session expired. Please login again");

        window.location.href = "/login";
      } else {
        alert(error.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />

        <div className="home-section">Loading profile...</div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="profile_head">
          <h5>Forms</h5>
          <i className="bi bi-house-door"></i>
        </div>

        <div className="ina_row">
          <div className="Profile_cards">
            <div className="card-top">
              <div className="card-profile">
                <img
                  src={getImageUrl(profile.profileImage)}
                  alt="Admin Profile"
                />

                <h5>{profile.userName}</h5>

                <h6>{profile.designation}</h6>

                <h6>{profile.location || "Location not added"}</h6>
              </div>

              <hr />

              <div className="Profile_div">
                <div className="Profile_div1-1">
                  <i className="bi bi-globe"></i>
                  <h6>Website</h6>
                </div>

                <div className="Profile_div1-2">
                  <p>https://CodeCraft.com</p>
                </div>
              </div>

              <hr />

              <div className="Profile_div">
                <div className="Profile_div1-1">
                  <i className="bi bi-twitter"></i>
                  <h6>Twitter</h6>
                </div>

                <div className="Profile_div1-2">
                  <p>@CodeCraft</p>
                </div>
              </div>

              <hr />

              <div className="Profile_div">
                <div className="Profile_div1-1">
                  <i className="bi bi-instagram"></i>
                  <h6>Instagram</h6>
                </div>

                <div className="Profile_div1-2">
                  <p>CodeCraft</p>
                </div>
              </div>

              <hr />

              <div className="Profile_div">
                <div className="Profile_div1-1">
                  <i className="bi bi-facebook"></i>
                  <h6>Facebook</h6>
                </div>

                <div className="Profile_div1-2">
                  <p>CodeCraft</p>
                </div>
              </div>
            </div>
          </div>

          <div className="Profile_card2">
            <div className="input_field">
              <label>Full Name</label>

              <input
                type="text"
                name="userName"
                value={profile.userName}
                onChange={handleChange}
              />
            </div>

            <div className="input_field">
              <label>Designation</label>

              <input
                type="text"
                name="designation"
                value={profile.designation}
                onChange={handleChange}
              />
            </div>

            <div className="input_field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="input_field">
              <label>Mobile</label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <div className="input_field">
              <label>Address</label>

              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
              />
            </div>

            <div className="Sub_button">
              <button type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AdminProfile;
