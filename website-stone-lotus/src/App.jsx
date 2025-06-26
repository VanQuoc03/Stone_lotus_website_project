import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
