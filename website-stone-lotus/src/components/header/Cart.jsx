import React from "react";
import CartIcon from "../../assets/icon_header/CartIcon";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

function CartButton() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  return (
    <div className="relative rounded">
      <button
        className="flex items-center justify-center text-white rounded p-2"
        onClick={() => navigate("/cart")}
      >
        <div className="relative mr-2">
          <CartIcon />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </div>
        <p className="hidden lg:block">Giỏ hàng</p>
      </button>
    </div>
  );
}

export default CartButton;
