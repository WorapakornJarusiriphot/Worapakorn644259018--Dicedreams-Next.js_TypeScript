import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import ProductList from "../pages/shop/ProductList";
// import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import Cart from "../pages/shop/Cart";
import DashboardLayout from "../layout/DashboardLayout";
import User from "../pages/dashboard/admin/User";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Add_Product from "../pages/dashboard/admin/Add_Product";
import Manage_Product_Item from "../pages/dashboard/admin/Manage_Product_Item";
import Update_Product_Item from "../pages/dashboard/admin/Update_Product_Item";
import Customer_Support from "../pages/dashboard/admin/Customer_Support";
import HomeAdmin from "../pages/dashboard/admin/Home";
import Manage_Orders from "../pages/dashboard/admin/Manage_Orders";
import Order_Tracking from "../pages/dashboard/admin/Order_Tracking";
import Products from "../pages/dashboard/admin/Products";
import PostGameDetail from "../pages/PostGameDetail";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/postgame",
        element: (
          <PrivateRouter>
            <PostGameDetail />
          </PrivateRouter>
        ),
      },
      {
        path: "/shop",
        element: (
          <PrivateRouter>
            <ProductList />
          </PrivateRouter>
        ),
      },
      {
        path: "/cart",
        element: (
          <PrivateRouter>
            <Cart />
          </PrivateRouter>
        ),
      },
      {
        path: "/update-profile",
        element: <UpdateProfile />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRouter>
        <DashboardLayout />
      </PrivateRouter>
    ),
    children: [
      { path: "users", element: <User /> },
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "addProducts",
        element: <Add_Product />,
      },
      {
        path: "manageProductItem",
        element: <Manage_Product_Item />,
      },
      {
        path: "updateProductItem/:id",
        element: <Update_Product_Item />,
      },
      {
        path: "customerSupport",
        element: <Customer_Support />,
      },
      {
        path: "home",
        element: <HomeAdmin />,
      },
      {
        path: "manageOrders",
        element: <Manage_Orders />,
      },
      {
        path: "orderTracking",
        element: <Order_Tracking />,
      },
      {
        path: "products",
        element: <Products />,
      },
    ],
  },
  // {
  //   path: "/signup",
  //   element: <SignUp />,
  // },
  {
    path: "/signin",
    element: <SignIn />,
  },
]);

export default router;