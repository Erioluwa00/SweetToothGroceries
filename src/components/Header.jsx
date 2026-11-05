import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import Icon from './Icon';

const messages = [
  ['plane', 'Fresh UK stock lands every week'],
  ['truck', 'Same-day delivery across Lagos'],
  ['card', 'Pay securely by card, transfer or on delivery'],
  ['gift', 'Gift boxes & hampers available'],
];

export default function Header() {
  const { count, wishlist, setCartOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const [bump, setBump] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!count) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [count]);

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop');
    setQ('');
  };

  return (
    <>
      <div className="announce">
        <div className="announce__track">
          {[...messages, ...messages].map(([icon, text], i) => (
            <span key={i}><Icon name={icon} size={15} strokeWidth={2} />{text}</span>
          ))}
        </div>
      </div>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header__inner">
          <button className="icon-btn header__burger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <Link to="/" className="header__logo" aria-label="Sweettooth Groceries home">
            <img src="/brand/logo.png" alt="Sweettooth Groceries" />
          </Link>
          <nav className="header__nav">
            <NavLink to="/" end>Home</NavLink>
            <div className="nav-drop">
              <NavLink to="/shop">Shop <Icon name="down" size={16} /></NavLink>
              <div className="nav-drop__panel">
                <div className="nav-drop__grid">
                  {CATEGORIES.map((c) => (
                    <Link key={c.id} to={`/shop?cat=${c.id}`} className="nav-drop__item">
                      <span style={{ background: c.color }}><Icon name={c.icon} size={18} /></span>
                      {c.name}
                    </Link>
                  ))}
                </div>
                <Link to="/shop?sort=new" className="nav-drop__cta">See what just landed <Icon name="arrow" size={16} /></Link>
              </div>
            </div>
            <Link to="/shop?deals=1" className={location.search.includes("deals=1") ? "active" : ""}>Deals</Link>
            <NavLink to="/about">Our Story</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <form className="header__search" onSubmit={submit} role="search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Biscoff, Doritos, M&S…" aria-label="Search products" />
          </form>
          <div className="header__actions">
            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
              <Icon name="heart" />
              {wishlist.length > 0 && <span className="dot-count">{wishlist.length}</span>}
            </Link>
            <button className={`icon-btn cart-btn ${bump ? 'bump' : ''}`} onClick={() => setCartOpen(true)} aria-label="Open basket">
              <Icon name="bag" />
              {count > 0 && <span className="dot-count">{count}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`mnav ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mnav__backdrop" onClick={() => setMenuOpen(false)} />
        <aside className="mnav__panel">
          <div className="mnav__head">
            <img src="/brand/logo.png" alt="Sweettooth Groceries" />
            <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu"><Icon name="close" /></button>
          </div>
          <form className="header__search header__search--mobile" onSubmit={submit} role="search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search snacks…" aria-label="Search products" />
          </form>
          <nav className="mnav__links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/shop">Shop all</NavLink>
            <Link to="/shop?deals=1" className={location.search.includes("deals=1") ? "active" : ""}>Deals</Link>
            <NavLink to="/wishlist">Wishlist</NavLink>
            <NavLink to="/about">Our Story</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <p className="mnav__label">Shop by category</p>
          <div className="mnav__cats">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/shop?cat=${c.id}`} style={{ '--c': c.color }}>
                <span><Icon name={c.icon} size={22} /></span>{c.name}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
