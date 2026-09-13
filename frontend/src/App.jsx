import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./assets/pages/AdminDashboard";
import AdminLogin from "./assets/pages/AdminLogin";
import AdminProtectedRoute from "./assets/pages/AdminProtectedRoute";

import AddBrand from "./assets/pages/AddBrand";
import AddCategory from "./assets/pages/AddCategory";
import AddProduct from "./assets/pages/AddProduct";
import AddSubCategory from "./assets/pages/AddSub-Category";
import AdminProfile from "./assets/pages/AdminProfile";
import ViewBrand from "./assets/pages/ViewBrands";
import ViewCategories from "./assets/pages/ViewCategories";
import ViewCustomers from "./assets/pages/ViewCustomers";
import Orders from "./assets/pages/ViewOrders";
import ViewProducts from "./assets/pages/ViewProducts";
import ViewSubCategories from "./assets/pages/ViewSubCategories";
import OrderDetails from "./assets/pages/OrderDetails";
import HomeManagement from "./assets/pages/HomeManagement";
import ContactMessages from "./assets/pages/ContactMessages";
import EditCategory from "./assets/pages/EditCategory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/" element={<AdminDashboard />} />

          <Route path="/addbrand" element={<AddBrand />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/addsubcategory" element={<AddSubCategory />} />

          <Route path="/brands" element={<ViewBrand />} />
          <Route path="/categories" element={<ViewCategories />} />
          <Route path="/customers" element={<ViewCustomers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<ViewProducts />} />
          <Route path="/subcategories" element={<ViewSubCategories />} />

          <Route path="/orderdetails/:id" element={<OrderDetails />} />

          <Route path="/homemanagement" element={<HomeManagement />} />

          <Route path="/contactmessages" element={<ContactMessages />} />

          <Route path="/editcategory/:id" element={<EditCategory />} />

          <Route path="/profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
