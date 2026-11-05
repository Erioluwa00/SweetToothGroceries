import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard, { Stars } from '../components/ProductCard';
import { EmptyIcon } from '../components/CartDrawer';
import Icon from '../components/Icon';
import {
  BRANDS, CATEGORIES, DIETARY, FLAVOURS, MAX_PRICE, ORIGINS, PACK_SIZES, PRODUCTS, categoryName, formatNaira,
} from '../data/products';

const LIST_KEYS = ['cat', 'brand', 'origin', 'flavour', 'diet', 'pack'];
const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'best', label: 'Best sellers' },
  { id: 'new', label: 'New in' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
  { id: 'az', label: 'Name: A – Z' },
];
const PER_PAGE_OPTIONS = [12, 24, 48];

// Page numbers with ellipses, e.g. 1 … 4 5 6 … 10
function pageList(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => set.add(n));
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => set.add(n));
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push('gap-' + n);
    out.push(n);
  });
  return out;
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pager" aria-label="Pagination">
      <button className="pager__nav" disabled={page === 1} onClick={() => onChange(page - 1)}>
        <Icon name="chevron" size={18} className="flip" /> <span>Previous</span>
      </button>
      <div className="pager__pages">
        {pageList(page, totalPages).map((n) =>
          typeof n === 'string'
            ? <span key={n} className="pager__gap">…</span>
            : <button key={n} className={`pager__num ${n === page ? 'is-on' : ''}`} aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)}>{n}</button>
        )}
      </div>
      <span className="pager__mobile">Page {page} of {totalPages}</span>
      <button className="pager__nav" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        <span>Next</span> <Icon name="chevron" size={18} />
      </button>
    </nav>
  );
}

const PRICE_PRESETS = [
  { label: 'Under ₦5k', min: 0, max: 5000 },
  { label: '₦5k – ₦10k', min: 5000, max: 10000 },
  { label: 'Over ₦10k', min: 10000, max: MAX_PRICE },
];

function readFilters(params) {
  const f = {};
  LIST_KEYS.forEach((k) => (f[k] = params.get(k) ? params.get(k).split(',') : []));
  f.q = params.get('q') || '';
  f.min = Number(params.get('min')) || 0;
  f.max = Number(params.get('max')) || MAX_PRICE;
  f.rating = Number(params.get('rating')) || 0;
  f.instock = params.get('instock') === '1';
  f.deals = params.get('deals') === '1';
  f.isnew = params.get('isnew') === '1';
  f.sort = params.get('sort') || 'featured';
  f.page = Math.max(1, Number(params.get('page')) || 1);
  f.per = PER_PAGE_OPTIONS.includes(Number(params.get('per'))) ? Number(params.get('per')) : PER_PAGE_OPTIONS[0];
  return f;
}

// Apply every active filter except `skip`, so facet counts stay honest.
function applyFilters(f, skip) {
  const q = f.q.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    if (q) {
      const hay = `${p.name} ${p.brand} ${categoryName(p.category)} ${p.flavours.join(' ')} ${p.origin}`.toLowerCase();
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    if (skip !== 'cat' && f.cat.length && !f.cat.includes(p.category)) return false;
    if (skip !== 'brand' && f.brand.length && !f.brand.includes(p.brand)) return false;
    if (skip !== 'origin' && f.origin.length && !f.origin.includes(p.origin)) return false;
    if (skip !== 'flavour' && f.flavour.length && !f.flavour.some((x) => p.flavours.includes(x))) return false;
    if (skip !== 'diet' && f.diet.length && !f.diet.every((x) => p.dietary.includes(x))) return false;
    if (skip !== 'pack' && f.pack.length && !f.pack.includes(p.pack)) return false;
    if (skip !== 'price' && (p.price < f.min || p.price > f.max)) return false;
    if (f.rating && p.rating < f.rating) return false;
    if (f.instock && p.stock === 'out') return false;
    if (f.deals && !p.oldPrice) return false;
    if (f.isnew && !p.isNew) return false;
    return true;
  });
}

function sortProducts(list, sort) {
  const l = [...list];
  switch (sort) {
    case 'best': return l.sort((a, b) => b.bestseller - a.bestseller || b.reviews - a.reviews);
    case 'new': return l.sort((a, b) => b.isNew - a.isNew);
    case 'price-asc': return l.sort((a, b) => a.price - b.price);
    case 'price-desc': return l.sort((a, b) => b.price - a.price);
    case 'rating': return l.sort((a, b) => b.rating - a.rating);
    case 'az': return l.sort((a, b) => a.name.localeCompare(b.name));
    default: return l.sort((a, b) => (a.stock === 'out') - (b.stock === 'out') || b.bestseller - a.bestseller);
  }
}

