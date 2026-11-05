import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, categoryName, formatNaira, getProduct } from '../data/products';
import ProductCard, { Stars } from '../components/ProductCard';
import { QtyStepper } from '../components/CartDrawer';
import Icon from '../components/Icon';
import NotFound from './NotFound';

export default function Product() {
  const { id } = useParams();
  const product = getProduct(id);
  const { addToCart, wishlist, toggleWish, cart, setQty: setCartQty } = useStore();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);
  const timer = useRef();
  useEffect(() => { setQty(1); setFlash(false); }, [id]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const [tab, setTab] = useState('about');

  if (!product) return <NotFound />;

  const out = product.stock === 'out';
  const wished = wishlist.includes(product.id);
  const inCart = cart[product.id] || 0;
  const add = () => {
    addToCart(product.id, qty);
    setFlash(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setFlash(false); setQty(1); }, 1200);
  };
  const related = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);

  return (
    <div className="pdp">
      <div className="container">
        <p className="crumbs">
          <Link to="/">Home</Link> <Icon name="chevron" size={14} />
          <Link to="/shop">Shop</Link> <Icon name="chevron" size={14} />
          <Link to={`/shop?cat=${product.category}`}>{categoryName(product.category)}</Link> <Icon name="chevron" size={14} />
          <span>{product.name}</span>
        </p>

        <div className="pdp__grid">
          <div className="pdp__media">
            <img src={product.image} alt={product.name} />
            <div className="pcard__badges">
              {product.isNew && <span className="badge badge--new">New in</span>}
              {product.oldPrice && <span className="badge badge--sale">Sale</span>}
            </div>
          </div>

          <div className="pdp__info">
            <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="pdp__brand">{product.brand}</Link>
            <h1>{product.name}</h1>
            <div className="pdp__rating"><Stars rating={product.rating} /> <span>{product.rating} · {product.reviews} reviews</span></div>

            <div className="pdp__price">
              <strong>{formatNaira(product.price)}</strong>
              {product.oldPrice && <><s>{formatNaira(product.oldPrice)}</s><em>Save {formatNaira(product.oldPrice - product.price)}</em></>}
            </div>
            <p className="pdp__size">{product.size} · {product.pack}</p>

            <p className={`stock stock--${product.stock}`}>
              <span />{out ? 'Sold out — restocking soon' : product.stock === 'low' ? 'Only a few left in stock' : 'In stock & ready to deliver'}
            </p>

            <p className="pdp__desc">{product.desc}</p>

            <div className="pdp__tags">
              {product.flavours.map((f) => <Link key={f} to={`/shop?flavour=${encodeURIComponent(f)}`} className="pill">{f}</Link>)}
              {product.dietary.map((d) => <Link key={d} to={`/shop?diet=${encodeURIComponent(d)}`} className="pill pill--soft">{d}</Link>)}
            </div>

            {inCart > 0 && !flash ? (
              <>
                <div className="pdp__buy">
                  <div className="addbtn addbtn--lg addbtn--stepper grow">
                    <button onClick={() => setCartQty(product.id, inCart - 1)} aria-label="Remove one">
                      <Icon name={inCart === 1 ? 'trash' : 'minus'} size={20} strokeWidth={2.4} />
                    </button>
                    <span key={inCart} className="addbtn__qty">{inCart} in basket</span>
                    <button onClick={() => setCartQty(product.id, inCart + 1)} aria-label="Add one more">
                      <Icon name="plus" size={20} strokeWidth={2.4} />
                    </button>
                  </div>
                  <button className={`icon-btn icon-btn--box ${wished ? 'is-on' : ''}`} onClick={() => toggleWish(product.id)} aria-label="Toggle wishlist">
                    <Icon name="heart" filled={wished} />
                  </button>
                </div>
                <Link to="/checkout" className="btn btn--orange btn--block btn--lg"><Icon name="lock" size={18} /> Checkout now · {formatNaira(product.price * inCart)}</Link>
              </>
            ) : (
              <div className="pdp__buy">
                <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, v))} />
                <button className={`btn btn--lg grow ${flash ? 'btn--added' : 'btn--green'}`} disabled={out || flash} onClick={add}>
                  {flash
                    ? <><Icon name="check" size={20} strokeWidth={2.6} /> Added to basket</>
                    : <><Icon name="bag" size={20} /> {out ? 'Sold out' : `Add to basket · ${formatNaira(product.price * qty)}`}</>}
                </button>
                <button className={`icon-btn icon-btn--box ${wished ? 'is-on' : ''}`} onClick={() => toggleWish(product.id)} aria-label="Toggle wishlist">
                  <Icon name="heart" filled={wished} />
                </button>
              </div>
            )}

            <ul className="perks">
              <li><Icon name="truck" /> <span><strong>Same-day Lagos delivery</strong> on orders before 2pm</span></li>
              <li><Icon name="plane" /> <span><strong>100% authentic</strong> — imported directly from UK stores</span></li>
              <li><Icon name="shield" /> <span><strong>Freshness guaranteed</strong> — long best-before dates</span></li>
            </ul>

            <div className="tabs">
              <div className="tabs__bar">
                {[['about', 'Details'], ['delivery', 'Delivery'], ['storage', 'Storage']].map(([k, l]) => (
                  <button key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{l}</button>
                ))}
              </div>
              <div className="tabs__body">
                {tab === 'about' && (
                  <dl className="specs">
                    <dt>Brand</dt><dd>{product.brand}</dd>
                    <dt>Category</dt><dd>{categoryName(product.category)}</dd>
                    <dt>Size</dt><dd>{product.size}</dd>
                    <dt>Sourced from</dt><dd>{product.origin === 'Branded' ? 'UK supermarkets' : `${product.origin}, United Kingdom`}</dd>
                    <dt>Dietary</dt><dd>{product.dietary.join(', ')}</dd>
                  </dl>
                )}
                {tab === 'delivery' && <p>Lagos Mainland ₦2,500 · Lagos Island ₦3,500 · Free on orders over ₦50,000. Interstate delivery in 2–4 working days via trusted courier partners.</p>}
                {tab === 'storage' && <p>Store in a cool, dry place away from direct sunlight. Chocolate items are packed with care during hot Lagos afternoons. Always check the pack for full ingredients and allergen information.</p>}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="section">
            <div className="section__head"><div><p className="kicker">You might also crave</p><h2>Related treats</h2></div></div>
            <div className="pgrid pgrid--home">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
