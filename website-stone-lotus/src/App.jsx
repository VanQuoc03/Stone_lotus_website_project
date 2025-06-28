import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";

import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
