export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function addToCart(item: CartItem) {
  const cart = getCart();

  const existing = cart.find((c) => c.id === item.id);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function updateQuantity(id: string, qty: number) {
  const cart = getCart().map((c) =>
    c.id === id ? { ...c, quantity: qty } : c
  );
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeItem(id: string) {
  const cart = getCart().filter((c) => c.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}