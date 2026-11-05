import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../data/products';
import { PAYMENTS } from './Checkout';
import Icon from '../components/Icon';
import NotFound from './NotFound';

export default function Order() {
  const { id } = useParams();
  const { getOrder } = useStore();
  const order = getOrder(id);
  if (!order) return <NotFound />;

  const pay = PAYMENTS.find((p) => p.id === order.payment);
  const date = new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
  const steps = [
    ['check', 'Order placed', date],
    ['package', 'Packed with care', 'Usually within 1 hour'],
    ['truck', order.address ? 'Out for delivery' : 'Ready for pickup', order.eta],
    ['bag', order.address ? 'Delivered' : 'Collected', 'Enjoy your treats'],
  ];

  return (
    <div className="container cartpage">
      <div className="checkout-steps">
        <span className="is-done"><b><Icon name="check" size={14} strokeWidth={3} /></b> Basket</span><i className="is-done" />
        <span className="is-done"><b><Icon name="check" size={14} strokeWidth={3} /></b> Checkout</span><i className="is-done" />
        <span className="is-on"><b>3</b> Confirmation</span>
      </div>

      <div className="confirm">
        <div className="confirm__badge"><Icon name="check" size={44} strokeWidth={2.6} /></div>
        <h1>Thank you, {order.contact.name.split(' ')[0]}!</h1>
        <p>Your order <strong>#{order.id}</strong> has been placed{order.contact.email ? <> and a receipt is on its way to <strong>{order.contact.email}</strong></> : null}.</p>
      </div>

      <ol className="timeline">
        {steps.map(([icon, title, sub], i) => (
          <li key={title} className={i === 0 ? 'is-done' : ''}>
            <span><Icon name={icon} size={20} /></span>
            <strong>{title}</strong>
            <small>{sub}</small>
          </li>
        ))}
      </ol>

      <div className="cartpage__grid">
        <div className="co">
          {order.payment === 'transfer' && (
            <section className="co__card co__card--accent">
              <h3><Icon name="bank" size={22} /> Complete your bank transfer</h3>
              <dl className="specs">
                <dt>Amount</dt><dd>{formatNaira(order.total)}</dd>
                <dt>Bank</dt><dd>Business bank (added at launch)</dd>
                <dt>Account name</dt><dd>Sweettooth Groceries NG</dd>
                <dt>Reference</dt><dd>{order.id}</dd>
              </dl>
            </section>
          )}
          <section className="co__card">
            <h3>Delivery details</h3>
            <dl className="specs">
              <dt>Name</dt><dd>{order.contact.name}</dd>
              <dt>Phone</dt><dd>{order.contact.phone}</dd>
              <dt>Method</dt><dd>{order.zone}</dd>
              {order.address && <><dt>Address</dt><dd>{order.address.street}, {order.address.area}{order.address.landmark ? ` (${order.address.landmark})` : ''}</dd></>}
              <dt>When</dt><dd>{order.eta}</dd>
              <dt>Payment</dt><dd>{pay?.label}{order.payment === 'card' ? ' — paid' : ''}</dd>
              {order.note && <><dt>Note</dt><dd>{order.note}</dd></>}
            </dl>
          </section>
          <div className="confirm__actions">
            <Link to="/shop" className="btn btn--green btn--lg">Continue shopping <Icon name="arrow" size={18} /></Link>
            <Link to="/contact" className="btn btn--outline btn--lg">Need help?</Link>
          </div>
        </div>

        <aside className="summary">
          <h3>Your order</h3>
          <ul className="summary__items">
            {order.items.map((it) => (
              <li key={it.id}>
                <span className="summary__thumb"><img src={it.image} alt="" /><b>{it.qty}</b></span>
                <span className="summary__name">{it.name}<small>{it.brand}</small></span>
                <strong>{formatNaira(it.price * it.qty)}</strong>
              </li>
            ))}
          </ul>
          <dl className="summary__rows">
            <dt>Subtotal</dt><dd>{formatNaira(order.subtotal)}</dd>
            {order.discount > 0 && <><dt>Discount ({order.promo})</dt><dd className="green">-{formatNaira(order.discount)}</dd></>}
            <dt>Delivery</dt><dd>{order.delivery ? formatNaira(order.delivery) : <span className="green">FREE</span>}</dd>
            <dt className="total">Total</dt><dd className="total">{formatNaira(order.total)}</dd>
          </dl>
        </aside>
      </div>
    </div>
  );
}
