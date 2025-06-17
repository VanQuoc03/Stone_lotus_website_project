export const getGuestCart = () => {
  return JSON.parse(localStorage.getItem("guestCart") || "[]");
};
export const saveGuestCart = (cart) => {
  localStorage.setItem("guestCart", JSON.stringify(cart));
};

export const addToGuestCart = (product) => {
  const cart = getGuestCart();
  const index = cart.findIndex((item) => item._id === product._id);
  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({
      ...product,
      _id: product._id || product.id,
      quantity: 1,
    });
  }
  saveGuestCart(cart);
};

export const updateGuestQuantity = (productId, quantity) => {
  let cart = getGuestCart();
  cart = cart.map((item) =>
    item._id === productId ? { ...item, quantity: Math.max(quantity, 1) } : item
  );
  saveGuestCart(cart);
  return cart;
};

export const removeGuestCart = (productId) => {
  let cart = getGuestCart();
  console.log("Product ID cần xóa:", productId);
  console.log("Cart trước khi xóa:", cart);
  cart = cart.filter((item) => item._id !== productId);
  console.log("Cart sau khi xóa:", cart);
  saveGuestCart(cart);
  return cart;
};
