import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../data/products';
import Icon from './Icon';

export const FREE_DELIVERY = 50000;

export function QtyStepper({ value, onChange, small }) {
  return (
    <div className={`qty ${small ? 'qty--small' : ''}`}>
      <button onClick={() => onChange(value - 1)} aria-label="Decrease quantity"><Icon name="minus" size={16} strokeWidth={2.4} /></button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="Increase quantity"><Icon name="plus" size={16} strokeWidth={2.4} /></button>
    </div>
  );
}

export function EmptyIcon({ name }) {
  return <div className="empty-icon"><Icon name={name} size={40} strokeWidth={1.6} /></div>;
}

export function DeliveryMeter({ subtotal }) {
  const left = Math.max(0, FREE_DELIVERY - subtotal);
  const pct = Math.min(100, (subtotal / FREE_DELIVERY) * 100);
  return (
    <div className="meter">
      <p>
        <Icon name="truck" size={18} />
        {left > 0
          ? <span>You're <strong>{formatNaira(left)}</strong> away from <strong>free Lagos delivery</strong></span>
          : <span>You've unlocked <strong>free Lagos delivery!</strong></span>}
      </p>
      <div className="meter__bar"><span style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export default function CartDrawer() {
  const { cartOpen, setCartOpen, items, subtotal, setQty, count } = useStore();
  const location = useLocation();

  useEffect(() => setCartOpen(false), [location.pathname, setCartOpen]);
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, setCartOpen]);

  return (
    <div className={`drawer ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen}>
      <div className="drawer__backdrop" onClick={() => setCartOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-label="Your basket">
        <div className="drawer__head">
          <h3>Your basket <span>{count} item{count === 1 ? '' : 's'}</span></h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close basket"><Icon name="close" /></button>
        </div>
        {items.length === 0 ? (
          <div className="drawer__empty">
            <EmptyIcon name="bag" />
            <h4>Your basket is feeling empty</h4>
            <p>Let's fix that with something sweet.</p>
            <Link to="/shop" className="btn btn--green">Start shopping</Link>
          </div>
        ) : (
          <>
            <DeliveryMeter subtotal={subtotal} />
            <ul className="drawer__list">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="mini-item">
                  <Link to={`/product/${product.id}`}><img src={product.image} alt="" /></Link>
                  <div>
                    <small>{product.brand}</small>
                    <Link to={`/product/${product.id}`} className="mini-item__name">{product.name}</Link>
                    <div className="mini-item__row">
                      <QtyStepper small value={qty} onChange={(v) => setQty(product.id, v)} />
                      <strong>{formatNaira(product.price * qty)}</strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer__foot">
              <div className="drawer__total"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
              <Link to="/checkout" className="btn btn--green btn--block btn--lg"><Icon name="lock" size={18} /> Checkout securely</Link>
              <Link to="/cart" className="btn btn--ghost btn--block">View full basket</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
