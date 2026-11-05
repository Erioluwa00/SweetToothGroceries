import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard, { Stars } from '../components/ProductCard';
import Icon from '../components/Icon';
import { CATEGORIES, INSTAGRAM, PRODUCTS, getProduct } from '../data/products';

const brandStrip = ['M&S Food', 'Tesco', 'Lotus Biscoff', 'Ferrero', "Kellogg's", "McVitie's", 'Doritos', 'Mars', 'Nestlé', "Wrigley's", 'LU', 'Morrisons'];

const reviews = [
  { name: 'Adaeze O.', area: 'Lekki', text: 'The M&S shortbread tin was the star of our Christmas hampers. Delivery was same day and everything was well packed!', rating: 5 },
  { name: 'Tunde B.', area: 'Yaba', text: "Finally a place in Lagos that actually has Biscoff and the Doritos Heatwave. Prices are fair and checkout takes less than a minute.", rating: 5 },
  { name: 'Kemi A.', area: 'Ikeja GRA', text: 'My kids are obsessed with the Kellogg\'s mini packs. Ordering on the site is so easy and delivery is always on time.', rating: 5 },
];

function Rail({ title, kicker, link, products }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="kicker">{kicker}</p>
            <h2>{title}</h2>
          </div>
          <div className="section__actions">
            <button className="round-btn" onClick={() => scroll(-1)} aria-label="Scroll left"><Icon name="chevron" size={20} className="flip" /></button>
            <button className="round-btn" onClick={() => scroll(1)} aria-label="Scroll right"><Icon name="chevron" size={20} /></button>
            <Link to={link} className="see-all">See all <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
        <div className="rail" ref={ref}>
          {products.map((p) => <div className="rail__item" key={p.id}><ProductCard product={p} /></div>)}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const newIn = PRODUCTS.filter((p) => p.isNew);
  const best = PRODUCTS.filter((p) => p.bestseller).slice(0, 8);
  const heroImgs = ['lotus-biscoff', 'ms-shortbread-petticoat', 'doritos-chilli-heatwave', 'ms-swiss-crispy-clouds'].map(getProduct);
  const insta = ['ms-shortbread-rounds', 'celebrations', 'nutella-biscuits', 'kelloggs-honey-pops', 'ms-hot-maple-popcorn', 'mcvities-wafer-rolls'].map(getProduct);

  return (
    <>
      <section className="hero">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="hero__tag"><span className="flag">GB</span> Imported weekly from Great Britain</span>
            <h1>
              Fresh &amp; <span className="crunch">crunchy</span> treats,
              <br />straight to your door in <span className="hl">Lagos</span>.
            </h1>
            <p>Biscuits, chocolates, crisps, sweets and cereal from M&amp;S, Tesco and the big UK brands you love — hand-picked by Bims and delivered same day.</p>
            <div className="hero__ctas">
              <Link to="/shop" className="btn btn--orange btn--lg">Shop all snacks <Icon name="arrow" size={18} /></Link>
              <Link to="/shop?deals=1" className="btn btn--white btn--lg"><Icon name="tag" size={20} /> See today's deals</Link>
            </div>
            <ul className="hero__stats">
              <li><strong>3,100+</strong><span>happy snackers</span></li>
              <li><strong>4,800+</strong><span>treats posted</span></li>
              <li><strong>Same day</strong><span>Lagos delivery</span></li>
            </ul>
          </div>
          <div className="hero__art" aria-hidden="true">
            {heroImgs.map((p, i) => (
              <Link to={`/product/${p.id}`} key={p.id} className={`polaroid polaroid--${i + 1}`} tabIndex={-1}>
                <img src={p.image} alt="" />
                <span>{p.brand}</span>
              </Link>
            ))}
            <div className="sticker sticker--bims">Bims!<small>approved</small></div>
            <div className="sticker sticker--new">NEW<br />IN</div>
          </div>
        </div>
      </section>

      <div className="brandstrip" aria-label="Brands we stock">
        <div className="brandstrip__track">
          {[...brandStrip, ...brandStrip].map((b, i) => <span key={i}>{b}<Icon name="sparkle" size={18} className="brandstrip__mark" filled /></span>)}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="kicker">Find your fix</p>
              <h2>Shop by category</h2>
            </div>
            <Link to="/shop" className="see-all">Browse everything <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="cats">
            {CATEGORIES.map((c) => {
              const items = PRODUCTS.filter((p) => p.category === c.id);
              return (
                <Link key={c.id} to={`/shop?cat=${c.id}`} className="cat" style={{ '--c': c.color }}>
                  <div className="cat__imgs">
                    {items.slice(0, 2).map((p) => <img key={p.id} src={p.image} alt="" loading="lazy" />)}
                  </div>
                  <div className="cat__text">
                    <span className="cat__icon"><Icon name={c.icon} size={20} /></span>
                    <h3>{c.name}</h3>
                    <p>{items.length} products</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Rail kicker="Fresh off the plane" title="Just landed" link="/shop?isnew=1" products={newIn} />

      <section className="section section--tight">
        <div className="container promos">
          <Link to="/shop?pack=Gift%20box" className="promo promo--purple">
            <div>
              <p className="kicker">Gifting season</p>
              <h3>Gift boxes, tins &amp; hampers</h3>
              <p>Shortbread tins, Celebrations, cookie selections — wrapped and ready.</p>
              <span className="btn btn--white">Shop gifts <Icon name="gift" size={18} /></span>
            </div>
            <img src="/products/ms-shortbread-rounds.jpg" alt="" />
          </Link>
          <Link to="/shop?deals=1" className="promo promo--orange">
            <div>
              <p className="kicker">This week only</p>
              <h3>Sweet deals up to 15% off</h3>
              <p>Grab your favourites for less while stock lasts.</p>
              <span className="btn btn--white">See deals <Icon name="arrow" size={18} /></span>
            </div>
            <img src="/products/celebrations.jpg" alt="" />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="kicker">Lagos can't get enough</p>
              <h2>Best sellers</h2>
            </div>
            <Link to="/shop?sort=best" className="see-all">See all <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="pgrid pgrid--home">
            {best.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="section how">
        <div className="container">
          <div className="section__head section__head--center">
            <p className="kicker">Easy as 1, 2, 3, 4</p>
            <h2>How ordering works</h2>
          </div>
          <ol className="steps">
            {[
              ['search', 'Browse & filter', 'Find exactly what you crave by brand, flavour, price or category.'],
              ['bag', 'Fill your basket', 'Add as many treats as you like — free delivery over ₦50,000.'],
              ['card', 'Checkout securely', 'Pay by card, bank transfer or on delivery — it takes under a minute.'],
              ['truck', 'Delivered fresh', 'Same-day delivery across Lagos. Nationwide shipping available.'],
            ].map(([icon, t, d], i) => (
              <li key={t}>
                <span className="steps__num">{i + 1}</span>
                <span className="steps__icon"><Icon name={icon} size={28} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="kicker">Big names, small prices</p>
              <h2>Shop by brand</h2>
            </div>
          </div>
          <div className="brands">
            {[...new Set(PRODUCTS.map((p) => p.brand))].map((b) => (
              <Link key={b} to={`/shop?brand=${encodeURIComponent(b)}`} className="brandtile">
                <strong>{b}</strong>
                <small>{PRODUCTS.filter((p) => p.brand === b).length} items</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section reviews">
        <div className="container">
          <div className="section__head section__head--center">
            <p className="kicker">Sweet words</p>
            <h2>Loved by snackers across Lagos</h2>
          </div>
          <div className="reviews__grid">
            {reviews.map((r) => (
              <figure key={r.name} className="review">
                <div className="review__stars"><Stars rating={r.rating} /></div>
                <blockquote>“{r.text}”</blockquote>
                <figcaption><span className="avatar">{r.name[0]}</span><div><strong>{r.name}</strong><small>{r.area}, Lagos</small></div></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="insta">
            <div className="insta__head">
              <span className="insta__ring"><img src="/brand/logo-square.png" alt="" /></span>
              <div>
                <h2>@sweettoothgroceriesng</h2>
                <p>Follow along for new stock, restocks and giveaways.</p>
              </div>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn btn--green"><Icon name="instagram" size={18} /> Follow</a>
            </div>
            <div className="insta__grid">
              {insta.map((p) => (
                <a key={p.id} href={INSTAGRAM} target="_blank" rel="noreferrer" className="insta__tile">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <span><Icon name="heart" filled size={18} /> {p.reviews * 3}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
