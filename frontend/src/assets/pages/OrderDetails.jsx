import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import API, { getImageUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);

        if (res.data.success) {
          setOrder(res.data.data);

          setStatus(res.data.data.orderStatus || "Pending");
        }
      } catch (error) {
        console.log("Error fetching order:", error);

        alert(error.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!status) {
      alert("Please select an order status");
      return;
    }

    if (!order) {
      return;
    }

    if (order.orderStatus === "Cancelled") {
      alert("Cancelled order cannot be modified");
      return;
    }

    try {
      setUpdatingStatus(true);

      const res = await API.put(`/orders/${order._id}/status`, {
        status,
      });

      if (res.data.success) {
        setOrder(res.data.data);

        setStatus(res.data.data.orderStatus);

        alert("Order status updated successfully");
      }
    } catch (error) {
      console.log("STATUS UPDATE ERROR:", error);

      alert(error.response?.data?.message || "Failed to update order status");

      // Restore original status if update failed
      setStatus(order.orderStatus || "Pending");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />

        <div className="home-section">
          <div className="div_tab">
            <div className="table-sec">
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                Loading order details...
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <AdminHeader />

        <div className="home-section">
          <div className="div_tab">
            <div className="table-sec">
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <h5>Order not found</h5>

                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  style={{
                    marginTop: "15px",
                  }}
                >
                  Back to Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  const subtotal = Number(order.subtotal || 0);

  const deduction = Number(order.deduction || 0);

  const total = Number(order.total || 0);

  const billing = order.billingDetails || {};

  const getProductPrice = (product) => {
    return Number(product.price || product.offerPrice || product.mrp || 0);
  };

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>

          <i className="bi bi-chevron-right"></i>

          <span
            onClick={() => navigate("/orders")}
            style={{
              cursor: "pointer",
            }}
          >
            Orders
          </span>

          <i className="bi bi-chevron-right"></i>

          <span>Order Details</span>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5>ORDER #{order._id?.slice(-6).toUpperCase()}</h5>

                <button type="button" onClick={() => navigate("/orders")}>
                  <i className="bi bi-arrow-left"></i> Back to Orders
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "25px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "25px",
                }}
              >
                <div>
                  <strong>ORDER DATE</strong>

                  <p>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <strong>PAYMENT METHOD</strong>

                  <p>{order.paymentMethod || "N/A"}</p>
                </div>

                <div>
                  <strong>ORDER STATUS</strong>

                  <p>{order.orderStatus || "Pending"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>CUSTOMER DETAILS</h5>
            </div>

            <div
              style={{
                padding: "25px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "25px",
                }}
              >
                <div>
                  <strong>CUSTOMER NAME</strong>

                  <p>
                    {billing.firstName || ""} {billing.lastName || ""}
                  </p>
                </div>

                <div>
                  <strong>EMAIL</strong>

                  <p>{billing.email || "N/A"}</p>
                </div>

                <div>
                  <strong>PHONE NUMBER</strong>

                  <p>{billing.phone || "N/A"}</p>
                </div>

                <div>
                  <strong>COMPANY NAME</strong>

                  <p>{billing.companyName || "N/A"}</p>
                </div>

                <div>
                  <strong>STREET ADDRESS</strong>

                  <p>{billing.streetAddress || "N/A"}</p>
                </div>

                <div>
                  <strong>CITY</strong>

                  <p>{billing.city || "N/A"}</p>
                </div>

                <div>
                  <strong>POSTCODE / ZIP</strong>

                  <p>{billing.postcode || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>ORDER PRODUCTS</h5>
            </div>

            <div className="div-table">
              <table
                className="table table-striped display dataTable"
                style={{
                  width: "100%",
                }}
              >
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>PRODUCT</th>
                    <th>COLOR</th>
                    <th>SIZE</th>
                    <th>PRICE</th>
                    <th>QUANTITY</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>

                <tbody>
                  {order.products && order.products.length > 0 ? (
                    order.products.map((product, index) => {
                      const price = getProductPrice(product);

                      const quantity = Number(product.quantity || 0);

                      return (
                        <tr key={`${product._id}-${index}`}>
                          <td>
                            {product.image || product.images?.[0] ? (
                              <img
                                src={getImageUrl(
                                  product.image || product.images?.[0],
                                )}
                                width="70"
                                height="70"
                                style={{
                                  objectFit: "cover",
                                }}
                                alt={product.productTitle}
                              />
                            ) : (
                              "No Image"
                            )}
                          </td>

                          <td>{product.productTitle}</td>

                          <td>{product.color || "N/A"}</td>

                          <td>{product.size || "N/A"}</td>

                          <td>${price.toFixed(2)}</td>

                          <td>{quantity}</td>

                          <td>${(price * quantity).toFixed(2)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>PAYMENT DETAILS</h5>
            </div>

            <div
              style={{
                padding: "25px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "25px",
                }}
              >
                <div>
                  <strong>PAYMENT METHOD</strong>

                  <p>{order.paymentMethod || "N/A"}</p>
                </div>

                <div>
                  <strong>PAYMENT STATUS</strong>

                  <p>
                    {order.paymentStatus ||
                      (order.paymentMethod === "Cash On Delivery"
                        ? "Pending"
                        : "Paid")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>PRICE DETAILS</h5>
            </div>

            <div
              style={{
                padding: "25px",
              }}
            >
              <div
                style={{
                  maxWidth: "450px",
                  marginLeft: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>SUBTOTAL</p>

                  <p>${subtotal.toFixed(2)}</p>
                </div>

                <hr />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>DEDUCTION</p>

                  <p>-${deduction.toFixed(2)}</p>
                </div>

                <hr />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <p>TOTAL</p>

                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>ORDER STATUS</h5>
            </div>

            <div
              style={{
                padding: "25px",
              }}
            >
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <strong>CURRENT STATUS</strong>

                <h4
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {order.orderStatus || "Pending"}
                </h4>

                <p>
                  Order placed on{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={updatingStatus || order.orderStatus === "Cancelled"}
                  style={{
                    minWidth: "200px",
                    padding: "8px 12px",
                  }}
                >
                  <option value="Pending">Pending</option>

                  <option value="Confirmed">Confirmed</option>

                  <option value="Processing">Processing</option>

                  <option value="Shipped">Shipped</option>

                  <option value="Delivered">Delivered</option>

                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || order.orderStatus === "Cancelled"}
                >
                  {updatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>

              {order.orderStatus === "Cancelled" && (
                <p
                  style={{
                    marginTop: "15px",
                  }}
                >
                  This order has been cancelled and cannot be modified.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default OrderDetails;
