// Demo catalogue — photos taken from @sweettoothgroceriesng's Instagram feed.
// Prices are placeholders for the demo.

export const CATEGORIES = [
  { id: 'biscuits', name: 'Biscuits & Cookies', icon: 'cookie', color: '#f6c97a' },
  { id: 'chocolate', name: 'Chocolate', icon: 'chocolate', color: '#b97a56' },
  { id: 'sweets', name: 'Sweets & Toffees', icon: 'candy', color: '#f29bb5' },
  { id: 'savoury', name: 'Crisps & Savoury', icon: 'chips', color: '#f08a4b' },
  { id: 'cereal', name: 'Cereal & Breakfast', icon: 'bowl', color: '#f3d34a' },
  { id: 'gum', name: 'Gum & Mints', icon: 'leaf', color: '#7cc89a' },
];

export const FLAVOURS = ['Chocolatey', 'Buttery', 'Caramel & Toffee', 'Nutty', 'Salty', 'Spicy', 'Fruity', 'Minty', 'Creamy', 'Malty'];
export const DIETARY = ['Vegetarian', 'Sugar-free', 'Contains nuts', 'Gluten'];
export const PACK_SIZES = ['Single', 'Sharing', 'Multipack', 'Gift box'];
export const ORIGINS = ['M&S', 'Tesco', 'Morrisons', 'Branded'];

const p = (o) => ({
  image: `/products/${o.id}.jpg`,
  oldPrice: null,
  isNew: false,
  bestseller: false,
  stock: 'in',
  dietary: ['Vegetarian'],
  ...o,
});

