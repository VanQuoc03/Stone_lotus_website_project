import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";
import ChatBot from "./components/common/ChatBot";

function App() {
  return (
    <GoogleOAuthProvider clientId="40328464956-f8jnrv1uvepiiivg2qp60c51sv57vfvh.apps.googleusercontent.com">
      <BrowserRouter>
        <CartProvider>
          <ToastContainer position="top-right" autoClose={2000} />
          <AppRoutes />
        </CartProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
