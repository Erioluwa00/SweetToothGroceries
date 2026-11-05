import { useState } from 'react';
import { Link } from 'react-router-dom';
import { INSTAGRAM, PHONE_DISPLAY, PHONE_TEL } from '../data/products';
import Icon from '../components/Icon';
import { EmptyIcon } from '../components/CartDrawer';

const FAQS = [
  ['How do I place an order?', 'Add items to your basket, head to checkout, enter your delivery details and pay by card, bank transfer or on delivery. You get an order number and confirmation straight away.'],
  ['How much is delivery?', 'Lagos Mainland ₦2,500 and Lagos Island / Lekki ₦3,500. Orders over ₦50,000 get free Lagos delivery. Interstate delivery starts from ₦6,000.'],
  ['How fast will I get my order?', 'Orders confirmed before 2pm are delivered the same day within Lagos. Interstate orders take 2–4 working days.'],
  ['Are your products original?', 'Yes! Every item is imported directly from UK stores like M&S, Tesco and Morrisons. We never sell fakes.'],
  ['Can you source something I can’t find?', 'Absolutely. Send us the product name using the form above and we’ll try to bring it in on our next shipment.'],
  ['Do you do gift hampers?', 'Yes — we make custom hampers for birthdays, Christmas, corporate gifting and more. Message us with your budget.'],
];

export default function Contact() {
  const [open, setOpen] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <div className="contact">
      <section className="page-hero">
        <div className="container">
          <p className="kicker">Say hello</p>
          <h1>We'd love to hear from you</h1>
          <p>Questions about an order, a special request or a hamper idea? Send us a message or give us a call.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact__grid">
          <div className="contact__cards">
            <a href={`tel:${PHONE_TEL}`} className="ccard ccard--main"><Icon name="phone" size={28} /><div><strong>Call us</strong><span>{PHONE_DISPLAY}</span></div></a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="ccard"><Icon name="instagram" size={28} /><div><strong>Instagram</strong><span>@sweettoothgroceriesng</span></div></a>
            <div className="ccard"><Icon name="pin" size={28} /><div><strong>Based in</strong><span>Lagos, Nigeria · Mon–Sat 9am–7pm</span></div></div>
          </div>

          <form className="cform" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            {sent ? (
              <div className="success">
                <EmptyIcon name="mail" />
                <h3>Message received!</h3>
                <p>Thanks for reaching out — we'll get back to you shortly.</p>
              </div>
            ) : (
              <>
                <h3>Send us a message</h3>
                <div className="fields fields--2">
                  <input required placeholder="Your name" aria-label="Your name" />
                  <input required type="tel" placeholder="Phone number" aria-label="Phone number" />
                </div>
                <div className="fields">
                  <select aria-label="Topic" defaultValue="">
                    <option value="" disabled>What's it about?</option>
                    <option>An existing order</option>
                    <option>Product request</option>
                    <option>Gift hampers</option>
                    <option>Wholesale / bulk</option>
                    <option>Something else</option>
                  </select>
                  <textarea required rows={5} placeholder="Your message" aria-label="Your message" />
                </div>
                <button className="btn btn--green btn--lg">Send message <Icon name="arrow" size={18} /></button>
              </>
            )}
          </form>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container faq">
          <div className="section__head section__head--center">
            <p className="kicker">Good to know</p>
            <h2>Frequently asked questions</h2>
          </div>
          {FAQS.map(([q, a], i) => (
            <div key={q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {q}<Icon name="plus" size={20} />
              </button>
              <div className="faq__a"><p>{a}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
