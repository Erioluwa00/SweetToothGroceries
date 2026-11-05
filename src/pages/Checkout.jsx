import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../data/products';
import { EmptyIcon, FREE_DELIVERY } from '../components/CartDrawer';
import Icon from '../components/Icon';

export const ZONES = [
  { id: 'mainland', label: 'Lagos Mainland', note: 'Ikeja, Yaba, Surulere…', fee: 2500, eta: 'Same day' },
  { id: 'island', label: 'Lagos Island & Lekki', note: 'VI, Ikoyi, Lekki, Ajah…', fee: 3500, eta: 'Same day' },
  { id: 'interstate', label: 'Outside Lagos', note: 'Abuja, Ibadan, PH & more', fee: 6000, eta: '2–4 days' },
  { id: 'pickup', label: 'Store pickup', note: 'Collect from our Lagos hub', fee: 0, eta: 'Ready in 2 hrs' },
];
export const PAYMENTS = [
  { id: 'card', label: 'Pay with card', note: 'Visa, Mastercard, Verve', icon: 'card' },
  { id: 'transfer', label: 'Bank transfer', note: 'Pay into our account', icon: 'bank' },
  { id: 'pod', label: 'Pay on delivery', note: 'Cash or POS at your door', icon: 'cash' },
];
const SLOTS = ['9am – 12pm', '12pm – 3pm', '3pm – 6pm'];
const CODES = { BIMS10: 0.1, SWEET5: 0.05 };

const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const fmtExp = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1 / $2');

