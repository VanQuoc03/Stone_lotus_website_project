import { Routes, Route } from "react-router-dom";
import Index from "../pages/Home/index";
import Layout from "../layouts/Layout";
import Login from "../pages/Auth/login/Login";
import Signup from "../pages/Auth/signup/signup";
import ProductPage from "../pages/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import RequireAdmin from "../components/Auth/RequireAdmin";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ProductPageAdmin from "../pages/admin/Products/ProductPage";
import CustomerPage from "@/pages/admin/Customer/CustomerPage";
import SessionExpired from "@/components/common/SessionExpired";
import CategoriesPageAdmin from "@/pages/admin/Categories/CategoriesPage";
import { ToastContainer } from "react-toastify";
import ShoppingCart from "../pages/cart/CartPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import CheckoutPage from "@/pages/admin/checkout/CheckoutPage";
import ThankYouPage from "@/pages/admin/checkout/ThankYouPage";
import InventoryPage from "@/pages/admin/inventory/InventoryPage";
import SearchPage from "@/pages/search/SearchPage";
import OrdersPage from "@/pages/admin/order/OrdersPage";
import OrderDetailsPage from "@/pages/admin/order/OrderDetailsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/session-expired" element={<SessionExpired />} />
      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <RequireAdmin>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/products"
        element={
          <RequireAdmin>
            <AdminLayout>
              <ProductPageAdmin />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <RequireAdmin>
            <AdminLayout>
              <ToastContainer position="top-right" autoClose={3000} />
              <CustomerPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <RequireAdmin>
            <AdminLayout>
              <CategoriesPageAdmin />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="inventory"
        element={
          <RequireAdmin>
            <AdminLayout>
              <InventoryPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <RequireAdmin>
            <AdminLayout>
              <OrdersPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <RequireAdmin>
            <AdminLayout>
              <OrderDetailsPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />

      {/* Customer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route
        path="/"
        element={
          <Layout>
            <Index />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <ProductPage />
          </Layout>
        }
      />
      <Route
        path="/products/category/:id"
        element={
          <Layout>
            <ProductPage />
          </Layout>
        }
      />
      <Route
        path="/products/:id"
        element={
          <Layout>
            <ProductDetailPage />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <ShoppingCart />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout>
            <CheckoutPage />
          </Layout>
        }
      />
      <Route
        path="/thank-you/:orderId"
        element={
          <Layout>
            <ThankYouPage />
          </Layout>
        }
      />
      <Route
        path="/search"
        element={
          <Layout>
            <SearchPage />
          </Layout>
        }
      />
    </Routes>
  );
}
