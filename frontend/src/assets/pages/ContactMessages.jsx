import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import API from "../../api";

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await API.get("/contact");

      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.log("CONTACT MESSAGES ERROR:", error);

      alert(error.response?.data?.message || "Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleView = async (message) => {
    setSelectedMessage(message);

    if (!message.isRead) {
      try {
        const res = await API.put(`/contact/${message._id}/read`);

        if (res.data.success) {
          setMessages((previous) =>
            previous.map((item) =>
              item._id === message._id ? { ...item, isRead: true } : item,
            ),
          );
        }
      } catch (error) {
        console.log("MARK MESSAGE READ ERROR:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmDelete) return;

    try {
      const res = await API.delete(`/contact/${id}`);

      if (res.data.success) {
        setMessages((previous) =>
          previous.filter((message) => message._id !== id),
        );

        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }

        alert("Message deleted successfully");
      }
    } catch (error) {
      console.log("DELETE CONTACT MESSAGE ERROR:", error);

      alert(error.response?.data?.message || "Failed to delete message");
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>
          <i className="bi bi-chevron-right"></i>
          <a href="#">Contact Messages</a>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>Contact Messages</h5>
            </div>

            <div className="div-table">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8">Loading...</td>
                    </tr>
                  ) : messages.length === 0 ? (
                    <tr>
                      <td colSpan="8">No contact messages found</td>
                    </tr>
                  ) : (
                    messages.map((message, index) => (
                      <tr key={message._id}>
                        <td>{index + 1}</td>

                        <td>{message.name}</td>

                        <td>{message.email}</td>

                        <td>{message.phone || "-"}</td>

                        <td>{message.subject}</td>

                        <td>
                          {new Date(message.createdAt).toLocaleDateString()}
                        </td>

                        <td>{message.isRead ? "Read" : "Unread"}</td>

                        <td>
                          <div className="action">
                            <button
                              type="button"
                              onClick={() => handleView(message)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            <button
                              type="button"
                              className="delete_btn"
                              onClick={() => handleDelete(message._id)}
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedMessage && (
          <div className="div_tab">
            <div className="table-sec">
              <div className="head">
                <h5>Message Details</h5>
              </div>

              <div style={{ padding: "20px" }}>
                <p>
                  <strong>Name:</strong> {selectedMessage.name}
                </p>

                <p>
                  <strong>Email:</strong> {selectedMessage.email}
                </p>

                <p>
                  <strong>Phone:</strong> {selectedMessage.phone || "-"}
                </p>

                <p>
                  <strong>Subject:</strong> {selectedMessage.subject}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>

                <p>
                  <strong>Message:</strong>
                </p>

                <p>{selectedMessage.message}</p>

                <button type="button" onClick={() => setSelectedMessage(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default ContactMessages;