export default function Checkout() {
  const { items, subtotal, count, placeOrder } = useStore();
  const navigate = useNavigate();
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  const [address, setAddress] = useState({ street: '', area: '', landmark: '' });
  const [zone, setZone] = useState('mainland');
  const [day, setDay] = useState('Today');
  const [slot, setSlot] = useState(SLOTS[1]);
  const [payment, setPayment] = useState('card');
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' });
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);
  const [codeError, setCodeError] = useState('');
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);

  if (!items.length) {
    return (
      <div className="container page-center">
        <div className="success">
          <EmptyIcon name="bag" />
          <h1>Nothing to check out yet</h1>
          <p>Add a few treats to your basket first.</p>
          <Link to="/shop" className="btn btn--green btn--lg">Shop snacks</Link>
        </div>
      </div>
    );
  }

  const z = ZONES.find((x) => x.id === zone);
  const discount = applied ? Math.round(subtotal * CODES[applied]) : 0;
  const delivery = subtotal >= FREE_DELIVERY && zone !== 'interstate' ? 0 : z.fee;
  const total = subtotal - discount + delivery;

  const applyCode = () => {
    const c = code.trim().toUpperCase();
    if (CODES[c]) { setApplied(c); setCodeError(''); }
    else { setApplied(null); setCodeError("That code isn't valid. Try BIMS10."); }
  };

  const submit = (e) => {
    e.preventDefault();
    setPlacing(true);
    setTimeout(() => {
      const id = placeOrder({
        contact,
        address: zone === 'pickup' ? null : address,
        zone: z.label,
        eta: zone === 'interstate' ? z.eta : zone === 'pickup' ? z.eta : `${day}, ${slot}`,
        payment,
        subtotal, discount, delivery, total, promo: applied, note,
      });
      navigate(`/order/${id}`);
    }, 1400);
  };

  const set = (setter) => (k) => (e) => setter((s) => ({ ...s, [k]: e.target.value }));
  const c = set(setContact);
  const a = set(setAddress);

  return (
    <div className="container cartpage">
      <div className="checkout-steps">
        <Link to="/cart" className="is-done"><b><Icon name="check" size={14} strokeWidth={3} /></b> Basket</Link><i className="is-done" />
        <span className="is-on"><b>2</b> Checkout</span><i />
        <span><b>3</b> Confirmation</span>
      </div>
      <h1 className="page-title">Checkout</h1>

      <form className="cartpage__grid" onSubmit={submit}>
        <div className="co">
          <section className="co__card">
            <h3><span className="co__num">1</span> Your details</h3>
            <div className="fields fields--2">
              <label className="field"><span>Full name</span><input required value={contact.name} onChange={c('name')} placeholder="e.g. Adaeze Okafor" autoComplete="name" /></label>
              <label className="field"><span>Phone number</span><input required type="tel" value={contact.phone} onChange={c('phone')} placeholder="080 0000 0000" autoComplete="tel" /></label>
            </div>
            <label className="field"><span>Email <em>(for your receipt)</em></span><input type="email" value={contact.email} onChange={c('email')} placeholder="you@example.com" autoComplete="email" /></label>
          </section>

          <section className="co__card">
            <h3><span className="co__num">2</span> Delivery</h3>
            <div className="opts opts--2">
              {ZONES.map((x) => (
                <label key={x.id} className={`opt ${zone === x.id ? 'is-on' : ''}`}>
                  <input type="radio" name="zone" checked={zone === x.id} onChange={() => setZone(x.id)} />
                  <span className="opt__radio" />
                  <span className="opt__text"><strong>{x.label}</strong><small>{x.note}</small></span>
                  <span className="opt__side"><strong>{(subtotal >= FREE_DELIVERY && x.id !== 'interstate') || !x.fee ? 'Free' : formatNaira(x.fee)}</strong><small>{x.eta}</small></span>
                </label>
              ))}
            </div>

            {zone !== 'pickup' && (
              <>
                <label className="field"><span>Street address</span><input required value={address.street} onChange={a('street')} placeholder="House number and street" autoComplete="street-address" /></label>
                <div className="fields fields--2">
                  <label className="field"><span>Area / LGA</span><input required value={address.area} onChange={a('area')} placeholder="e.g. Lekki Phase 1" /></label>
                  <label className="field"><span>Nearest landmark <em>(optional)</em></span><input value={address.landmark} onChange={a('landmark')} placeholder="e.g. Opposite the mall" /></label>
                </div>
              </>
            )}

            {(zone === 'mainland' || zone === 'island') && (
              <div className="slots">
                <p className="field-label"><Icon name="calendar" size={16} /> Delivery time</p>
                <div className="pills">
                  {['Today', 'Tomorrow'].map((d) => (
                    <button type="button" key={d} className={`pill ${day === d ? 'is-on' : ''}`} onClick={() => setDay(d)}>{d}</button>
                  ))}
                  <span className="slots__sep" />
                  {SLOTS.map((s) => (
                    <button type="button" key={s} className={`pill ${slot === s ? 'is-on' : ''}`} onClick={() => setSlot(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="co__card">
            <h3><span className="co__num">3</span> Payment</h3>
            <div className="opts">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`opt ${payment === p.id ? 'is-on' : ''}`}>
                  <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                  <span className="opt__radio" />
                  <span className="opt__icon"><Icon name={p.icon} size={22} /></span>
                  <span className="opt__text"><strong>{p.label}</strong><small>{p.note}</small></span>
                </label>
              ))}
            </div>

            {payment === 'card' && (
              <div className="cardbox">
                <label className="field"><span>Card number</span>
                  <div className="field__icon"><Icon name="card" size={18} /><input required inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: fmtCard(e.target.value) })} placeholder="0000 0000 0000 0000" autoComplete="off" /></div>
                </label>
                <div className="fields fields--2">
                  <label className="field"><span>Expiry</span><input required inputMode="numeric" value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} placeholder="MM / YY" autoComplete="off" /></label>
                  <label className="field"><span>CVC</span><input required inputMode="numeric" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" autoComplete="off" /></label>
                </div>
                <p className="cardbox__note"><Icon name="lock" size={14} /> Demo checkout — no real payment is taken and card details are not stored.</p>
              </div>
            )}
            {payment === 'transfer' && (
              <p className="infobox"><Icon name="bank" size={18} /> Our account details and a payment reference will appear on the next page. Your order is confirmed once payment is received.</p>
            )}
            {payment === 'pod' && (
              <p className="infobox"><Icon name="cash" size={18} /> Pay with cash or card (POS) when your order arrives. Available within Lagos.</p>
            )}

            <label className="field"><span>Order note <em>(optional)</em></span><textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gift wrapping, delivery instructions…" /></label>
          </section>
        </div>

        <aside className="summary">
          <h3>Order summary <small>{count} items</small></h3>
          <ul className="summary__items">
            {items.map(({ product, qty }) => (
              <li key={product.id}>
                <span className="summary__thumb"><img src={product.image} alt="" /><b>{qty}</b></span>
                <span className="summary__name">{product.name}<small>{product.brand}</small></span>
                <strong>{formatNaira(product.price * qty)}</strong>
              </li>
            ))}
          </ul>

          <div className="promo-code">
            <div className="field__icon"><Icon name="tag" size={18} /><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code" /></div>
            <button type="button" className="btn btn--outline" onClick={applyCode}>Apply</button>
          </div>
          {codeError && <p className="form-error">{codeError}</p>}
          {applied && <p className="form-ok"><Icon name="check" size={16} strokeWidth={2.6} /> {applied} applied — {CODES[applied] * 100}% off</p>}

          <dl className="summary__rows">
            <dt>Subtotal</dt><dd>{formatNaira(subtotal)}</dd>
            {discount > 0 && <><dt>Discount</dt><dd className="green">-{formatNaira(discount)}</dd></>}
            <dt>Delivery</dt><dd>{delivery ? formatNaira(delivery) : <span className="green">FREE</span>}</dd>
            <dt className="total">Total</dt><dd className="total">{formatNaira(total)}</dd>
          </dl>
          <button className="btn btn--green btn--block btn--lg" disabled={placing}>
            {placing ? <><span className="spinner" /> Processing…</> : <><Icon name="lock" size={18} /> {payment === 'card' ? `Pay ${formatNaira(total)}` : 'Place order'}</>}
          </button>
          <p className="summary__fine">By placing your order you agree to our terms of sale.</p>
        </aside>
      </form>
    </div>
  );
}
