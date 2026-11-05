import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

export default function About() {
  return (
    <div className="about">
      <section className="page-hero">
        <div className="container">
          <p className="kicker">Our story</p>
          <h1>A little piece of the UK, <span className="hl">sweetened</span> for Lagos.</h1>
          <p>Sweettooth Groceries started with one simple craving — the biscuits, chocolates and crisps we grew up loving from British supermarket shelves. Now we bring them home to you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container about__split">
          <div className="about__collage">
            <img src="/products/ms-shortbread-petticoat.jpg" alt="M&S shortbread tin" />
            <img src="/products/lotus-biscoff.jpg" alt="Lotus Biscoff" />
            <img src="/products/ms-swiss-nutty-clouds.jpg" alt="M&S Swiss chocolate" />
          </div>
          <div className="about__text">
            <h2>Hand-picked. Imported weekly. Delivered fresh.</h2>
            <p>Every week we restock from M&amp;S, Tesco, Morrisons and the UK's favourite brands — checking every best-before date and packing every order with care.</p>
            <p>With over 4,800 products shared on our Instagram and a growing family of more than 3,000 snack lovers, we're proud to be Lagos' go-to online store for authentic British treats.</p>
            <ul className="about__values">
              <li><Icon name="plane" /><div><strong>Authentic UK stock</strong><span>No fakes, no knock-offs — ever.</span></div></li>
              <li><Icon name="truck" /><div><strong>Fast Lagos delivery</strong><span>Same day on most orders.</span></div></li>
              <li><Icon name="card" /><div><strong>Easy, secure checkout</strong><span>Card, transfer or pay on delivery.</span></div></li>
            </ul>
            <Link to="/shop" className="btn btn--green btn--lg">Start shopping <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section numbers">
        <div className="container numbers__grid">
          <div><strong>4,894</strong><span>products showcased</span></div>
          <div><strong>3,175</strong><span>Instagram family</span></div>
          <div><strong>12+</strong><span>UK brands stocked</span></div>
          <div><strong>1 day</strong><span>Lagos delivery</span></div>
        </div>
      </section>
    </div>
  );
}
