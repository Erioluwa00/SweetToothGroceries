import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { toast, setCartOpen } = useStore();
  if (!toast) return null;
  return (
    <div className="toast" key={toast.id} role="status">
      {toast.image && <img src={toast.image} alt="" />}
      <span>{toast.text}</span>
      <button onClick={() => setCartOpen(true)}>View</button>
    </div>
  );
}
