import React from "react";
import CartIcon from "../../assets/icon_header/CartIcon";

function CartButton() {
  const cartCount = 0;

  return (
    <div className="relative rounded">
      <button className="flex items-center justify-center text-white rounded p-2">
        <div className="relative mr-2">
          <CartIcon />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {cartCount}
          </span>
        </div>
        <p className="hidden lg:block">Giỏ hàng</p>
      </button>
    </div>
  );
}

export default CartButton;
