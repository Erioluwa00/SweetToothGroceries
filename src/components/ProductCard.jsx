import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatNaira, categoryName } from '../data/products';
import Icon from './Icon';

export function Stars({ rating, reviews, small }) {
  return (
    <span className={`stars ${small ? 'stars--small' : ''}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={small ? 13 : 16} filled={rating >= i - 0.25} strokeWidth={1.5} />
      ))}
      {reviews != null && <span className="stars__count">({reviews})</span>}
    </span>
  );
}

// Add button that flips to "Added", then becomes a quantity stepper.
export function AddToBasket({ product, size = 'md' }) {
  const { cart, addToCart, setQty } = useStore();
  const qty = cart[product.id] || 0;
  const [flash, setFlash] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  if (product.stock === 'out') {
    return <button className={`addbtn addbtn--${size}`} disabled>Sold out</button>;
  }

  const add = () => {
    addToCart(product.id);
    setFlash(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 1100);
  };

  if (qty === 0) {
    return (
      <button className={`addbtn addbtn--${size}`} onClick={add} aria-label={`Add ${product.name} to basket`}>
        <Icon name="plus" size={18} strokeWidth={2.4} /><span>Add</span>
      </button>
    );
  }

  if (flash) {
    return (
      <div className={`addbtn addbtn--${size} addbtn--added`} role="status">
        <Icon name="check" size={18} strokeWidth={2.6} /><span>Added</span>
      </div>
    );
  }

  return (
    <div className={`addbtn addbtn--${size} addbtn--stepper`} aria-label={`${qty} in basket`}>
      <button onClick={() => setQty(product.id, qty - 1)} aria-label="Remove one">
        <Icon name={qty === 1 ? 'trash' : 'minus'} size={qty === 1 ? 16 : 18} strokeWidth={2.4} />
      </button>
      <span key={qty} className="addbtn__qty">{qty}</span>
      <button onClick={() => setQty(product.id, qty + 1)} aria-label="Add one more">
        <Icon name="plus" size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
}

export default function ProductCard({ product, layout = 'grid' }) {
  const { wishlist, toggleWish, cart } = useStore();
  const wished = wishlist.includes(product.id);
  const out = product.stock === 'out';
  const inCart = cart[product.id] || 0;
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <article className={`pcard pcard--${layout} ${out ? 'is-out' : ''} ${inCart ? 'is-incart' : ''}`}>
      <Link to={`/product/${product.id}`} className="pcard__media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="pcard__badges">
          {product.isNew && <span className="badge badge--new">New in</span>}
          {discount > 0 && <span className="badge badge--sale">-{discount}%</span>}
          {product.stock === 'low' && <span className="badge badge--low">Few left</span>}
          {out && <span className="badge badge--out">Sold out</span>}
        </div>
        {inCart > 0 && <span className="pcard__incart"><Icon name="bag" size={14} strokeWidth={2.2} /> {inCart} in basket</span>}
      </Link>
      <button
        className={`pcard__wish ${wished ? 'is-on' : ''}`}
        onClick={() => toggleWish(product.id)}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Icon name="heart" size={18} filled={wished} />
      </button>
      <div className="pcard__body">
        <div className="pcard__meta">
          <span className="pcard__brand">{product.brand}</span>
          <span className="pcard__dot" />
          <span>{categoryName(product.category)}</span>
        </div>
        <Link to={`/product/${product.id}`} className="pcard__name">
          {product.name}
        </Link>
        {layout === 'list' && <p className="pcard__desc">{product.desc}</p>}
        <Stars rating={product.rating} reviews={product.reviews} small />
        <div className="pcard__foot">
          <div className="pcard__price">
            <strong>{formatNaira(product.price)}</strong>
            {product.oldPrice && <s>{formatNaira(product.oldPrice)}</s>}
            <small>{product.size}</small>
          </div>
          <AddToBasket product={product} />
        </div>
      </div>
    </article>
  );
}
