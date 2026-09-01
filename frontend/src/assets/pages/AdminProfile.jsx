import React from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
function AdminProfile() {
  return (
    <>
      <AdminHeader />
      <div className="home-section">
        <div className="profile_head">
          <h5>Forms</h5>
          <i className="bi bi-house-door"></i>
        </div>

        <div className="ina_row">
          {/* LEFT PROFILE CARD */}
          <div className="Profile_cards">
            <div className="card-top">
              <div className="card-profile">
                <img src="/images/6997668-removebg-preview.png" alt="" />
                <h5>Ms.Likhitha</h5>
                <h6>Admin</h6>
                <h6>Kakinada</h6>
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

          {/* RIGHT FORM */}
          <div className="Profile_card2">
            <div className="input_field">
              <label>Full Name</label>
              <input type="text" />
            </div>

            <div className="input_field">
              <label>Designation</label>
              <input type="text" />
            </div>

            <div className="input_field">
              <label>Email</label>
              <input type="email" />
            </div>

            <div className="input_field">
              <label>Mobile</label>
              <input type="text" />
            </div>

            <div className="input_field">
              <label>Address</label>
              <input type="text" />
            </div>

            <div className="Sub_button">
              <button>Save</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminProfile;
