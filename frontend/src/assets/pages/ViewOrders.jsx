import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import API from "../../api";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get("/orders");

      setOrders(res.data.data || []);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH ORDERS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // REFRESH WHEN ADMIN COMES BACK TO THIS PAGE
  // =====================================================

  useEffect(() => {
    const handleFocus = () => {
      fetchOrders();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // =====================================================
  // OPTIONAL AUTO REFRESH
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // VIEW ALL ORDERS
  // =====================================================

  const handleViewAllOrders = () => {
    setShowOrders(true);

    // Refresh immediately when opening the table
    fetchOrders();
  };

  // =====================================================
  // ORDER COUNTS
  // =====================================================

  const placedOrders = orders.filter(
    (order) => order.orderStatus === "Pending",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "Cancelled",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered",
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.orderStatus === "Confirmed",
  ).length;

  const inTransitOrders = orders.filter(
    (order) =>
      order.orderStatus === "Processing" || order.orderStatus === "Shipped",
  ).length;

  const failedOrders = orders.filter(
    (order) => order.orderStatus === "Failed",
  ).length;

  // =====================================================
  // OPEN ORDER DETAILS
  // =====================================================

  const handleRowClick = (orderId) => {
    navigate(`/orderdetails/${orderId}`);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        {/* =====================================================
            VIEW ALL ORDERS
        ===================================================== */}

        <div
          className="add-head"
          onClick={handleViewAllOrders}
          style={{
            cursor: "pointer",
          }}
        >
          <i className="bi bi-arrow-right"></i>

          <span
            style={{
              fontWeight: "600",
              marginLeft: "8px",
            }}
          >
            View all Orders
          </span>
        </div>

        {/* =====================================================
            ORDER SUMMARY CARDS
        ===================================================== */}

        <div className="cards">
          {/* PLACED */}

          <div className="card1_1">
            <div>
              <p>{placedOrders}</p>
              <p>Placed Orders</p>
            </div>

            <div>
              <i className="bi bi-cart"></i>
            </div>
          </div>

          {/* CANCELLED */}

          <div className="card4_4">
            <div>
              <p>{cancelledOrders}</p>
              <p>Cancelled Orders</p>
            </div>

            <div>
              <i className="bi bi-x"></i>
            </div>
          </div>

          {/* DELIVERED */}

          <div className="card3_3">
            <div>
              <p>{deliveredOrders}</p>
              <p>Delivered Orders</p>
            </div>

            <div>
              <i className="bi bi-envelope"></i>
            </div>
          </div>

          {/* CONFIRMED */}

          <div className="card2_2">
            <div>
              <p>{confirmedOrders}</p>
              <p>Confirmed Orders</p>
            </div>

            <div>
              <i className="bi bi-check2-square"></i>
            </div>
          </div>
        </div>

        {/* =====================================================
            SECOND ROW
        ===================================================== */}

        <div className="cards">
          {/* IN TRANSIT */}

          <div className="card1_5">
            <div>
              <p>{inTransitOrders}</p>
              <p>In Transist</p>
            </div>

            <div>
              <i className="bi bi-truck"></i>
            </div>
          </div>

          {/* PLACED CANCELLATION */}

          <div className="card2_6">
            <div>
              <p>0</p>
              <p>Placed Cancellation Orders</p>
            </div>

            <div>
              <i className="bi bi-cart"></i>
            </div>
          </div>

          {/* FAILED */}

          <div className="card3_7">
            <div>
              <p>{failedOrders}</p>
              <p>Failed Orders</p>
            </div>

            <div>
              <i className="bi bi-x-square"></i>
            </div>
          </div>
        </div>

        {/* =====================================================
            ORDERS TABLE
            ONLY SHOW AFTER CLICKING VIEW ALL ORDERS
        ===================================================== */}

        {showOrders && (
          <div className="div_tab">
            <div className="table-sec">
              <div className="head">
                <h5>ALL ORDERS</h5>
              </div>

              <div className="div-table">
                {loading ? (
                  <p
                    style={{
                      padding: "20px",
                    }}
                  >
                    Loading orders...
                  </p>
                ) : (
                  <table
                    className="table table-striped display dataTable"
                    style={{
                      width: "100%",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order, index) => (
                          <tr
                            key={order._id}
                            onClick={() => handleRowClick(order._id)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <td>{index + 1}</td>

                            <td>#{order._id.slice(-6).toUpperCase()}</td>

                            <td>
                              {order.billingDetails?.firstName}{" "}
                              {order.billingDetails?.lastName}
                            </td>

                            <td>
                              {order.products?.reduce(
                                (total, product) =>
                                  total + Number(product.quantity || 0),
                                0,
                              )}
                            </td>

                            <td>${Number(order.total || 0).toFixed(2)}</td>

                            <td>{order.paymentMethod}</td>

                            <td>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>

                            <td>{order.orderStatus}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            style={{
                              textAlign: "center",
                              padding: "20px",
                            }}
                          >
                            No orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Orders;
