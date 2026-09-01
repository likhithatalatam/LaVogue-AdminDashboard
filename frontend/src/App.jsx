import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./assets/pages/AdminDashboard";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />}></Route>

        <Route path="/addbrand" element={<AddBrand />}></Route>
        <Route path="/addcategory" element={<AddCategory />}></Route>
        <Route path="/addproduct" element={<AddProduct />}></Route>
        <Route path="/addsubcategory" element={<AddSubCategory />}></Route>

        <Route path="/brands" element={<ViewBrand />}></Route>
        <Route path="/categories" element={<ViewCategories />}></Route>
        <Route path="/customers" element={<ViewCustomers />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/products" element={<ViewProducts />}></Route>
        <Route path="/subcategories" element={<ViewSubCategories />}></Route>
        <Route path="/orderdetails/:id" element={<OrderDetails />} />
        <Route path="/homemanagement" element={<HomeManagement />} />

        <Route path="/profile" element={<AdminProfile />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
