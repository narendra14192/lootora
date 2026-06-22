const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  { slug: "mice", name: "Gaming Mouse", brands: ["Razer", "Logitech G", "SteelSeries", "Corsair", "EvoFox", "Cosmic Byte", "Ant Esports"], minPrice: 600, maxPrice: 15000 },
  { slug: "keyboards", name: "Gaming Keyboard", brands: ["Razer", "Logitech G", "Corsair", "SteelSeries", "EvoFox", "Cosmic Byte", "Redragon"], minPrice: 900, maxPrice: 20000 },
  { slug: "headsets", name: "Gaming Headset", brands: ["HyperX", "Logitech G", "SteelSeries", "Razer", "EvoFox", "Cosmic Byte", "JBL"], minPrice: 800, maxPrice: 18000 },
  { slug: "chairs", name: "Gaming Chair", brands: ["Secretlab", "DXRacer", "AndaSeat", "Green Soul", "Circle", "Corsair"], minPrice: 8000, maxPrice: 50000 },
  { slug: "monitors", name: "Gaming Monitor", brands: ["Samsung", "LG", "ASUS ROG", "BenQ", "Acer", "MSI", "Gigabyte"], minPrice: 10000, maxPrice: 90000 },
  { slug: "laptops", name: "Gaming Laptop", brands: ["ASUS ROG", "MSI", "Alienware", "HP Omen", "Lenovo Legion", "Acer Predator"], minPrice: 50000, maxPrice: 250000 },
  { slug: "pcs", name: "Gaming PC", brands: ["MSI", "ASUS ROG", "HP Omen", "Lenovo Legion", "CyberPowerPC", "Corsair"], minPrice: 60000, maxPrice: 350000 },
  { slug: "consoles", name: "Gaming Console", brands: ["Sony PlayStation", "Microsoft Xbox", "Nintendo", "Valve StreamDeck", "ASUS ROG Ally"], minPrice: 25000, maxPrice: 70000 },
  { slug: "controllers", name: "Controllers & Gamepads", brands: ["Razer", "Microsoft Xbox", "Sony PlayStation", "EvoFox", "Redgear", "Cosmic Byte"], minPrice: 1000, maxPrice: 15000 },
  { slug: "gpus", name: "Graphics Cards", brands: ["NVIDIA", "AMD", "ASUS ROG", "MSI", "Gigabyte", "Zotac"], minPrice: 20000, maxPrice: 200000 },
  { slug: "cpus", name: "Processors", brands: ["AMD Ryzen", "Intel Core"], minPrice: 8000, maxPrice: 60000 },
  { slug: "motherboards", name: "Motherboards", brands: ["ASUS ROG", "MSI", "Gigabyte AORUS", "ASRock"], minPrice: 6000, maxPrice: 40000 },
  { slug: "ram", name: "RAM", brands: ["Corsair Vengeance", "G.Skill Trident", "Kingston FURY", "Crucial"], minPrice: 2500, maxPrice: 18000 },
  { slug: "ssds", name: "SSD Storage", brands: ["Samsung EVO", "WD Black", "Crucial", "Kingston", "Seagate"], minPrice: 3000, maxPrice: 22000 },
  { slug: "psus", name: "Power Supply Units", brands: ["Corsair", "EVGA", "Cooler Master", "Thermaltake", "Deepcool"], minPrice: 3000, maxPrice: 15000 },
  { slug: "cases", name: "PC Cases", brands: ["Lian Li", "NZXT", "Corsair", "Cooler Master", "Ant Esports"], minPrice: 3000, maxPrice: 20000 },
  { slug: "webcams", name: "Webcams", brands: ["Logitech", "Razer", "Elgato", "Lenovo"], minPrice: 2000, maxPrice: 15000 },
  { slug: "microphones", name: "Microphones", brands: ["Blue Yeti", "Razer Seiren", "Shure", "HyperX SoloCast", "Audio-Technica"], minPrice: 3000, maxPrice: 25000 },
  { slug: "speakers", name: "Gaming Speakers", brands: ["Logitech", "JBL", "Razer Nommo", "Creative", "Edifier"], minPrice: 2000, maxPrice: 25000 },
  { slug: "desks", name: "Gaming Desks", brands: ["Secretlab", "Eureka Ergonomic", "Green Soul", "Circle"], minPrice: 6000, maxPrice: 40000 },
  { slug: "mousepads", name: "Mouse Pads", brands: ["SteelSeries QcK", "Razer Goliathus", "Corsair MM", "EvoFox", "Cosmic Byte"], minPrice: 300, maxPrice: 3000 },
  { slug: "rgb-lights", name: "RGB Lights", brands: ["Nanoleaf", "Philips Hue", "Govee", "Razer Chroma"], minPrice: 1500, maxPrice: 18000 },
  { slug: "vr", name: "VR Headsets", brands: ["Meta Quest", "HTC Vive", "PlayStation VR", "Valve Index"], minPrice: 30000, maxPrice: 120000 },
  { slug: "capturecards", name: "Capture Cards", brands: ["Elgato", "AverMedia", "Razer Ripsaw"], minPrice: 5000, maxPrice: 20000 },
  { slug: "streamdecks", name: "Stream Decks", brands: ["Elgato Stream Deck", "Loupedeck"], minPrice: 8000, maxPrice: 25000 },
  { slug: "wheels", name: "Racing Wheels", brands: ["Logitech G", "Thrustmaster", "Fanatec"], minPrice: 10000, maxPrice: 100000 },
  { slug: "flightsim", name: "Flight Sim Controllers", brands: ["Logitech G", "Thrustmaster", "Honeycomb"], minPrice: 8000, maxPrice: 50000 },
  { slug: "mobile-acc", name: "Mobile Gaming Accessories", brands: ["Razer Kishi", "Backbone One", "EvoFox", "OnePlus"], minPrice: 1000, maxPrice: 10000 },
  { slug: "merchandise", name: "Gaming Merchandise", brands: ["Razer", "PlayStation", "Xbox", "Minecraft", "Cyberpunk"], minPrice: 500, maxPrice: 5000 },
  { slug: "apparel", name: "Gaming Apparel", brands: ["Razer Apparel", "Fnatic", "Cloud9", "Puma Gaming"], minPrice: 1000, maxPrice: 8000 },
  { slug: "backpacks", name: "Gaming Backpacks", brands: ["Razer Rogue", "Dell Gaming", "HP Omen", "Lenovo Legion"], minPrice: 2000, maxPrice: 10000 },
  { slug: "collectibles-gear", name: "Gaming Collectibles", brands: ["Funko Pop", "Hot Toys", "Neca", "Sideshow"], minPrice: 1000, maxPrice: 30000 },
  { slug: "actionfigures", name: "Action Figures", brands: ["Hasbro", "McFarlane", "Bandai", "Good Smile"], minPrice: 1500, maxPrice: 15000 },
  { slug: "tradingcards", name: "Trading Cards", brands: ["Pokemon", "Magic The Gathering", "Yu-Gi-Oh", "Flesh and Blood"], minPrice: 500, maxPrice: 10000 },
  { slug: "collectors-editions", name: "Collector Editions", brands: ["Ubisoft", "Sony Interactive", "Bethesda", "Square Enix"], minPrice: 8000, maxPrice: 25000 },
  { slug: "wallart", name: "Posters & Wall Art", brands: ["Displate", "Trends Posters", "Art.com"], minPrice: 800, maxPrice: 8000 },
  { slug: "memorabilia", name: "Gaming Memorabilia", brands: ["Atari", "Sega", "Nintendo Classic", "Retro Bit"], minPrice: 2000, maxPrice: 50000 },
  { slug: "deals", name: "Trending Deals", brands: ["Razer", "Logitech G", "EvoFox", "Cosmic Byte", "Redragon"], minPrice: 500, maxPrice: 15000 }
];