export const PRODUCTS = [
  p({ id: 'ms-choc-milk-biscuits', name: 'Milk Chocolate Coated Milk Biscuits', brand: 'M&S', origin: 'M&S', category: 'biscuits', price: 4500, size: '200g', pack: 'Single', flavours: ['Chocolatey', 'Malty'], rating: 4.8, reviews: 112, isNew: true, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: 'Crisp milk biscuits half-dipped in smooth milk chocolate. Perfect for dunking into your evening tea.' }),
  p({ id: 'ms-choc-brazils', name: 'Milk Chocolate Brazils', brand: 'M&S', origin: 'M&S', category: 'chocolate', price: 12500, size: '200g', pack: 'Gift box', flavours: ['Chocolatey', 'Nutty'], rating: 4.9, reviews: 48, isNew: true, dietary: ['Vegetarian', 'Contains nuts'], desc: 'Whole Brazil nuts wrapped in thick, creamy M&S milk chocolate. A proper treat for gifting — or not sharing.' }),
  p({ id: 'ms-milk-biscuits', name: 'Malted Milk Biscuits', brand: 'M&S', origin: 'M&S', category: 'biscuits', price: 3800, size: '250g', pack: 'Single', flavours: ['Malty', 'Buttery'], rating: 4.6, reviews: 64, isNew: true, dietary: ['Vegetarian', 'Gluten'], desc: 'Light malty biscuits baked to give a crisp, snappy texture. A British classic.' }),
  p({ id: 'ms-custard-creams', name: 'Custard Creams', brand: 'M&S', origin: 'M&S', category: 'biscuits', price: 3600, size: '300g', pack: 'Single', flavours: ['Creamy', 'Buttery'], rating: 4.7, reviews: 91, isNew: true, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: 'Two vanilla biscuits sandwiched with a smooth custard-flavoured cream made with real custard powder.' }),
  p({ id: 'ms-milk-creams', name: 'Vanilla Cream Milk Creams', brand: 'M&S', origin: 'M&S', category: 'biscuits', price: 3600, size: '300g', pack: 'Single', flavours: ['Creamy'], rating: 4.5, reviews: 37, isNew: true, dietary: ['Vegetarian', 'Gluten'], desc: 'Light milk biscuits with a vanilla cream filling, whipped for lightness.' }),

  p({ id: 'ms-cheese-twists', name: 'All Butter Cheese Twists', brand: 'M&S', origin: 'M&S', category: 'savoury', price: 5800, size: '125g', pack: 'Sharing', flavours: ['Salty', 'Buttery'], rating: 4.8, reviews: 76, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: 'All-butter puff pastry twisted with mature Gruyère cheese. Golden, flaky and seriously moreish.' }),
  p({ id: 'ms-shortbread-petticoat', name: 'Scottish Shortbread Petticoat Tails', brand: 'M&S', origin: 'M&S', category: 'biscuits', price: 9800, oldPrice: 11500, size: '400g tin', pack: 'Gift box', flavours: ['Buttery'], rating: 4.9, reviews: 58, dietary: ['Vegetarian', 'Gluten'], desc: 'Rich all-butter Scottish shortbread in a beautiful robin keepsake tin. The gift that always lands.' }),
  p({ id: 'ms-shortbread-rounds', name: 'Milk Chocolate Coated Shortbread Rounds', brand: 'M&S', origin: 'M&S', category: 'biscuits', price: 11500, size: '300g tin', pack: 'Gift box', flavours: ['Buttery', 'Chocolatey'], rating: 4.9, reviews: 44, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: 'Scottish shortbread rounds fully coated in milk chocolate, in a gorgeous thistle-print gift box.' }),
  p({ id: 'ms-choc-chunk-cookies', name: 'All Butter Chocolate Chunk Cookie Selection', brand: 'M&S', origin: 'M&S', category: 'biscuits', price: 10500, size: '300g', pack: 'Gift box', flavours: ['Chocolatey', 'Buttery'], rating: 4.8, reviews: 83, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: 'A box of chunky all-butter cookies loaded with milk, dark and white chocolate chunks.' }),
  p({ id: 'lu-petit-beurre', name: 'Le Petit Beurre', brand: 'LU', origin: 'Branded', category: 'biscuits', price: 3900, size: '200g', pack: 'Single', flavours: ['Buttery'], rating: 4.6, reviews: 69, dietary: ['Vegetarian', 'Gluten'], desc: 'The original French butter biscuit since 1886. Simple, crisp and perfect with coffee.' }),

  p({ id: 'celebrations', name: 'Celebrations Gift Box', brand: 'Mars', origin: 'Branded', category: 'chocolate', price: 14500, oldPrice: 16000, size: '320g', pack: 'Gift box', flavours: ['Chocolatey', 'Caramel & Toffee', 'Nutty'], rating: 4.9, reviews: 210, bestseller: true, dietary: ['Vegetarian', 'Contains nuts'], desc: 'Mini Snickers, Twix, Bounty, Galaxy, Maltesers and more — the party box everyone fights over.' }),
  p({ id: 'nutella-b-ready', name: 'Nutella B-ready x6', brand: 'Ferrero', origin: 'Branded', category: 'chocolate', price: 7500, size: '6 x 22g', pack: 'Multipack', flavours: ['Chocolatey', 'Nutty'], rating: 4.7, reviews: 97, dietary: ['Vegetarian', 'Contains nuts', 'Gluten'], desc: 'Crispy wafer bread filled with creamy Nutella. Limited-edition festive pack with fun messages.' }),
  p({ id: 'extra-chill', name: 'Extra Plus Chill Watermelon Gum', brand: "Wrigley's", origin: 'Branded', category: 'gum', price: 4500, size: '30 pieces', pack: 'Single', flavours: ['Fruity'], rating: 4.5, reviews: 41, isNew: true, dietary: ['Vegetarian', 'Sugar-free'], desc: 'NEW sugar-free watermelon gum with added niacin. Keeps you fresh and chilled all day.' }),
  p({ id: 'extra-deep-clean', name: 'Extra Plus Deep Clean Spearmint Gum', brand: "Wrigley's", origin: 'Branded', category: 'gum', price: 4500, size: '30 pieces', pack: 'Single', flavours: ['Minty'], rating: 4.6, reviews: 38, isNew: true, dietary: ['Vegetarian', 'Sugar-free'], desc: 'NEW sugar-free spearmint gum with xylitol and mint scrub beads for a deep-clean feel.' }),
  p({ id: 'toffee-crisp-biscuits', name: 'Toffee Crisp Biscuits', brand: 'Nestlé', origin: 'Branded', category: 'biscuits', price: 4800, size: '8 pack', pack: 'Multipack', flavours: ['Caramel & Toffee', 'Chocolatey'], rating: 4.7, reviews: 55, dietary: ['Vegetarian', 'Gluten'], desc: 'All the joy of a Toffee Crisp bar in biscuit form — caramel, crispy cereal and milk chocolate.' }),

  p({ id: 'tesco-toffee', name: 'Traditional Toffee', brand: 'Tesco', origin: 'Tesco', category: 'sweets', price: 3500, size: '200g', pack: 'Sharing', flavours: ['Caramel & Toffee'], rating: 4.5, reviews: 29, dietary: ['Vegetarian'], desc: 'Sweet and smooth chewy toffees inspired by a traditional sweet shop recipe.' }),
  p({ id: 'kelloggs-variety', name: "Kellogg's Variety Mini Packs", brand: "Kellogg's", origin: 'Branded', category: 'cereal', price: 8200, size: '8 packs', pack: 'Multipack', flavours: ['Chocolatey', 'Malty'], rating: 4.8, reviews: 120, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: 'Coco Pops, Corn Flakes and friends in single-serve mini boxes. A lunchbox hero.' }),
  p({ id: 'kelloggs-honey-pops', name: "Kellogg's Honey Bsss Pops", brand: "Kellogg's", origin: 'Branded', category: 'cereal', price: 7200, size: '375g', pack: 'Single', flavours: ['Malty'], rating: 4.6, reviews: 62, dietary: ['Vegetarian'], desc: 'Golden honey-coated corn puffs that are a source of fibre. Breakfast buzzing.' }),
  p({ id: 'tesco-choc-malted-milk', name: 'Milk Chocolate Malted Milk Biscuits', brand: 'Tesco', origin: 'Tesco', category: 'biscuits', price: 2900, size: '200g', pack: 'Single', flavours: ['Chocolatey', 'Malty'], rating: 4.5, reviews: 48, dietary: ['Vegetarian', 'Gluten'], desc: 'Light and crumbly malted milk biscuits dipped in smooth milk chocolate.' }),
  p({ id: 'tesco-malted-milk', name: 'Malted Milk Biscuits', brand: 'Tesco', origin: 'Tesco', category: 'biscuits', price: 2400, size: '200g', pack: 'Single', flavours: ['Malty'], rating: 4.4, reviews: 33, dietary: ['Vegetarian', 'Gluten'], desc: 'Carefully baked to a classic recipe for a malty treat. Light and crumbly.' }),

  p({ id: 'nutella-biscuits', name: 'Nutella Biscuits', brand: 'Ferrero', origin: 'Branded', category: 'biscuits', price: 6900, oldPrice: 7800, size: '304g', pack: 'Sharing', flavours: ['Chocolatey', 'Nutty'], rating: 4.9, reviews: 188, bestseller: true, dietary: ['Vegetarian', 'Contains nuts', 'Gluten'], desc: 'Crunchy biscuits with a creamy heart of Nutella. Festive edition pack.' }),
  p({ id: 'mcvities-wafer-rolls', name: 'Hazelnut Wafer Rolls', brand: "McVitie's", origin: 'Branded', category: 'biscuits', price: 6200, size: '400g tub', pack: 'Sharing', flavours: ['Nutty', 'Chocolatey'], rating: 4.7, reviews: 71, dietary: ['Vegetarian', 'Contains nuts', 'Gluten'], desc: 'Light, crispy wafer rolls with a hazelnut cream filling in a handy sharing tub.' }),
  p({ id: 'tesco-rich-tea', name: 'Rich Tea Fingers', brand: 'Tesco', origin: 'Tesco', category: 'biscuits', price: 2200, size: '300g', pack: 'Single', flavours: ['Malty'], rating: 4.3, reviews: 26, dietary: ['Vegetarian', 'Gluten'], desc: 'Smooth and snappy rich tea fingers, carefully baked for a dunkable, lightly malty treat.' }),
  p({ id: 'lotus-biscoff', name: 'Biscoff Original Caramelised Biscuits', brand: 'Lotus', origin: 'Branded', category: 'biscuits', price: 4600, size: '250g', pack: 'Single', flavours: ['Caramel & Toffee'], rating: 4.9, reviews: 240, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: "The world's favourite caramelised biscuit. Crunchy, spiced and unmistakable." }),
  p({ id: 'morrisons-eclairs', name: 'Milk Chocolate Eclairs', brand: 'Morrisons', origin: 'Morrisons', category: 'sweets', price: 4300, size: '400g', pack: 'Sharing', flavours: ['Caramel & Toffee', 'Chocolatey'], rating: 4.6, reviews: 44, dietary: ['Vegetarian'], desc: 'Rich and smooth chewy caramels with a soft milk chocolate centre.' }),

  p({ id: 'twix-secret-centre', name: 'Twix Secret Centre Biscuits', brand: 'Mars', origin: 'Branded', category: 'biscuits', price: 6500, size: '6 pack', pack: 'Multipack', flavours: ['Chocolatey', 'Caramel & Toffee'], rating: 4.8, reviews: 102, isNew: true, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: 'Soft-baked biscuits with a hidden caramel centre, half coated in milk chocolate.' }),
  p({ id: 'tesco-tortilla-chips', name: 'Lightly Salted Tortilla Chips', brand: 'Tesco', origin: 'Tesco', category: 'savoury', price: 3200, size: '200g', pack: 'Sharing', flavours: ['Salty'], rating: 4.4, reviews: 31, dietary: ['Vegetarian', 'Gluten'], desc: 'The perfect shape for dipping, snacking and sharing. Lightly salted.' }),
  p({ id: 'doritos-chilli-heatwave', name: 'Doritos Chilli Heatwave 5 Pack', brand: 'Doritos', origin: 'Branded', category: 'savoury', price: 7800, size: '5 x 30g', pack: 'Multipack', flavours: ['Spicy', 'Salty'], rating: 4.8, reviews: 156, bestseller: true, dietary: ['Vegetarian'], desc: 'Bold chilli flavoured corn chips. The UK favourite in a lunchbox multipack.' }),
  p({ id: 'ms-hot-maple-popcorn', name: 'Hot Maple Popcorn', brand: 'M&S', origin: 'M&S', category: 'savoury', price: 5200, size: '120g', pack: 'Sharing', flavours: ['Caramel & Toffee', 'Spicy'], rating: 4.7, reviews: 47, isNew: true, dietary: ['Vegetarian'], desc: 'Toffee-coated popcorn with maple syrup and a kick of cayenne pepper. Sweet heat!' }),
  p({ id: 'ms-choc-mini-wafers', name: 'Chocolate Mini Wafer Squares', brand: 'M&S', origin: 'M&S', category: 'biscuits', price: 4200, size: '135g', pack: 'Sharing', flavours: ['Chocolatey'], rating: 4.5, reviews: 22, stock: 'low', dietary: ['Vegetarian', 'Gluten'], desc: 'Crunchy wafer squares with a rich cocoa filling. Bite-sized and dangerous.' }),

  p({ id: 'ms-mocha-mini-biscuits', name: 'Outrageously Chocolatey Mocha Mini Biscuits', brand: 'M&S', origin: 'M&S', category: 'chocolate', price: 8900, size: '300g', pack: 'Sharing', flavours: ['Chocolatey', 'Creamy'], rating: 4.8, reviews: 39, stock: 'low', dietary: ['Vegetarian', 'Gluten'], desc: 'Mini biscuits smothered in mocha-flavoured milk chocolate. More chocolate than biscuit!' }),
  p({ id: 'ms-milk-choc-mini-biscuits', name: 'Outrageously Chocolatey Milk Chocolate Mini Biscuits', brand: 'M&S', origin: 'M&S', category: 'chocolate', price: 8900, size: '300g', pack: 'Sharing', flavours: ['Chocolatey'], rating: 4.9, reviews: 67, bestseller: true, dietary: ['Vegetarian', 'Gluten'], desc: 'Bite-sized biscuits fully enrobed in thick M&S milk chocolate. More chocolate than biscuit!' }),
  p({ id: 'ms-double-devon-toffees', name: 'Double Devon Toffees', brand: 'M&S', origin: 'M&S', category: 'sweets', price: 6800, size: '350g', pack: 'Sharing', flavours: ['Caramel & Toffee', 'Creamy'], rating: 4.7, reviews: 51, dietary: ['Vegetarian'], desc: 'Made with Devon clotted cream and butter for a rich, melt-in-the-mouth toffee.' }),
  p({ id: 'ms-swiss-nutty-clouds', name: 'Swiss Hazelnut Nutty Clouds', brand: 'M&S', origin: 'M&S', category: 'chocolate', price: 9500, size: '150g', pack: 'Sharing', flavours: ['Chocolatey', 'Nutty'], rating: 4.8, reviews: 34, stock: 'out', dietary: ['Vegetarian', 'Contains nuts'], desc: 'Swiss milk chocolate clusters with whole roasted hazelnuts.' }),
  p({ id: 'ms-swiss-crispy-clouds', name: 'Swiss Caramel Crispy Clouds', brand: 'M&S', origin: 'M&S', category: 'chocolate', price: 9500, size: '150g', pack: 'Sharing', flavours: ['Chocolatey', 'Caramel & Toffee', 'Nutty'], rating: 4.8, reviews: 29, isNew: true, dietary: ['Vegetarian', 'Contains nuts'], desc: 'Swiss milk chocolate with caramel sea salt, almond nougat and corn flakes.' }),
];

export const BRANDS = [...new Set(PRODUCTS.map((x) => x.brand))].sort();
export const MAX_PRICE = Math.ceil(Math.max(...PRODUCTS.map((x) => x.price)) / 1000) * 1000;

export const formatNaira = (n) => '₦' + n.toLocaleString('en-NG');
export const getProduct = (id) => PRODUCTS.find((x) => x.id === id);
export const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? id;

export const PHONE_TEL = '+2347089131913';
export const PHONE_DISPLAY = '+234 708 913 1913';
export const INSTAGRAM = 'https://www.instagram.com/sweettoothgroceriesng/';
