import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getProduct } from '../data/products';
import ProductCard from '../components/ProductCard';
import { EmptyIcon } from '../components/CartDrawer';

export default function Wishlist() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);
  return (
    <div className="container" style={{ paddingBlock: '48px 80px' }}>
      <h1 className="page-title">Your wishlist</h1>
      {items.length ? (
        <div className="pgrid pgrid--home">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <div className="success">
          <EmptyIcon name="heart" />
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any snack to save it for later.</p>
          <Link to="/shop" className="btn btn--green">Explore the shop</Link>
        </div>
      )}
    </div>
  );
}