const MODIFIERS = [
  "Pro", "Elite", "X", "Ultimate", "Plus", "Air", "Wireless", "Superlight", "Chroma", "Spectre",
  "Classic", "RGB", "Alpha", "Prime", "Strix", "Hyper", "Predator", "Stealth", "Warhammer", "Ares"
];

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1626958390898-162d3577f593?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1585796856575-5015e21d339f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1547119944-1525918b04a1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1598550476439-6847785fce6e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1688531383569-42b7fe3e970a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559893088-c0787ebfc084?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600086882484-013a8c69201e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
];

function generateProducts() {
  const products = [];
  let id = 1;

  for (const cat of CATEGORIES) {
    // Generate exactly 13-14 products per category to reach ~500 in total
    const numToGen = 14; 
    for (let i = 0; i < numToGen; i++) {
      const brand = cat.brands[i % cat.brands.length];
      const modifier = MODIFIERS[(i + id) % MODIFIERS.length];
      const modelNum = 100 + (i * 50) + (id % 7);
      
      const name = `${brand} ${cat.name} ${modifier} ${modelNum}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      const price = Math.round((cat.minPrice + (i * (cat.maxPrice - cat.minPrice) / numToGen)) / 10) * 10;
      
      const desc = `High performance ${cat.name.toLowerCase()} manufactured by ${brand}. Features cutting edge design parameters, durability, and a dynamic gaming aesthetic tailored for enthusiasts.`;
      
      const imgUrl = UNSPLASH_IMAGES[(i + id) % UNSPLASH_IMAGES.length];
      
      const specs = {
        "Brand": brand,
        "Category": cat.name,
        "Model": `${modifier} ${modelNum}`,
        "Warranty": "1 Year Limited Warranty"
      };

      const rating = parseFloat((4.0 + (i % 10) * 0.1).toFixed(1));
      const reviewCount = 50 + (i * 45) + (id % 13);
      
      const encodedName = encodeURIComponent(name);
      const buyUrl = `https://www.amazon.in/s?k=${encodedName}&tag=lootora21-21`;

      products.push({
        Name: name,
        Slug: slug,
        Brand: brand,
        Price: price,
        Description: desc,
        ImageUrl: imgUrl,
        Specifications: JSON.stringify(specs),
        Rating: rating,
        ReviewCount: reviewCount,
        CategorySlug: cat.slug,
        BuyUrl: buyUrl,
        IsTrending: i % 4 === 0,
        IsLimitedEdition: i % 7 === 0
      });
      
      id++;
    }
  }

  console.log(`Generated ${products.length} products!`);
  return products;
}

const productsList = generateProducts();
fs.writeFileSync(path.join(__dirname, 'products_seed.json'), JSON.stringify(productsList, null, 2), 'utf8');
console.log("Successfully wrote products_seed.json!");
