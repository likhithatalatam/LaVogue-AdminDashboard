import React, { useEffect, useState } from "react";
import "../css/global.css";
import AdminHeader from "../common/Header";
import Footer from "../common/Footer";
import API, { getImageUrl } from "../../api";
import { Link } from "react-router-dom";

function ViewProducts() {
  const [products, setproducts] = useState([]);

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const res = await API.get("/products");
        setproducts(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchproducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmdelete = window.confirm("Are you sure you want to delete");

    if (!confirmdelete) {
      return;
    }

    try {
      await API.delete(`/products/${id}`);

      setproducts((prev) => prev.filter((p) => p._id !== id));

      alert("Product deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete product");
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="home-section">
        <div className="add-head">
          <i className="bi bi-house-door"></i>

          <i className="bi bi-chevron-right"></i>

          <Link to="/addproduct">Add Products</Link>
        </div>

        <div className="div_tab">
          <div className="table-sec">
            <div className="head">
              <h5>View Products</h5>
            </div>

            <div className="div-table">
              <table
                className="table table-striped display dataTable"
                id="example"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>S.No</th>

                    <th>Product Title</th>

                    <th>Product Description</th>

                    <th>Category</th>

                    <th>Sub-Category</th>

                    <th>Brand</th>

                    <th>Color</th>

                    <th>Size</th>

                    <th>Availability</th>

                    <th>Discount</th>

                    <th>Images</th>

                    <th>MRP</th>

                    <th>Offer Price</th>

                    <th>Created at</th>

                    <th>Updated at</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((pro, index) => (
                    <tr key={pro._id}>
                      <td>{index + 1}</td>

                      <td>
                        <div
                          style={{
                            width: "180px",
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {pro.productTitle}
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            width: "300px",
                            maxWidth: "300px",
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                            lineHeight: "1.5",
                          }}
                        >
                          {pro.productDescription}
                        </div>
                      </td>

                      <td>{pro.category?.categoryName}</td>

                      <td>{pro.subCategory?.subCategoryName}</td>

                      <td>{pro.brand?.brandName}</td>

                      <td>
                        {pro.variants?.length > 0
                          ? pro.variants.map((variant, i) => (
                              <div key={i}>{variant.color}</div>
                            ))
                          : "-"}
                      </td>

                      <td>
                        {pro.variants?.length > 0
                          ? pro.variants.map((variant, i) => (
                              <div key={i}>{variant.size}</div>
                            ))
                          : "-"}
                      </td>

                      <td>
                        {pro.variants?.length > 0
                          ? pro.variants.map((variant, i) => (
                              <div key={i}>{variant.availability}</div>
                            ))
                          : "-"}
                      </td>

                      <td>{pro.discount}</td>

                      <td>
                        {pro.images?.map((img, i) => (
                          <img
                            key={i}
                            src={getImageUrl(img)}
                            width="60"
                            style={{
                              marginRight: "5px",
                            }}
                            alt={pro.productTitle}
                          />
                        ))}
                      </td>

                      <td>{pro.mrp}</td>

                      <td>{pro.offerPrice}</td>

                      <td>{new Date(pro.createdAt).toLocaleDateString()}</td>

                      <td>{new Date(pro.updatedAt).toLocaleDateString()}</td>

                      <td>
                        <div className="action">
                          <Link to={`/editproduct/${pro._id}`}>
                            <i className="bi bi-pencil-square"></i>
                          </Link>

                          <button
                            onClick={() => handleDelete(pro._id)}
                            className="delete_btn"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="page">
              <nav>
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#">
                      Previous
                    </a>
                  </li>

                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>

                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>

                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>

                  <li className="page-item">
                    <a className="page-link" href="#">
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ViewProducts;