const countBy = (list, fn) => list.reduce((m, p) => {
  [].concat(fn(p)).forEach((k) => (m[k] = (m[k] || 0) + 1));
  return m;
}, {});

function Section({ title, children, defaultOpen = true, active }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`fsec ${open ? 'is-open' : ''}`}>
      <button className="fsec__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}{active > 0 && <em>{active}</em>}</span>
        <Icon name="down" size={18} />
      </button>
      {open && <div className="fsec__body">{children}</div>}
    </div>
  );
}

function Check({ checked, onChange, label, count, swatch }) {
  return (
    <label className={`fcheck ${count === 0 && !checked ? 'is-empty' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="fcheck__box"><Icon name="chevron" size={12} strokeWidth={3} /></span>
      {swatch && <span className="fcheck__swatch">{swatch}</span>}
      <span className="fcheck__label">{label}</span>
      {count != null && <span className="fcheck__count">{count}</span>}
    </label>
  );
}

function PriceFilter({ min, max, onCommit }) {
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);
  useEffect(() => { setLo(min); setHi(max); }, [min, max]);
  useEffect(() => {
    if (lo === min && hi === max) return;
    const t = setTimeout(() => onCommit(lo, hi), 300);
    return () => clearTimeout(t);
  }, [lo, hi]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = 500;
  const pct = (v) => (v / MAX_PRICE) * 100;
  return (
    <div className="price">
      <div className="price__values">
        <span>{formatNaira(lo)}</span>
        <span>{hi >= MAX_PRICE ? `${formatNaira(MAX_PRICE)}+` : formatNaira(hi)}</span>
      </div>
      <div className="range" style={{ '--lo': `${pct(lo)}%`, '--hi': `${pct(hi)}%` }}>
        <input type="range" min={0} max={MAX_PRICE} step={step} value={lo} aria-label="Minimum price"
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - step))} />
        <input type="range" min={0} max={MAX_PRICE} step={step} value={hi} aria-label="Maximum price"
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + step))} />
      </div>
      <div className="pills pills--tight">
        {PRICE_PRESETS.map((p) => (
          <button key={p.label} className={`pill ${min === p.min && max === p.max ? 'is-on' : ''}`}
            onClick={() => (min === p.min && max === p.max ? onCommit(0, MAX_PRICE) : onCommit(p.min, p.max))}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const f = useMemo(() => readFilters(params), [params]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState('grid');
  const [brandQuery, setBrandQuery] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [search, setSearch] = useState(f.q);

  useEffect(() => setSearch(f.q), [f.q]);
  useEffect(() => {
    if (search === f.q) return;
    const t = setTimeout(() => update({ q: search || null }), 250);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function update(changes) {
    const next = new URLSearchParams(params);
    if (!('page' in changes)) next.delete('page'); // any filter change goes back to page 1
    Object.entries(changes).forEach(([k, v]) => {
      if (v == null || v === '' || v === false || (Array.isArray(v) && !v.length)) next.delete(k);
      else next.set(k, Array.isArray(v) ? v.join(',') : v === true ? '1' : String(v));
    });
    setParams(next, { replace: true });
  }
  const toggle = (key, val) => update({ [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val] });
  const clearAll = () => { setSearch(''); setParams(f.sort !== 'featured' ? { sort: f.sort } : {}, { replace: true }); };

  const results = useMemo(() => sortProducts(applyFilters(f), f.sort), [f]);
  const totalPages = Math.max(1, Math.ceil(results.length / f.per));
  const page = Math.min(f.page, totalPages);
  const start = (page - 1) * f.per;
  const pageItems = results.slice(start, start + f.per);
  const resultsRef = useRef(null);
  const goToPage = (n) => {
    update({ page: n > 1 ? n : null });
    const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  const counts = useMemo(() => ({
    cat: countBy(applyFilters(f, 'cat'), (p) => p.category),
    brand: countBy(applyFilters(f, 'brand'), (p) => p.brand),
    origin: countBy(applyFilters(f, 'origin'), (p) => p.origin),
    flavour: countBy(applyFilters(f, 'flavour'), (p) => p.flavours),
    diet: countBy(applyFilters(f, 'diet'), (p) => p.dietary),
    pack: countBy(applyFilters(f, 'pack'), (p) => p.pack),
  }), [f]);

  const chips = [];
  if (f.q) chips.push({ label: `“${f.q}”`, clear: () => { setSearch(''); update({ q: null }); } });
  f.cat.forEach((v) => chips.push({ label: categoryName(v), clear: () => toggle('cat', v) }));
  ['brand', 'origin', 'flavour', 'diet', 'pack'].forEach((k) => f[k].forEach((v) => chips.push({ label: v, clear: () => toggle(k, v) })));
  if (f.min > 0 || f.max < MAX_PRICE) chips.push({ label: `${formatNaira(f.min)} – ${formatNaira(f.max)}`, clear: () => update({ min: null, max: null }) });
  if (f.rating) chips.push({ label: `${f.rating}+ stars`, clear: () => update({ rating: null }) });
  if (f.instock) chips.push({ label: 'In stock', clear: () => update({ instock: null }) });
  if (f.deals) chips.push({ label: 'On sale', clear: () => update({ deals: null }) });
  if (f.isnew) chips.push({ label: 'New in', clear: () => update({ isnew: null }) });

  const brandList = BRANDS.filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()))
    .sort((a, b) =>
      f.brand.includes(b) - f.brand.includes(a) ||
      (counts.brand[b] || 0) - (counts.brand[a] || 0) ||
      a.localeCompare(b));
  const visibleBrands = showAllBrands || brandQuery ? brandList : brandList.slice(0, 7);

  const title = f.cat.length === 1 ? categoryName(f.cat[0]) : f.deals ? "Today's deals" : f.q ? 'Search results' : 'Shop all snacks';

  const filters = (
    <>
      <Section title="Quick filters" active={[f.instock, f.deals, f.isnew].filter(Boolean).length}>
        <div className="toggles">
          {[['instock', 'Hide sold-out items'], ['deals', 'On sale'], ['isnew', 'New arrivals']].map(([k, l]) => (
            <label key={k} className="toggle">
              <span>{l}</span>
              <input type="checkbox" checked={f[k]} onChange={() => update({ [k]: !f[k] })} />
              <span className="toggle__track"><span /></span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Category" active={f.cat.length}>
        {CATEGORIES.map((c) => (
          <Check key={c.id} checked={f.cat.includes(c.id)} onChange={() => toggle('cat', c.id)}
            label={c.name} count={counts.cat[c.id] || 0} swatch={<Icon name={c.icon} size={17} />} />
        ))}
      </Section>

      <Section title="Price" active={f.min > 0 || f.max < MAX_PRICE ? 1 : 0}>
        <PriceFilter min={f.min} max={f.max} onCommit={(lo, hi) => update({ min: lo || null, max: hi >= MAX_PRICE ? null : hi })} />
      </Section>

      <Section title="Brand" active={f.brand.length}>
        <div className="fsearch">
          <Icon name="search" size={16} />
          <input value={brandQuery} onChange={(e) => setBrandQuery(e.target.value)} placeholder={`Search ${BRANDS.length} brands`} aria-label="Search brands" />
        </div>
        {visibleBrands.map((b) => (
          <Check key={b} checked={f.brand.includes(b)} onChange={() => toggle('brand', b)} label={b} count={counts.brand[b] || 0} />
        ))}
        {!brandQuery && brandList.length > 7 && (
          <button className="link-btn" onClick={() => setShowAllBrands(!showAllBrands)}>
            {showAllBrands ? 'Show fewer' : `Show all ${brandList.length} brands`}
          </button>
        )}
        {brandQuery && !brandList.length && <p className="fsec__none">No brand matches “{brandQuery}”</p>}
      </Section>

      <Section title="UK store / range" active={f.origin.length}>
        <div className="pills">
          {ORIGINS.map((o) => (
            <button key={o} className={`pill ${f.origin.includes(o) ? 'is-on' : ''}`} disabled={!counts.origin[o] && !f.origin.includes(o)} onClick={() => toggle('origin', o)}>
              {o === 'Branded' ? 'Big brands' : o} <small>{counts.origin[o] || 0}</small>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Flavour & taste" active={f.flavour.length}>
        <div className="pills">
          {FLAVOURS.map((o) => (
            <button key={o} className={`pill ${f.flavour.includes(o) ? 'is-on' : ''}`} disabled={!counts.flavour[o] && !f.flavour.includes(o)} onClick={() => toggle('flavour', o)}>
              {o} <small>{counts.flavour[o] || 0}</small>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Pack type" active={f.pack.length} defaultOpen={false}>
        {PACK_SIZES.map((o) => (
          <Check key={o} checked={f.pack.includes(o)} onChange={() => toggle('pack', o)} label={o} count={counts.pack[o] || 0} />
        ))}
      </Section>

      <Section title="Dietary" active={f.diet.length} defaultOpen={false}>
        {DIETARY.map((o) => (
          <Check key={o} checked={f.diet.includes(o)} onChange={() => toggle('diet', o)} label={o} count={counts.diet[o] || 0} />
        ))}
      </Section>

      <Section title="Customer rating" active={f.rating ? 1 : 0} defaultOpen={false}>
        {[4.8, 4.5, 4].map((r) => (
          <label key={r} className="fradio">
            <input type="radio" name="rating" checked={f.rating === r} onChange={() => update({ rating: r })} />
            <span className="fradio__dot" />
            <span className="fradio__stars"><Stars rating={r} small /> {r} & up</span>
          </label>
        ))}
        {f.rating > 0 && <button className="link-btn" onClick={() => update({ rating: null })}>Any rating</button>}
      </Section>
    </>
  );

  return (
    <div className="shop">
      <section className="shop-hero">
        <div className="container">
          <p className="crumbs">Home <Icon name="chevron" size={14} /> Shop{f.cat.length === 1 && <> <Icon name="chevron" size={14} /> {categoryName(f.cat[0])}</>}</p>
          <h1>{title}</h1>
          <div className="shop-hero__search">
            <Icon name="search" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by snack, brand or flavour…" aria-label="Search snacks" />
            {search && <button onClick={() => setSearch('')} aria-label="Clear search"><Icon name="close" size={18} /></button>}
          </div>
          <div className="catrail">
            <button className={`catrail__item ${f.cat.length === 0 ? 'is-on' : ''}`} onClick={() => update({ cat: null })}>
              <span><Icon name="sparkle" size={17} /></span>All
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`catrail__item ${f.cat.includes(c.id) ? 'is-on' : ''}`} style={{ '--c': c.color }}
                onClick={() => update({ cat: f.cat.length === 1 && f.cat[0] === c.id ? null : [c.id] })}>
                <span><Icon name={c.icon} size={18} /></span>{c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container shop__layout">
        <aside className={`filters ${mobileOpen ? 'is-open' : ''}`}>
          <div className="filters__backdrop" onClick={() => setMobileOpen(false)} />
          <div className="filters__panel">
            <div className="filters__head">
              <h3><Icon name="filter" size={20} /> Filters</h3>
              {chips.length > 0 && <button className="link-btn" onClick={clearAll}>Clear all</button>}
              <button className="icon-btn filters__close" onClick={() => setMobileOpen(false)} aria-label="Close filters"><Icon name="close" /></button>
            </div>
            <div className="filters__scroll">{filters}</div>
            <div className="filters__foot">
              <button className="btn btn--green btn--block" onClick={() => setMobileOpen(false)}>
                Show {results.length} result{results.length === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </aside>

        <section className="results" ref={resultsRef}>
          <div className="toolbar">
            <button className="btn btn--outline toolbar__filter" onClick={() => setMobileOpen(true)}>
              <Icon name="filter" size={18} /> Filters {chips.length > 0 && <em>{chips.length}</em>}
            </button>
            <p className="toolbar__count">
              {results.length
                ? <>Showing <strong>{start + 1}–{start + pageItems.length}</strong> of {results.length} snacks</>
                : <>No snacks found</>}
            </p>
            <div className="toolbar__right">
              <label className="sort">
                <span>Sort</span>
                <select value={f.sort} onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}>
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <Icon name="down" size={16} />
              </label>
              <div className="viewtoggle" role="group" aria-label="Layout">
                <button className={view === 'grid' ? 'is-on' : ''} onClick={() => setView('grid')} aria-label="Grid view"><Icon name="grid" size={18} /></button>
                <button className={view === 'list' ? 'is-on' : ''} onClick={() => setView('list')} aria-label="List view"><Icon name="list" size={18} /></button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="chips">
              {chips.map((c, i) => (
                <button key={i} className="chip" onClick={c.clear}>{c.label}<Icon name="close" size={14} strokeWidth={2.4} /></button>
              ))}
              <button className="link-btn" onClick={clearAll}>Clear all</button>
            </div>
          )}

          {results.length ? (
            <div className={`pgrid ${view === 'list' ? 'pgrid--list' : ''}`}>
              {pageItems.map((p) => <ProductCard key={p.id} product={p} layout={view} />)}
            </div>
          ) : null}
          {results.length ? (
            <div className="pager-wrap">
              <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
              <label className="perpage">
                <span>Show</span>
                <select value={f.per} onChange={(e) => update({ per: Number(e.target.value) === PER_PAGE_OPTIONS[0] ? null : e.target.value })}>
                  {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <span>per page</span>
              </label>
            </div>
          ) : (
            <div className="noresults">
              <EmptyIcon name="search" />
              <h3>No snacks match those filters</h3>
              <p>Try removing a filter or two — or send us a request on the contact page and we'll source it from the UK for you.</p>
              <button className="btn btn--green" onClick={clearAll}>Clear all filters</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
