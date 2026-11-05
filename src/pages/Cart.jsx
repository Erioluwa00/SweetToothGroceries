import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../data/products';
import { DeliveryMeter, EmptyIcon, FREE_DELIVERY, QtyStepper } from '../components/CartDrawer';
import Icon from '../components/Icon';

export default function Cart() {
  const { items, subtotal, count, setQty, clearCart } = useStore();

  if (!items.length) {
    return (
      <div className="container page-center">
        <div className="success">
          <EmptyIcon name="bag" />
          <h1>Your basket is empty</h1>
          <p>Sweet things are waiting for you. Start filling it up!</p>
          <Link to="/shop" className="btn btn--green btn--lg">Shop snacks <Icon name="arrow" size={18} /></Link>
        </div>
      </div>
    );
  }

  const savings = items.reduce((s, { product, qty }) => s + (product.oldPrice ? (product.oldPrice - product.price) * qty : 0), 0);

  return (
    <div className="container cartpage">
      <div className="checkout-steps">
        <span className="is-on"><b>1</b> Basket</span><i />
        <span><b>2</b> Checkout</span><i />
        <span><b>3</b> Confirmation</span>
      </div>
      <h1 className="page-title">Your basket <small>{count} item{count === 1 ? '' : 's'}</small></h1>
      <div className="cartpage__grid">
        <div>
          <DeliveryMeter subtotal={subtotal} />
          <ul className="cartlist">
            {items.map(({ product, qty }) => (
              <li key={product.id} className="cartrow">
                <Link to={`/product/${product.id}`} className="cartrow__img"><img src={product.image} alt="" /></Link>
                <div className="cartrow__info">
                  <small>{product.brand} · {product.size}</small>
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                  <span className="cartrow__unit">{formatNaira(product.price)} each</span>
                </div>
                <QtyStepper value={qty} onChange={(v) => setQty(product.id, v)} />
                <strong className="cartrow__total">{formatNaira(product.price * qty)}</strong>
                <button className="icon-btn" onClick={() => setQty(product.id, 0)} aria-label="Remove item"><Icon name="trash" size={20} /></button>
              </li>
            ))}
          </ul>
          <div className="cartpage__links">
            <Link to="/shop" className="link-btn link-btn--icon"><Icon name="arrow" size={16} className="flip" /> Keep shopping</Link>
            <button className="link-btn" onClick={clearCart}>Empty basket</button>
          </div>
        </div>

        <aside className="summary">
          <h3>Order summary</h3>
          <dl className="summary__rows">
            <dt>Subtotal ({count} items)</dt><dd>{formatNaira(subtotal)}</dd>
            {savings > 0 && <><dt>You're saving</dt><dd className="green">-{formatNaira(savings)}</dd></>}
            <dt>Delivery</dt><dd>{subtotal >= FREE_DELIVERY ? <span className="green">FREE</span> : 'Calculated next'}</dd>
            <dt className="total">Total</dt><dd className="total">{formatNaira(subtotal)}</dd>
          </dl>
          <Link to="/checkout" className="btn btn--green btn--block btn--lg"><Icon name="lock" size={18} /> Proceed to checkout</Link>
          <ul className="summary__trust">
            <li><Icon name="shield" size={18} /> Secure, encrypted payment</li>
            <li><Icon name="card" size={18} /> Card, bank transfer or pay on delivery</li>
            <li><Icon name="truck" size={18} /> Same-day delivery in Lagos</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
