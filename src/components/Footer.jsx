import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, INSTAGRAM, PHONE_DISPLAY, PHONE_TEL } from '../data/products';
import Icon from './Icon';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="footer">
      <div className="footer__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0 40c120-30 240-30 360 0s240 30 360 0 240-30 360 0 240 30 360 0v40H0z" /></svg>
      </div>
      <div className="container">
        <div className="footer__news">
          <div className="footer__news-copy">
            <span className="footer__news-icon"><Icon name="mail" size={26} /></span>
            <div>
              <h3>Be first to know when new stock lands</h3>
              <p>Weekly drops, restock alerts and members-only deals. No spam, just snacks.</p>
            </div>
          </div>
          {done ? (
            <p className="footer__thanks"><Icon name="check" size={22} strokeWidth={2.6} /> You're on the list!</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}>
              <input type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
              <button className="btn btn--orange">Subscribe</button>
            </form>
          )}
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo"><img src="/brand/logo.png" alt="Sweettooth Groceries" /></div>
            <p>An online grocery store bringing fresh and crunchy treats from Great Britain straight to your door in Lagos.</p>
            <div className="footer__social">
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram"><Icon name="instagram" /></a>
              <a href={`tel:${PHONE_TEL}`} aria-label="Call"><Icon name="phone" /></a>
            </div>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}><Link to={`/shop?cat=${c.id}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><Link to="/contact">Contact us</Link></li>
              <li><Link to="/contact#faq">Delivery & FAQs</Link></li>
              <li><Link to="/about">Our story</Link></li>
              <li><Link to="/wishlist">Your wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul className="footer__contact">
              <li><Icon name="phone" size={18} /> {PHONE_DISPLAY}</li>
              <li><Icon name="pin" size={18} /> Lagos, Nigeria</li>
              <li><Icon name="clock" size={18} /> Mon – Sat, 9am – 7pm</li>
            </ul>
            <div className="footer__pay">
              <span><Icon name="card" size={16} /> Card</span>
              <span><Icon name="bank" size={16} /> Transfer</span>
              <span><Icon name="cash" size={16} /> On delivery</span>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Sweettooth Groceries NG. All rights reserved.</span>
          <span>Made with a sweet tooth in Lagos</span>
        </div>
      </div>
    </footer>
  );
}
