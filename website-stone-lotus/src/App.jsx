import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";

import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastContainer position="top-right" autoClose={2000} />
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
