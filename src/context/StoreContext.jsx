import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct } from '../data/products';

const StoreContext = createContext(null);

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('st-cart', {}));
  const [wishlist, setWishlist] = useState(() => load('st-wish', []));
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => save('st-cart', cart), [cart]);
  useEffect(() => save('st-wish', wishlist), [wishlist]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback((id, qty = 1) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));
    const prod = getProduct(id);
    setToast({ id: Date.now(), text: `${prod?.name ?? 'Item'} added to your basket`, image: prod?.image });
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const toggleWish = useCallback((id) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: getProduct(id), qty }))
        .filter((x) => x.product),
    [cart]
  );
  const count = items.reduce((s, x) => s + x.qty, 0);
  const subtotal = items.reduce((s, x) => s + x.qty * x.product.price, 0);

  const [orders, setOrders] = useState(() => load('st-orders', []));
  useEffect(() => save('st-orders', orders), [orders]);

  // Demo only: "places" the order in the browser so the confirmation page can show it.
  const placeOrder = useCallback((details) => {
    const id = 'ST-' + Math.floor(100000 + Math.random() * 900000);
    const order = {
      id,
      createdAt: new Date().toISOString(),
      items: items.map(({ product, qty }) => ({ id: product.id, name: product.name, brand: product.brand, image: product.image, price: product.price, qty })),
      ...details,
    };
    setOrders((o) => [order, ...o].slice(0, 10));
    setCart({});
    return id;
  }, [items]);
  const getOrder = useCallback((id) => orders.find((o) => o.id === id), [orders]);

  const value = {
    cart, items, count, subtotal, addToCart, setQty, clearCart,
    wishlist, toggleWish, cartOpen, setCartOpen, toast,
    placeOrder, getOrder,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
