import React, { useState, useEffect, useRef } from "react";
import { 
  Gamepad, Keyboard, MousePointer, Headphones, Layers, Armchair, ToyBrick, Shirt, 
  Search, Heart, User, LogIn, LogOut, Plus, Edit, Trash2, Star, ArrowRight, X, 
  SlidersHorizontal, Settings, Activity, TrendingUp, BarChart3, ExternalLink, 
  ChevronRight, Image as ImageIcon, Check, Loader, Sparkles, Filter, Laptop, Cpu, Table, Gift, Compass
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5240/api";

import { supabase, isSupabaseConfigured } from "./supabase";

// Comprehensive GameVault Category nodes
const ALL_CATEGORIES = [
  { id: 1, name: "Gaming Mouse", slug: "mice", group: "peripherals", icon: "🖱️", description: "Esports lightweight mice with high-precision optical sensors" },
  { id: 2, name: "Gaming Keyboard", slug: "keyboards", group: "peripherals", icon: "⌨️", description: "Hot-swappable mechanical and wireless optical keyboards" },
  { id: 3, name: "Gaming Headset", slug: "headsets", group: "audio", icon: "🎧", description: "Immersive surround sound headsets with spatial audio" },
  { id: 4, name: "Gaming Chair", slug: "chairs", group: "furniture", icon: "🪑", description: "Ergonomic gaming seats for intense battle sessions" },
  { id: 5, name: "Gaming Monitor", slug: "monitors", group: "peripherals", icon: "🖥️", description: "High-refresh rate OLED and curved IPS displays" },
  { id: 6, name: "Gaming Laptop", slug: "laptops", group: "systems", icon: "💻", description: "Portable laptops processing extreme refresh rates" },
  { id: 7, name: "Gaming PC", slug: "pcs", group: "systems", icon: "🖥️", description: "Prebuilt extreme performance desktop gaming rigs" },
  { id: 8, name: "Gaming Console", slug: "consoles", group: "systems", icon: "🎮", description: "PlayStation, Xbox and portable retro hardware" },
  { id: 9, name: "Controllers & Gamepads", slug: "controllers", group: "peripherals", icon: "🎮", description: "Console-style pads and modular mapping controllers" },
  { id: 10, name: "Graphics Cards", slug: "gpus", group: "components", icon: "🎨", description: "Next-gen ray tracing graphics processors (RTX 5090)" },
  { id: 11, name: "Processors", slug: "cpus", group: "components", icon: "🧠", description: "Zen 5 and Ultra Core CPU gaming processors" },
  { id: 12, name: "Motherboards", slug: "motherboards", group: "components", icon: "🎛️", description: "Socket mainboards supporting PCIe 5.0 and high clock speeds" },
  { id: 13, name: "RAM", slug: "ram", group: "components", icon: "🧩", description: "RGB dual memory modules for lightning speed caching" },
  { id: 14, name: "SSD Storage", slug: "ssds", group: "components", icon: "💾", description: "NVMe Gen 5 high-speed solid state storage chips" },
  { id: 15, name: "Power Supply Units", slug: "psus", group: "components", icon: "🔌", description: "High efficiency modular gold certified power supplies" },
  { id: 16, name: "PC Cases", slug: "cases", group: "components", icon: "📦", description: "Airflow focused cases with tempered glass panels" },
  { id: 17, name: "Webcams", slug: "webcams", group: "audio", icon: "📷", description: "High frames stream cameras with ring flash adaptors" },
  { id: 18, name: "Microphones", slug: "microphones", group: "audio", icon: "🎤", description: "Studio-grade XLR/USB recording gear for streamers" },
  { id: 19, name: "Gaming Speakers", slug: "speakers", group: "audio", icon: "🔊", description: "Bass surround sound bar desk speaker sets" },
  { id: 20, name: "Gaming Desks", slug: "desks", group: "furniture", icon: "📚", description: "Height adjustable electric ergonomic standing desks" },
  { id: 21, name: "Mouse Pads", slug: "mousepads", group: "peripherals", icon: "🗺️", description: "Desk mats and hybrid speed-control textured sheets" },
  { id: 22, name: "RGB Lights", slug: "rgb-lights", group: "furniture", icon: "💡", description: "Smart light towers and sync wall neon panels" },
  { id: 23, name: "VR Headsets", slug: "vr", group: "systems", icon: "🥽", description: "Virtual reality displays and spatial tracking goggles" },
  { id: 24, name: "Capture Cards", slug: "capturecards", group: "audio", icon: "📹", description: "PCIe/USB cards capturing high definition feeds" },
  { id: 25, name: "Stream Decks", slug: "streamdecks", group: "audio", icon: "🎛️", description: "LCD key shortcuts macro deck consoles" },
  { id: 26, name: "Racing Wheels", slug: "wheels", group: "peripherals", icon: "🏎️", description: "Close-loop force feedback steering wheels and pedals" },
  { id: 27, name: "Flight Sim Controllers", slug: "flightsim", group: "peripherals", icon: "✈️", description: "Flight simulation yokes, levers and thrusters" },
  { id: 28, name: "Mobile Gaming Accessories", slug: "mobile-acc", group: "peripherals", icon: "📱", description: "Snap-on mobile controllers and phone heatsinks" },
  { id: 29, name: "Gaming Merchandise", slug: "merchandise", group: "collectibles", icon: "👕", description: "Official themed keychains, cups and mugs" },
  { id: 30, name: "Gaming Apparel", slug: "apparel", group: "collectibles", icon: "🧢", description: "Esports hoodies, dynamic caps and street jackets" },
  { id: 31, name: "Gaming Backpacks", slug: "backpacks", group: "collectibles", icon: "🎒", description: "Padded water-resistant laptop gear bags" },
  { id: 32, name: "Gaming Collectibles", slug: "collectibles-gear", group: "collectibles", icon: "🧸", description: "Statues, weapon prop replicas and limited collectibles" },
  { id: 33, name: "Action Figures", slug: "actionfigures", group: "collectibles", icon: "🗿", description: "Articulated gaming heroes and boss models" },
  { id: 34, name: "Trading Cards", slug: "tradingcards", group: "collectibles", icon: "🃏", description: "Foil cards booster boxes, cases and binders" },
  { id: 35, name: "Collector Editions", slug: "collectors-editions", group: "collectibles", icon: "🎁", description: "Special editions containing steelbooks and statues" },
  { id: 36, name: "Posters & Wall Art", slug: "wallart", group: "collectibles", icon: "🎨", description: "Framed art prints and printed metal displates" },
  { id: 37, name: "Gaming Memorabilia", slug: "memorabilia", group: "collectibles", icon: "🏆", description: "Autographed jerseys and vintage retro souvenirs" },
  { id: 38, name: "Trending Deals", slug: "deals", group: "collectibles", icon: "🔥", description: "Limited clearance deals on high quality gear" }
];

// Visual 30 Brand cards with themed brand colors
const FEATURED_BRANDS = [
  { slug: "razer", name: "Razer", color: "#00FF00", glow: "shadow-[0_0_15px_rgba(0,255,0,0.35)]", desc: "For Gamers. By Gamers. Premium mouse gear, Chroma keyboards, and Blade gaming laptops." },
  { slug: "logitech", name: "Logitech G", color: "#00E5FF", glow: "shadow-[0_0_15px_rgba(0,229,255,0.35)]", desc: "Leading performance sensors, HERO DPI calibrations, and sim racing yokes." },
  { slug: "corsair", name: "Corsair", color: "#FFD700", glow: "shadow-[0_0_15px_rgba(255,215,0,0.35)]", desc: "Aircraft aluminium keyboards, custom cases, RAM blocks, and premium desks." },
  { slug: "steelseries", name: "SteelSeries", color: "#FF7F00", glow: "shadow-[0_0_15px_rgba(255,127,0,0.35)]", desc: "Esports design standard, magnetic optical switches, and Arctis Nova headsets." },
  { slug: "hyperx", name: "HyperX", color: "#FF0000", glow: "shadow-[0_0_15px_rgba(255,0,0,0.35)]", desc: "Ultimate comfort earmuffs, Cloud surround audio, and streaming mics." },
  { slug: "asus", name: "ASUS ROG", color: "#FF0055", glow: "shadow-[0_0_15px_rgba(255,0,85,0.35)]", desc: "Republic of Gamers. Power Strix RTX graphics, motherboards, and fast screens." },
  { slug: "msi", name: "MSI", color: "#E61919", glow: "shadow-[0_0_15px_rgba(230,25,25,0.35)]", desc: "True Gaming. Dragon series prebuilts, GPUs, and performance cooling fans." },
  { slug: "alienware", name: "Alienware", color: "#00FFFF", glow: "shadow-[0_0_15px_rgba(0,255,255,0.35)]", desc: "Futuristic alien cases, desktop battle stations, and curved displays." },
  { slug: "acer", name: "Acer Predator", color: "#0080FF", glow: "shadow-[0_0_15px_rgba(0,128,255,0.35)]", desc: "Predator Orion gaming computers, high-refresh displays, and components." },
  { slug: "lenovo", name: "Lenovo Legion", color: "#8A2BE2", glow: "shadow-[0_0_15px_rgba(138,43,226,0.35)]", desc: "Coldfront cooling architectures in portable Legion laptops and towers." },
  { slug: "hp", name: "HP Omen", color: "#00F5FF", glow: "shadow-[0_0_15px_rgba(0,245,255,0.35)]", desc: "Clean minimalist design desktop rigs and high-performance components." },
  { slug: "gigabyte", name: "Gigabyte AORUS", color: "#FF5500", glow: "shadow-[0_0_15px_rgba(255,85,0,0.35)]", desc: "Waterforce graphics cards, motherboard layouts, and RGB cooling boxes." },
  { slug: "sony", name: "Sony PlayStation", color: "#003087", glow: "shadow-[0_0_15px_rgba(0,48,135,0.35)]", desc: "Play Has No Limits. PS5 Pro consoles, virtual VR2 headgear, and DualSense edge." },
  { slug: "microsoft", name: "Microsoft Xbox", color: "#107C10", glow: "shadow-[0_0_15px_rgba(16,124,16,0.35)]", desc: "Xbox Series consoles, elite controller layouts, and Flight Sim inputs." },
  { slug: "nintendo", name: "Nintendo", color: "#E60012", glow: "shadow-[0_0_15px_rgba(230,0,18,0.35)]", desc: "Innovative hybrid gaming platforms, Switch 2 docks, and classic collectibles." },
  { slug: "nvidia", name: "NVIDIA", color: "#76B900", glow: "shadow-[0_0_15px_rgba(118,185,0,0.35)]", desc: "GeForce RTX graphics power, DLSS 4 Blackwell cores, and AI upscalers." },
  { slug: "amd", name: "AMD", color: "#ED1C24", glow: "shadow-[0_0_15px_rgba(237,28,36,0.35)]", desc: "Ryzen CPU processing cores and Radeon RX RDNA graphics cards." },
  { slug: "intel", name: "Intel", color: "#0071C5", glow: "shadow-[0_0_15px_rgba(0,113,197,0.35)]", desc: "Core Ultra hybrid computing chip architectures with integrated NPUs." },
  { slug: "kingston", name: "Kingston", color: "#A6192E", glow: "shadow-[0_0_15px_rgba(166,25,46,0.35)]", desc: "FURY DDR5 performance memories, custom USB drives, and reliable SSD storage." },
  { slug: "crucial", name: "Crucial", color: "#005A9C", glow: "shadow-[0_0_15px_rgba(0,90,156,0.35)]", desc: "Micron engine high frequency RAM memory sticks and PCIe Gen 5 SSD drives." },
  { slug: "wd", name: "Western Digital", color: "#00539B", glow: "shadow-[0_0_15px_rgba(0,83,155,0.35)]", desc: "Black series custom NVMe SSD chips and solid heat-sink console expansions." },
  { slug: "seagate", name: "Seagate", color: "#7ED957", glow: "shadow-[0_0_15px_rgba(126,217,87,0.35)]", desc: "FireCuda streaming hard drives and dynamic storage expansion bays." },
  { slug: "samsung", name: "Samsung", color: "#1428A0", glow: "shadow-[0_0_15px_rgba(20,40,160,0.35)]", desc: "Odyssey QLED curved panels and ultra-fast 990 PRO NVMe SSD storage." },
  { slug: "lg", name: "LG", color: "#A50034", glow: "shadow-[0_0_15px_rgba(165,0,52,0.35)]", desc: "UltraGear OLED gaming monitors, fast response rates, and low latency TVs." },
  { slug: "secretlab", name: "Secretlab", color: "#B9975B", glow: "shadow-[0_0_15px_rgba(185,151,91,0.35)]", desc: "Titan Evo luxury ergonomic chairs, magnetic cushions, and accessories." },
  { slug: "dxracer", name: "DXRacer", color: "#C8102E", glow: "shadow-[0_0_15px_rgba(200,16,46,0.35)]", desc: "Air series breathable gaming chairs, steel springs, and headrests." },
  { slug: "andaseat", name: "AndaSeat", color: "#C5A059", glow: "shadow-[0_0_15px_rgba(197,160,89,0.35)]", desc: "Kaiser luxury executive ergonomic leather seats and custom armrests." },
  { slug: "jbl", name: "JBL", color: "#FF6600", glow: "shadow-[0_0_15px_rgba(255,102,0,0.35)]", desc: "Quantum surround sound desk speakers, gaming bars, and subwoofers." },
  { slug: "audiotechnica", name: "Audio-Technica", color: "#333333", glow: "shadow-[0_0_15px_rgba(51,51,51,0.35)]", desc: "Professional XLR microphones, studio monitors, and analog mixers." },
  { slug: "sennheiser", name: "Sennheiser", color: "#009FDF", glow: "shadow-[0_0_15px_rgba(0,159,223,0.35)]", desc: "High fidelity wireless open-back headphones and broadcast headsets." }
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Razer DeathAdder V3",
    slug: "razer-deathadder-v3",
    brand: "Razer",
    price: 6999,
    description: "Esports-grade wired mouse weighing only 59g. Features an ergonomic shape, standard raw 30,000 DPI sensor, and a tactile rubberized scroll wheel.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
    specifications: { "Sensor": "Focus Pro 30K Optical", "Weight": "59g", "Connection": "Wired Speedflex" },
    rating: 4.6,
    reviewCount: 142,
    categoryName: "Gaming Mouse",
    categorySlug: "mice",
    buyUrl: "https://www.amazon.in/s?k=Razer%20DeathAdder%20V3&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: false,
    reviews: []
  },
  {
    id: 2,
    name: "Logitech G Pro X Superlight 2",
    slug: "logitech-g-pro-x-superlight-2",
    brand: "Logitech G",
    price: 16995,
    description: "Champion-winning wireless gaming mouse upgraded with LIGHTFORCE switches and the HERO 2 sensor, boasting a 32,000 DPI resolution.",
    imageUrl: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=600&q=80",
    specifications: { "Sensor": "HERO 2", "Weight": "60g", "Battery Life": "95 hours" },
    rating: 4.9,
    reviewCount: 285,
    categoryName: "Gaming Mouse",
    categorySlug: "mice",
    buyUrl: "https://www.amazon.in/s?k=Logitech%20G%20Pro%20X%20Superlight%202&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: true,
    reviews: []
  },
  {
    id: 4,
    name: "Razer BlackWidow V4",
    slug: "razer-blackwidow-v4",
    brand: "Razer",
    price: 15999,
    description: "Full-sized mechanical gaming keyboard wired with Razer Green Clicky switches, dynamic per-key Chroma RGB lighting, and robust double-shot ABS keycaps.",
    imageUrl: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=600&q=80",
    specifications: { "Switches": "Razer Green Clicky", "Layout": "Full size" },
    rating: 4.7,
    reviewCount: 110,
    categoryName: "Gaming Keyboard",
    categorySlug: "keyboards",
    buyUrl: "https://www.amazon.in/s?k=Razer%20BlackWidow%20V4&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: true,
    reviews: []
  },
  {
    id: 5,
    name: "Logitech G915",
    slug: "logitech-g915",
    brand: "Logitech G",
    price: 19995,
    description: "Thin wireless gaming keyboard featuring low-profile GL mechanical switches, LIGHTSPEED wireless connectivity, and customizable LIGHTSYNC RGB lights.",
    imageUrl: "https://images.unsplash.com/photo-1626958390898-162d3577f593?auto=format&fit=crop&w=600&q=80",
    specifications: { "Switches": "GL Tactile Low-profile", "Connection": "LIGHTSPEED Wireless" },
    rating: 4.6,
    reviewCount: 145,
    categoryName: "Gaming Keyboard",
    categorySlug: "keyboards",
    buyUrl: "https://www.amazon.in/s?k=Logitech%20G915&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl"
  },
  {
    id: 7,
    name: "HyperX Cloud III",
    slug: "hyperx-cloud-iii",
    brand: "HyperX",
    price: 8490,
    description: "Evolution of the legendary Cloud II. Built with memory foam headband and ear cushions, angled 53mm drivers, and an ultra-clear microphone.",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    specifications: { "Drivers": "53mm Angled", "Mic": "Detachable Noise-Cancelling" },
    rating: 4.5,
    reviewCount: 290,
    categoryName: "Gaming Headset",
    categorySlug: "headsets",
    buyUrl: "https://www.amazon.in/s?k=HyperX%20Cloud%20III&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: true
  },
  {
    id: 9,
    name: "SteelSeries Arctis Nova 7",
    slug: "steelseries-arctis-nova-7",
    brand: "SteelSeries",
    price: 18999,
    description: "High fidelity wireless gaming headset featuring the Nova Acoustic System, simultaneous 2.4GHz and Bluetooth wireless, and 38-hour battery span.",
    imageUrl: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=600&q=80",
    specifications: { "Battery": "38 Hours", "Wireless": "2.4GHz & Bluetooth" },
    rating: 4.7,
    reviewCount: 160,
    categoryName: "Gaming Headset",
    categorySlug: "headsets",
    buyUrl: "https://www.amazon.in/s?k=SteelSeries%20Arctis%20Nova%207&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl"
  },
  {
    id: 10,
    name: "Samsung Odyssey G7",
    slug: "samsung-odyssey-g7",
    brand: "Samsung",
    price: 49900,
    description: "Curved 27-inch gaming monitor with 1000R curvature, 240Hz refresh rate, 1ms latency, QLED display quality, and WQHD resolution.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    specifications: { "Resolution": "2560 x 1440 WQHD", "Refresh": "240Hz", "Panel": "VA Curved QLED" },
    rating: 4.6,
    reviewCount: 94,
    categoryName: "Gaming Monitor",
    categorySlug: "monitors",
    buyUrl: "https://www.amazon.in/s?k=Samsung%20Odyssey%20G7&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: true
  },
  {
    id: 11,
    name: "LG UltraGear 27GR95QE",
    slug: "lg-ultragear-27gr95qe",
    brand: "LG",
    price: 69990,
    description: "The worlds first 240Hz OLED gaming monitor. Curved 27-inch display with 0.03ms response time, HDMI 2.1 support, and 98.5% DCI-P3 color scale.",
    imageUrl: "https://images.unsplash.com/photo-1585796856575-5015e21d339f?auto=format&fit=crop&w=600&q=80",
    specifications: { "Panel": "OLED", "Refresh": "240Hz", "Response Time": "0.03ms (GtG)" },
    rating: 4.8,
    reviewCount: 76,
    categoryName: "Gaming Monitor",
    categorySlug: "monitors",
    buyUrl: "https://www.amazon.in/s?k=LG%20UltraGear%2027GR95QE&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl"
  },
  {
    id: 13,
    name: "Secretlab Titan Evo",
    slug: "secretlab-titan-evo",
    brand: "Secretlab",
    price: 45000,
    description: "The gold standard of ergonomic gaming chairs. Features customized L-ADAPT 4-way lumbar support, magnetic memory foam head pillow, and 4D armrests.",
    imageUrl: "https://images.unsplash.com/photo-1598550476439-6847785fce6e?auto=format&fit=crop&w=600&q=80",
    specifications: { "Lumbar": "4-way Adjustable", "Materials": "Neo Hybrid Leatherette" },
    rating: 4.8,
    reviewCount: 210,
    categoryName: "Gaming Chair",
    categorySlug: "chairs",
    buyUrl: "https://www.amazon.in/s?k=Secretlab%20Titan%20Evo&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: true
  },
  {
    id: 16,
    name: "NVIDIA GeForce RTX 5090",
    slug: "nvidia-geforce-rtx-5090",
    brand: "NVIDIA",
    price: 199000,
    description: "The ultimate powerhouse of ray tracing graphics cards. Powered by NVIDIA Blackwell architecture, featuring 32GB GDDR7 VRAM, DLSS 4, and high core counts.",
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
    specifications: { "Architecture": "Blackwell", "VRAM": "32GB GDDR7", "Cuda Cores": "21760" },
    rating: 4.9,
    reviewCount: 64,
    categoryName: "Graphics Cards",
    categorySlug: "gpus",
    buyUrl: "https://www.amazon.in/s?k=NVIDIA%20GeForce%20RTX%205090&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: true,
    isLimitedEdition: true
  },
  {
    id: 21,
    name: "PlayStation 5 Pro",
    slug: "playstation-5-pro",
    brand: "Sony PlayStation",
    price: 69990,
    description: "Sony's ultimate console system featuring upgraded GPU power, PlayStation Spectral Super Resolution (PSSR) AI upscaling, and 2TB high speed SSD storage.",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
    specifications: { "Storage": "2TB Custom SSD", "AI Tech": "PSSR upscaling" },
    rating: 4.8,
    reviewCount: 189,
    categoryName: "Gaming Console",
    categorySlug: "consoles",
    buyUrl: "https://www.amazon.in/s?k=PlayStation%205%20Pro&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: true
  },
  {
    id: 23,
    name: "EvoFox One S Wireless Gamepad",
    slug: "evofox-one-s-wireless-gamepad",
    brand: "EvoFox",
    price: 1599,
    description: "3-Mode Wireless controller featuring Hall-Effect Joysticks & Triggers, zero stick drift, and dynamic vibration feedback.",
    imageUrl: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80",
    specifications: { "Connectivity": "2.4GHz Wireless, Bluetooth, Wired", "Sensor": "Hall-Effect Magnetic", "Compatibility": "PC, Android, iOS, Switch", "Battery Life": "Up to 12 Hours" },
    rating: 4.5,
    reviewCount: 142,
    categoryName: "Controllers & Gamepads",
    categorySlug: "controllers",
    buyUrl: "https://www.amazon.in/s?k=EvoFox%20One%20S%20Wireless%20Gamepad&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl",
    isTrending: true,
    reviews: []
  }
];

const CATEGORY_GROUPS = {
  "pcs": "systems", "laptops": "systems", "consoles": "systems", "vr": "systems", "handhelds": "systems", "retro": "systems",
  "mice": "peripherals", "keyboards": "peripherals", "controllers": "peripherals", "joysticks": "peripherals", "mousepads": "peripherals", "wheels": "peripherals", "flightsim": "peripherals", "mobile-acc": "peripherals",
  "headsets": "audio", "webcams": "audio", "microphones": "audio", "speakers": "audio", "capturecards": "audio", "streamdecks": "audio",
  "gpus": "components", "cpus": "components", "motherboards": "components", "ram": "components", "ssds": "components", "psus": "components", "cases": "components",
  "chairs": "furniture", "desks": "furniture", "rgb-lights": "furniture",
  "merchandise": "collectibles", "apparel": "collectibles", "backpacks": "collectibles", "collectibles-gear": "collectibles", "actionfigures": "collectibles", "tradingcards": "collectibles", "collectors-editions": "collectibles", "wallart": "collectibles", "memorabilia": "collectibles", "deals": "collectibles"
};

const CategoryIcon = ({ iconName }) => {
  switch (iconName) {
    case "Gamepad": return <Gamepad className="w-5 h-5 text-lootora-blue" />;
    case "Keyboard": return <Keyboard className="w-5 h-5 text-lootora-blue" />;
    case "MousePointer": return <MousePointer className="w-5 h-5 text-lootora-blue" />;
    case "Headphones": return <Headphones className="w-5 h-5 text-lootora-blue" />;
    case "Layers": return <Layers className="w-5 h-5 text-lootora-blue" />;
    case "Armchair": return <Armchair className="w-5 h-5 text-lootora-blue" />;
    case "ToyBrick": return <ToyBrick className="w-5 h-5 text-lootora-blue" />;
    case "Shirt": return <Shirt className="w-5 h-5 text-lootora-blue" />;
    default: return <Gamepad className="w-5 h-5 text-lootora-blue" />;
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [activeCategorySlug, setActiveCategorySlug] = useState("");
  const [activeBrandSlug, setActiveBrandSlug] = useState("");
  const [currentProductSlug, setCurrentProductSlug] = useState(null);
  
  // Tabs
  const [activeCategoryTab, setActiveCategoryTab] = useState("systems");
  const [trendingTab, setTrendingTab] = useState("bestseller"); // bestseller, views, rated, newest, recommended
  
  // Data Lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(ALL_CATEGORIES);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Shop Filters
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(200000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");

  // Setup Builder
  const [setupBudget, setSetupBudget] = useState(50000);
  const [setupRecommendation, setSetupRecommendation] = useState(null);
  const [setupLoading, setSetupLoading] = useState(false);

  // User
  const [user, setUser] = useState(null);

  // Admin CRUD
  const [adminStats, setAdminStats] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [adminSelectedProduct, setAdminSelectedProduct] = useState(null);
  const [adminForm, setAdminForm] = useState({
    name: "", brand: "", price: "", discountPrice: "", stock: "", tags: "",
    description: "", imageUrl: "", galleryImages: "", specifications: "",
    categoryId: 1, buyUrl: "", isTrending: false, isLimitedEdition: false,
    featured: false
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("gamevault_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      const localWish = localStorage.getItem("gamevault_wishlist");
      setWishlist(localWish ? JSON.parse(localWish) : []);
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0) {
      computeLocalSetup(setupBudget);
    }
  }, [setupBudget, products]);

  const showNotification = (msg, type = "success") => {
    setNotification({ text: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch(`${API_BASE}/product`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.length > 0 ? prodData : MOCK_PRODUCTS);
      } else {
        setProducts(MOCK_PRODUCTS);
      }
      
      const catRes = await fetch(`${API_BASE}/category`);
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.length > 0 ? catData : ALL_CATEGORIES);
      } else {
        setCategories(ALL_CATEGORIES);
      }
    } catch (err) {
      console.warn("Operating in offline mock mode.");
      setProducts(MOCK_PRODUCTS);
      setCategories(ALL_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("gamevault_token");
      if (!token) return;
      const res = await fetch(`${API_BASE}/wishlist`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      }
    } catch (err) {
      console.warn("Offline Wishlist loaded.");
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      let currentWish = [...wishlist];
      const exists = currentWish.some(item => item.id === product.id);
      if (exists) {
        currentWish = currentWish.filter(item => item.id !== product.id);
        showNotification(`${product.name} removed from Wishlist`);
      } else {
        currentWish.push(product);
        showNotification(`${product.name} saved to Wishlist!`);
      }
      setWishlist(currentWish);
      localStorage.setItem("gamevault_wishlist", JSON.stringify(currentWish));
      return;
    }

    try {
      const token = localStorage.getItem("gamevault_token");
      const res = await fetch(`${API_BASE}/wishlist/${product.id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isAdded) {
          setWishlist(prev => [...prev, product]);
          showNotification(`${product.name} added to Wishlist!`);
        } else {
          setWishlist(prev => prev.filter(item => item.id !== product.id));
          showNotification(`${product.name} removed from Wishlist`);
        }
      }
    } catch (err) {
      showNotification("Saving bookmark locally.", "warning");
    }
  };

  const handleBuyNow = async (productId, buyUrl) => {
    window.open(buyUrl, "_blank");
    try {
      await fetch(`${API_BASE}/product/${productId}/redirect`, { method: "POST" });
    } catch (err) {
      console.warn("Click tracked locally.");
    }
  };

  const computeLocalSetup = (budget) => {
    let kb, mouse, hs, mon, chair;
    if (budget <= 25000) {
      kb = products.find(p => p.slug === "logitech-g213-prodigy");
      mouse = products.find(p => p.slug === "razer-deathadder-v3");
      hs = products.find(p => p.slug === "hyperx-cloud-iii"); // stinger fallback
      mon = products.find(p => p.slug === "asus-vy249he-24");
      chair = products.find(p => p.slug === "corsair-office-chair-basic");
    } else if (budget <= 50000) {
      kb = products.find(p => p.slug === "corsair-k70-rgb-pro");
      mouse = products.find(p => p.slug === "razer-deathadder-v3");
      hs = products.find(p => p.slug === "hyperx-cloud-iii");
      mon = products.find(p => p.slug === "samsung-odyssey-g7");
      chair = products.find(p => p.slug === "dxracer-air");
    } else if (budget <= 75000) {
      kb = products.find(p => p.slug === "logitech-g915");
      mouse = products.find(p => p.slug === "logitech-g-pro-x-superlight-2");
      hs = products.find(p => p.slug === "steelseries-arctis-nova-7");
      mon = products.find(p => p.slug === "lg-ultragear-27gr95qe");
      chair = products.find(p => p.slug === "andaseat-kaiser-3");
    } else {
      kb = products.find(p => p.slug === "razer-blackwidow-v4");
      mouse = products.find(p => p.slug === "logitech-g-pro-x-superlight-2");
      hs = products.find(p => p.slug === "steelseries-arctis-nova-7");
      mon = products.find(p => p.slug === "asus-rog-swift-oled");
      chair = products.find(p => p.slug === "secretlab-titan-evo");
    }
    
    // Safety check fallback
    kb = kb || products.find(p => p.categorySlug === "keyboards");
    mouse = mouse || products.find(p => p.categorySlug === "mice");
    hs = hs || products.find(p => p.categorySlug === "headsets");
    mon = mon || products.find(p => p.categorySlug === "monitors");
    chair = chair || products.find(p => p.categorySlug === "chairs");

    const totalCost = (kb?.price || 0) + (mouse?.price || 0) + (hs?.price || 0) + (mon?.price || 0) + (chair?.price || 0);

    setSetupRecommendation({
      budget,
      totalCost,
      keyboard: kb,
      mouse,
      headset: hs,
      monitor: mon,
      chair
    });
  };

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem("gamevault_token");
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      } else {
        generateMockAdminStats();
      }
    } catch (err) {
      generateMockAdminStats();
    }
  };

  const generateMockAdminStats = () => {
    setAdminStats({
      totalProducts: products.length,
      totalCategories: categories.length,
      totalUsers: 248,
      totalRedirections: 1042,
      clicksByBrand: [
        { brand: "Razer", clicks: 420 },
        { brand: "Logitech G", clicks: 310 },
        { brand: "NVIDIA", clicks: 280 },
        { brand: "Sony PlayStation", clicks: 190 },
        { brand: "ASUS ROG", clicks: 145 }
      ],
      clicksByProduct: [
        { productName: "NVIDIA GeForce RTX 5090", brand: "NVIDIA", clicks: 280 },
        { productName: "Logitech G Pro X Superlight 2", brand: "Logitech G", clicks: 195 },
        { productName: "PlayStation 5 Pro", brand: "Sony PlayStation", clicks: 190 },
        { productName: "Razer BlackWidow V4", brand: "Razer", clicks: 152 }
      ],
      clicksOverTime: [
        { date: "2026-06-15", clicks: 120 },
        { date: "2026-06-16", clicks: 140 },
        { date: "2026-06-17", clicks: 115 },
        { date: "2026-06-18", clicks: 170 },
        { date: "2026-06-19", clicks: 195 },
        { date: "2026-06-20", clicks: 210 },
        { date: "2026-06-21", clicks: 142 }
      ]
    });
  };

  const handleAdminCrud = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("gamevault_token");
    const galleryArr = adminForm.galleryImages.split(";").map(i => i.trim()).filter(Boolean);
    const specsObj = {};
    adminForm.specifications.split(";").forEach(s => {
      const parts = s.split(":");
      if (parts.length === 2) {
        specsObj[parts[0].trim()] = parts[1].trim();
      }
    });

    const finalBuyUrl = adminForm.buyUrl || `https://www.amazon.in/s?k=${encodeURIComponent(adminForm.name)}&linkCode=ll2&tag=lootora21-21&linkId=adb686c2312ad063f605e51bfbbe995f&ref_=as_li_ss_tl`;
    const finalImageUrl = adminForm.imageUrl || `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`;

    const payload = {
      name: adminForm.name,
      brand: adminForm.brand,
      price: parseFloat(adminForm.price),
      discountPrice: parseFloat(adminForm.discountPrice) || parseFloat(adminForm.price),
      stock: parseInt(adminForm.stock) || 10,
      tags: adminForm.tags || "gaming;gear",
      featured: adminForm.featured,
      description: adminForm.description,
      imageUrl: finalImageUrl,
      galleryImages: galleryArr,
      specifications: specsObj,
      categoryId: parseInt(adminForm.categoryId),
      buyUrl: finalBuyUrl,
      isTrending: adminForm.isTrending,
      isLimitedEdition: adminForm.isLimitedEdition
    };

    try {
      let res;
      if (adminSelectedProduct) {
        res = await fetch(`${API_BASE}/admin/products/${adminSelectedProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/admin/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showNotification(adminSelectedProduct ? "Product updated!" : "Product created!");
        setIsEditModalOpen(false);
        fetchProductsAndCategories();
      } else {
        handleLocalMockCrud(payload);
      }
    } catch (err) {
      handleLocalMockCrud(payload);
    }
  };

  const handleLocalMockCrud = (payload) => {
    if (adminSelectedProduct) {
      const index = products.findIndex(p => p.id === adminSelectedProduct.id);
      const updatedList = [...products];
      updatedList[index] = {
        ...updatedList[index],
        ...payload,
        categoryName: categories.find(c => c.id === payload.categoryId)?.name || "Gear",
        categorySlug: categories.find(c => c.id === payload.categoryId)?.slug || "mice"
      };
      setProducts(updatedList);
      showNotification("Product updated.");
    } else {
      const newMockProd = {
        id: products.length + 1,
        ...payload,
        slug: payload.name.toLowerCase().replace(/ /g, "-"),
        rating: 5.0,
        reviewCount: 0,
        categoryName: categories.find(c => c.id === payload.categoryId)?.name || "Gear",
        categorySlug: categories.find(c => c.id === payload.categoryId)?.slug || "mice",
        reviews: []
      };
      setProducts([newMockProd, ...products]);
      showNotification("Product created.");
    }
    setIsEditModalOpen(false);
  };

  const handleAdminDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    const token = localStorage.getItem("gamevault_token");
    
    try {
      const res = await fetch(`${API_BASE}/admin/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showNotification("Product deleted successfully.");
        fetchProductsAndCategories();
      } else {
        setProducts(prev => prev.filter(p => p.id !== productId));
        showNotification("Product deleted.");
      }
    } catch (err) {
      showNotification("Connection lost. Delete failed.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gamevault_token");
    localStorage.removeItem("gamevault_user");
    setUser(null);
    showNotification("Logged out successfully");
    setCurrentPage("home");
  };

  const navigateToProduct = (slug) => {
    setCurrentProductSlug(slug);
    setCurrentPage("details");
    window.scrollTo(0, 0);
  };

  const selectCategoryNode = (slug) => {
    setActiveCategorySlug(slug);
    setCurrentPage("category");
    window.scrollTo(0, 0);
  };

  const selectBrandNode = (brandSlug) => {
    setActiveBrandSlug(brandSlug);
    setCurrentPage("shop");
    setSearch("");
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative min-h-screen bg-lootora-bg font-poppins text-lootora-text overflow-hidden bg-cyber-grid bg-[size:40px_40px] animate-grid-pan">
      
      {/* Notification banner */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-neonPurple backdrop-blur-md border ${
          notification.type === "error" ? "bg-red-950/80 border-red-500 text-red-200" :
          notification.type === "warning" ? "bg-amber-950/80 border-amber-500 text-amber-200" :
          "bg-lootora-card/90 border-lootora-purple text-lootora-blue"
        } transition-all duration-300 transform translate-y-0 flex items-center space-x-3`}>
          <div className="w-2 h-2 rounded-full bg-lootora-pink animate-pulse" />
          <span className="font-orbitron font-semibold tracking-wider text-sm">{notification.text}</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setCurrentPage("home"); setActiveCategorySlug(""); setActiveBrandSlug(""); }}>
            <Gamepad className="w-8 h-8 text-lootora-pink animate-pulse" />
            <span className="font-orbitron font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-lootora-purple via-lootora-pink to-lootora-blue">
              GAMEVAULT
            </span>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <span className="text-sm font-orbitron text-lootora-purple">{user.username}</span>
            ) : (
              <LogIn className="w-6 h-6 text-lootora-blue" onClick={() => setCurrentPage("auth")} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-orbitron font-medium tracking-widest text-lootora-muted">
          <button onClick={() => { setCurrentPage("home"); setActiveCategorySlug(""); setActiveBrandSlug(""); }} className={`hover:text-lootora-blue transition ${currentPage === "home" ? "text-lootora-blue text-neon-blue" : ""}`}>HOME</button>
          <button onClick={() => { setCurrentPage("shop"); setActiveCategorySlug(""); setActiveBrandSlug(""); setSearch(""); }} className={`hover:text-lootora-blue transition ${currentPage === "shop" && !activeBrandSlug ? "text-lootora-blue text-neon-blue" : ""}`}>DISCOVER</button>
          <button onClick={() => setCurrentPage("setup")} className={`hover:text-lootora-blue transition ${currentPage === "setup" ? "text-lootora-blue text-neon-blue" : ""}`}>SETUP BUILDER</button>
          <button onClick={() => setCurrentPage("wishlist")} className={`hover:text-lootora-blue transition ${currentPage === "wishlist" ? "text-lootora-blue text-neon-blue" : ""}`}>WISHLIST ({wishlist.length})</button>
          <button onClick={() => setCurrentPage("about")} className={`hover:text-lootora-blue transition ${currentPage === "about" ? "text-lootora-blue text-neon-blue" : ""}`}>ABOUT</button>
          {user?.role === "Admin" && (
            <button onClick={() => { setCurrentPage("admin"); fetchAdminStats(); }} className={`hover:text-lootora-pink transition text-lootora-pink/80 flex items-center gap-1 ${currentPage === "admin" ? "text-lootora-pink text-neon-pink" : ""}`}>
              <Settings className="w-4 h-4" /> ADMIN
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search gear..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (currentPage !== "shop") setCurrentPage("shop");
              }}
              className="bg-lootora-bg/80 border border-white/10 rounded-full py-1.5 pl-4 pr-10 text-xs focus:outline-none focus:border-lootora-purple focus:shadow-neonPurple text-lootora-text transition-all w-48"
            />
            <Search className="w-4 h-4 text-lootora-muted absolute right-3.5 top-2" />
          </div>

          {user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-orbitron font-semibold text-lootora-purple">{user.username.toUpperCase()}</span>
                <span className="text-[10px] text-lootora-muted leading-tight">{user.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lootora-purple to-lootora-pink flex items-center justify-center font-orbitron font-bold text-sm text-lootora-text">
                {user.username[0].toUpperCase()}
              </div>
              <button onClick={handleLogout} className="text-lootora-muted hover:text-lootora-pink transition">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setCurrentPage("auth")}
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white px-5 py-2 rounded-md font-orbitron font-semibold text-xs tracking-wider transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </button>
          )}
        </div>
      </nav>

      {/* Pages Container */}
      <main className="px-6 md:px-12 py-10 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader className="w-12 h-12 text-lootora-blue animate-spin mb-4" />
            <span className="font-orbitron text-lootora-muted tracking-widest animate-pulse">DECRYPTING INVENTORY DATA...</span>
          </div>
        ) : (
          <>
            {currentPage === "home" && (
              <HomePage 
                products={products}
                categories={categories}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                handleBuyNow={handleBuyNow}
                navigateToProduct={navigateToProduct}
                setCurrentPage={setCurrentPage}
                selectCategoryNode={selectCategoryNode}
                selectBrandNode={selectBrandNode}
                activeCategoryTab={activeCategoryTab}
                setActiveCategoryTab={setActiveCategoryTab}
                trendingTab={trendingTab}
                setTrendingTab={setTrendingTab}
              />
            )}

            {currentPage === "category" && (
              <CategoryPage 
                slug={activeCategorySlug}
                products={products}
                categories={categories}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                handleBuyNow={handleBuyNow}
                navigateToProduct={navigateToProduct}
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === "shop" && (
              <ShopPage 
                products={products} 
                categories={categories}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                handleBuyNow={handleBuyNow}
                navigateToProduct={navigateToProduct}
                search={search}
                setSearch={setSearch}
                selectedCategory={activeCategorySlug}
                setSelectedCategory={setActiveCategorySlug}
                selectedBrand={activeBrandSlug}
                setSelectedBrand={setActiveBrandSlug}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            )}

            {currentPage === "setup" && (
              <SetupBuilderPage 
                setupBudget={setupBudget}
                setSetupBudget={setSetupBudget}
                setupRecommendation={setupRecommendation}
                setupLoading={setupLoading}
                handleBuyNow={handleBuyNow}
                navigateToProduct={navigateToProduct}
              />
            )}

            {currentPage === "wishlist" && (
              <WishlistPage 
                wishlist={wishlist} 
                toggleWishlist={toggleWishlist}
                handleBuyNow={handleBuyNow}
                navigateToProduct={navigateToProduct}
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === "about" && <AboutPage />}

            {currentPage === "auth" && <AuthPage setUser={setUser} showNotification={showNotification} setCurrentPage={setCurrentPage} />}

            {currentPage === "admin" && (
              <AdminPage 
                products={products}
                categories={categories}
                adminStats={adminStats}
                handleAdminDelete={handleAdminDelete}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                adminSelectedProduct={adminSelectedProduct}
                setAdminSelectedProduct={setAdminSelectedProduct}
                adminForm={adminForm}
                setAdminForm={setAdminForm}
                handleAdminCrud={handleAdminCrud}
              />
            )}

            {currentPage === "details" && (
              <ProductDetailsPage 
                slug={currentProductSlug} 
                products={products}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                handleBuyNow={handleBuyNow}
                navigateToProduct={navigateToProduct}
                user={user}
                showNotification={showNotification}
              />
            )}
          </>
        )}
      </main>

      <Footer setCurrentPage={setCurrentPage} selectCategoryNode={selectCategoryNode} />
    </div>
  );
}

// ----------------------------------------------------
// CANVAS ANIMATED HERO BACKGROUND
// ----------------------------------------------------
function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const particles = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.6 ? "#FF2E88" : (Math.random() > 0.5 ? "#8B5CF6" : "#00E5FF")
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${1 - dist / 130})`;
            ctx.lineWidth = 0.5;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0" />;
}

// ----------------------------------------------------
// HOMEPAGE VIEW
// ----------------------------------------------------
function HomePage({ 
  products, categories, wishlist, toggleWishlist, handleBuyNow, navigateToProduct, 
  setCurrentPage, selectCategoryNode, selectBrandNode, activeCategoryTab, setActiveCategoryTab,
  trendingTab, setTrendingTab
}) {
  
  const categoryThemes = [
    { key: "systems", label: "🖥️ Systems", desc: "Laptops, PCs & Consoles" },
    { key: "peripherals", label: "🖱️ Peripherals", desc: "Mice, Keyboards & Wheels" },
    { key: "audio", label: "🎧 Audio & Video", desc: "Headsets, Mics & webcams" },
    { key: "components", label: "⚙️ PC Hardware", desc: "GPUs, CPUs & Motherboards" },
    { key: "furniture", label: "🪑 Furniture", desc: "Chairs, Desks & RGB" },
    { key: "collectibles", label: "🧸 Collectibles", desc: "Apparel, Figures & Deals" }
  ];

  const categoryItems = categories.filter(c => (c.group || CATEGORY_GROUPS[c.slug]) === activeCategoryTab);

  const getTrendingItems = () => {
    if (trendingTab === "views") {
      // Most viewed: ordered by reviews/ratings
      return [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
    }
    if (trendingTab === "rated") {
      // Top Rated
      return [...products].sort((a, b) => b.rating - a.rating).filter(p => p.rating >= 4.7).slice(0, 4);
    }
    if (trendingTab === "newest") {
      // Latest Products
      return [...products].sort((a, b) => b.id - a.id).slice(0, 4);
    }
    if (trendingTab === "recommended") {
      // Recommended For You
      return products.filter(p => p.isLimitedEdition || p.isTrending).slice(0, 4);
    }
    // Best Sellers
    return products.filter(p => p.isTrending).slice(0, 4);
  };

  return (
    <div className="space-y-28">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-panel rounded-2xl p-8 md:p-24 flex flex-col items-center text-center space-y-8 min-h-[550px] justify-center">
        <CanvasBackground />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-lootora-purple/10 blur-[130px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-orbitron font-bold tracking-widest text-lootora-blue shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-lootora-pink animate-pulse" />
          <span>CYBERPUNK gaming setup database active</span>
        </div>

        <h1 className="text-3xl md:text-7xl font-extrabold font-orbitron tracking-tight leading-none max-w-5xl animate-neon-pulse uppercase">
          Level Up Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lootora-purple via-lootora-pink to-lootora-blue">Gaming Setup</span>
        </h1>

        <p className="text-lootora-muted text-sm md:text-lg max-w-3xl font-light font-poppins">
          Discover gaming gear, accessories, gaming PCs, consoles, collectibles, and gaming merchandise from top brands. Click "Buy Now" to redirect directly to official merchant portals.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 pt-4">
          <button 
            onClick={() => setCurrentPage("shop")}
            className="w-full sm:w-auto bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white px-8 py-3.5 rounded-md font-orbitron font-bold text-xs tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            EXPLORE PRODUCTS
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setTrendingTab("bestseller");
              document.getElementById("trending-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:border-lootora-blue hover:text-lootora-blue px-8 py-3.5 rounded-md font-orbitron font-bold text-xs tracking-wider transition-all"
          >
            TRENDING PRODUCTS
          </button>
        </div>
      </section>

      {/* Shop By Categories */}
      <section className="space-y-10">
        <div className="border-b border-white/5 pb-4 text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-black font-orbitron tracking-widest text-white uppercase">SHOP BY CATEGORY</h2>
          <p className="text-xs text-lootora-muted">Filter our catalog by hardware component or accessory node.</p>
        </div>

        {/* Categories Tab selectors */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {categoryThemes.map(theme => (
            <button
              key={theme.key}
              onClick={() => setActiveCategoryTab(theme.key)}
              className={`p-3 rounded-lg border text-center transition-all ${
                activeCategoryTab === theme.key
                  ? "border-lootora-blue bg-lootora-blue/10 shadow-neonBlue text-white"
                  : "border-white/5 bg-lootora-card/60 text-lootora-muted hover:border-white/10 hover:bg-lootora-card"
              }`}
            >
              <div className="font-orbitron font-bold text-[11px] tracking-wider uppercase leading-none">{theme.label}</div>
              <span className="text-[8px] text-lootora-muted block mt-1 leading-none">{theme.desc}</span>
            </button>
          ))}
        </div>

        {/* Categories list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {categoryItems.map(cat => (
            <div 
              key={cat.id}
              onClick={() => selectCategoryNode(cat.slug)}
              className="glass-panel glass-panel-hover p-6 rounded-xl cursor-pointer flex flex-col justify-between min-h-[160px] group relative overflow-hidden border border-white/5 hover:border-lootora-blue/40"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-lootora-blue/5 blur-2xl group-hover:bg-lootora-blue/15 transition-all" />
              <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(0,229,255,0.4)] group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-orbitron font-extrabold tracking-widest group-hover:text-lootora-blue transition uppercase mt-4">{cat.name}</h3>
                <p className="text-[10px] text-lootora-muted line-clamp-2 leading-relaxed font-light">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section id="trending-section" className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-black font-orbitron tracking-widest text-white uppercase">TRENDING PRODUCTS</h2>
            <p className="text-xs text-lootora-muted">Dynamic catalog streams showing best selling and recommended hardware.</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-lootora-card p-1 border border-white/5 rounded overflow-x-auto max-w-full">
            {[
              { key: "bestseller", label: "BEST SELLERS" },
              { key: "views", label: "MOST VIEWED" },
              { key: "rated", label: "TOP RATED" },
              { key: "newest", label: "LATEST PRODUCTS" },
              { key: "recommended", label: "RECOMMENDED" }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setTrendingTab(tab.key)}
                className={`px-3 py-1.5 rounded text-[9px] font-orbitron font-extrabold tracking-widest shrink-0 transition-all ${
                  trendingTab === tab.key
                    ? "bg-lootora-purple text-white shadow-neonPurple"
                    : "text-lootora-muted hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getTrendingItems().map(product => (
            <ProductCard 
              key={product.id}
              product={product} 
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              handleBuyNow={handleBuyNow}
              navigateToProduct={navigateToProduct}
            />
          ))}
        </div>
      </section>

      {/* Shop By Brand Section (30 Brands) */}
      <section className="space-y-10">
        <div className="border-b border-white/5 pb-4 text-center max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black font-orbitron tracking-widest text-white uppercase">SHOP BY BRAND</h2>
          <p className="text-xs text-lootora-muted mt-1">Configure filtered displays targeting specific hardware builders.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {FEATURED_BRANDS.map(brand => (
            <div 
              key={brand.slug}
              onClick={() => selectBrandNode(brand.slug)}
              className={`glass-panel p-5 rounded-lg border border-white/5 hover:border-[${brand.color}] hover:${brand.glow} cursor-pointer group flex flex-col justify-between space-y-3 transition-all duration-300`}
              style={{ borderLeft: `3px solid ${brand.color}` }}
            >
              <div>
                <span className="font-orbitron font-black text-sm tracking-wider text-white group-hover:text-lootora-blue transition block">
                  {brand.name.toUpperCase()}
                </span>
                <p className="text-[10px] text-lootora-muted leading-relaxed font-light mt-2 line-clamp-3">
                  {brand.desc}
                </p>
              </div>

              <div className="text-[9px] font-orbitron text-lootora-blue group-hover:text-lootora-pink flex items-center gap-1 justify-end">
                VIEW NODES <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// ----------------------------------------------------
// PRODUCT CARD COMPONENT
// ----------------------------------------------------
function ProductCard({ product, wishlist, toggleWishlist, handleBuyNow, navigateToProduct }) {
  const isSaved = wishlist.some(item => item.id === product.id);

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col justify-between group border border-white/5 hover:border-lootora-purple/40 hover:shadow-neonPurple transition-all duration-300">
      
      <div className="relative pt-[70%] bg-white/2 overflow-hidden cursor-pointer" onClick={() => navigateToProduct(product.slug)}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"; }}
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isLimitedEdition && (
            <span className="bg-lootora-pink/80 backdrop-blur-md text-white text-[8px] font-orbitron font-bold px-2 py-0.5 rounded tracking-wider shadow">LIMITED</span>
          )}
          {product.isTrending && (
            <span className="bg-lootora-purple/80 backdrop-blur-md text-white text-[8px] font-orbitron font-bold px-2 py-0.5 rounded tracking-wider shadow">HOT</span>
          )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 hover:border-lootora-pink p-2 rounded-full text-lootora-muted hover:text-lootora-pink transition"
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-lootora-pink text-lootora-pink" : ""}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-lootora-muted font-semibold tracking-wider font-orbitron">
            <span>{product.brand.toUpperCase()}</span>
            <span className="text-lootora-blue">{product.categoryName?.toUpperCase() || "GEAR"}</span>
          </div>
          <h3 
            onClick={() => navigateToProduct(product.slug)}
            className="font-orbitron font-bold text-sm tracking-wide text-white group-hover:text-lootora-blue transition cursor-pointer line-clamp-1 mt-1"
          >
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-1 pt-1">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? "fill-amber-500" : ""}`} />
              ))}
            </div>
            <span className="text-[10px] text-lootora-muted">({product.reviewCount || 0})</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-col">
            {product.discountPrice && product.discountPrice < product.price ? (
              <>
                <span className="font-orbitron font-black text-sm text-lootora-blue">
                  ₹{(product.discountPrice).toLocaleString()}
                </span>
                <span className="text-[9px] text-lootora-muted line-through leading-none">
                  ₹{(product.price).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-orbitron font-black text-sm text-lootora-text">
                ₹{(product.price || 0).toLocaleString()}
              </span>
            )}
          </div>
          <button 
            onClick={() => handleBuyNow(product.id, product.buyUrl)}
            className="bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-lootora-purple hover:to-lootora-pink hover:border-transparent text-white px-3.5 py-1.5 rounded text-[10px] font-orbitron font-bold tracking-widest transition-all"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// CATEGORY PAGE / PRODUCT LISTING VIEW
// ----------------------------------------------------
function CategoryPage({ slug, products, categories, wishlist, toggleWishlist, handleBuyNow, navigateToProduct, setCurrentPage }) {
  const [catSearch, setCatSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceMax, setPriceMax] = useState(200000);

  const category = categories.find(c => c.slug === slug);
  
  if (!category) return null;

  const catProducts = products.filter(p => {
    const isThisCategory = p.categorySlug === slug || p.categoryName?.toLowerCase() === category.name.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(catSearch.toLowerCase()) || p.brand.toLowerCase().includes(catSearch.toLowerCase());
    const matchesBrand = selectedBrand ? p.brand.toLowerCase() === selectedBrand.toLowerCase() : true;
    const matchesPrice = p.price <= priceMax;
    return isThisCategory && matchesSearch && matchesBrand && matchesPrice;
  });

  const uniqueBrands = Array.from(new Set(products.filter(p => p.categorySlug === slug).map(p => p.brand)));

  return (
    <div className="space-y-8">
      {/* Category Banner */}
      <section className="glass-panel p-8 md:p-12 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-lootora-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-lootora-blue/5 blur-2xl pointer-events-none" />
        <div className="space-y-2 relative">
          <button onClick={() => setCurrentPage("home")} className="text-[10px] font-orbitron text-lootora-blue hover:underline tracking-widest">
            ← RETREAT TO HUB
          </button>
          <h1 className="text-3xl font-black font-orbitron text-white uppercase">{category.name}</h1>
          <p className="text-xs text-lootora-muted max-w-xl font-light font-poppins">{category.description}</p>
        </div>

        <div className="glass-panel px-6 py-4 rounded-lg text-center flex flex-row md:flex-col gap-6 md:gap-0 justify-around shrink-0 border border-white/5">
          <div>
            <span className="text-[8px] font-orbitron text-lootora-muted tracking-widest block">CATALOG DATA</span>
            <span className="font-orbitron font-black text-xl text-lootora-blue">{catProducts.length} PRODUCTS</span>
          </div>
        </div>
      </section>

      {/* Grid Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar filters */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-xl space-y-6 max-h-[500px]">
          <span className="font-orbitron font-bold tracking-widest text-xs text-white border-b border-white/5 pb-3 block">FILTER MATRIX</span>

          <div className="space-y-1">
            <label className="text-[9px] font-orbitron text-lootora-muted tracking-widest uppercase">SEARCH</label>
            <input
              type="text"
              placeholder="Keyword..."
              value={catSearch}
              onChange={(e) => setCatSearch(e.target.value)}
              className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-lootora-blue text-white"
            />
          </div>

          {uniqueBrands.length > 0 && (
            <div className="space-y-1">
              <label className="text-[9px] font-orbitron text-lootora-muted tracking-widest uppercase">MANUFACTURER</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-lootora-blue text-lootora-muted font-orbitron"
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-orbitron text-lootora-muted tracking-widest">
              <span>MAX BUDGET</span>
              <span className="text-lootora-pink">₹{priceMax.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              className="w-full accent-lootora-pink cursor-pointer bg-lootora-bg"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {catProducts.length === 0 ? (
            <div className="glass-panel text-center py-20 rounded-xl space-y-3">
              <span className="font-orbitron font-extrabold text-lootora-pink block text-sm tracking-widest">NO HARDWARE MAPPED</span>
              <p className="text-[11px] text-lootora-muted font-light font-poppins">No items found matching the filter attributes under this category node.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {catProducts.map(p => (
                <ProductCard 
                  key={p.id}
                  product={p}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  handleBuyNow={handleBuyNow}
                  navigateToProduct={navigateToProduct}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// DISCOVER / SHOP VIEW (GLOBAL SEARCH PORTAL)
// ----------------------------------------------------
function ShopPage({ 
  products, categories, wishlist, toggleWishlist, handleBuyNow, navigateToProduct,
  search, setSearch, selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand, priceRange, setPriceRange,
  minRating, setMinRating, sortBy, setSortBy
}) {
  const [currentPageNum, setCurrentPageNum] = useState(1);

  useEffect(() => {
    setCurrentPageNum(1);
  }, [search, selectedCategory, selectedBrand, priceRange, minRating, sortBy]);

  const brands = Array.from(new Set(products.map(p => p.brand)));

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                        p.brand.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory ? (p.categorySlug === selectedCategory || p.categoryName?.toLowerCase() === selectedCategory.toLowerCase()) : true;
    const matchBrand = selectedBrand ? p.brand.toLowerCase() === selectedBrand.toLowerCase() : true;
    const matchPrice = p.price <= priceRange;
    const matchRating = p.rating >= minRating;
    return matchSearch && matchCategory && matchBrand && matchPrice && matchRating;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return b.reviewCount - a.reviewCount;
  });

  return (
    <div className="space-y-8">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-3xl font-black font-orbitron tracking-widest uppercase">DISCOVER PORTAL</h1>
        <p className="text-xs text-lootora-muted">Calibrate parameters to reveal limited inventory caches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-orbitron font-bold tracking-widest text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-lootora-blue" /> CALIBRATE
              </span>
              <button 
                onClick={() => {
                  setSearch(""); setSelectedCategory(""); setSelectedBrand("");
                  setPriceRange(200000); setMinRating(0); setSortBy("popularity");
                }}
                className="text-[10px] font-orbitron text-lootora-pink hover:underline"
              >
                RESET ALL
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">SEARCH NAME</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-lootora-blue text-lootora-text"
                />
                <Search className="w-3.5 h-3.5 text-lootora-muted absolute right-3 top-2.5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">CATEGORY</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-lootora-blue text-lootora-muted"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">BRAND</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-lootora-blue text-lootora-muted"
              >
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b} value={b.toLowerCase()}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest">
                <span>MAX BUDGET</span>
                <span className="text-lootora-pink">₹{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="200000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-lootora-pink cursor-pointer bg-lootora-bg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">MINIMUM RATING</label>
              <div className="flex space-x-2">
                {[0, 3, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex-1 text-center py-1 border rounded text-[10px] font-orbitron transition ${
                      minRating === rating 
                        ? "border-lootora-purple bg-lootora-purple/20 text-white" 
                        : "border-white/5 bg-lootora-bg text-lootora-muted hover:border-white/20"
                    }`}
                  >
                    {rating === 0 ? "ALL" : `${rating}★+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/2 border border-white/5 p-4 rounded-xl">
            <span className="font-orbitron font-bold text-xs tracking-wider text-lootora-muted">
              RECORDS LOCATED: <span className="text-lootora-blue">{sortedProducts.length} UNIT(S)</span>
            </span>
            
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest">SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-lootora-bg border border-white/10 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-lootora-blue text-lootora-muted font-orbitron"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrival</option>
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="glass-panel text-center py-20 rounded-xl space-y-4">
              <span className="font-orbitron font-extrabold text-lootora-pink block text-lg tracking-widest">ZERO MATCHES FOUND</span>
              <span className="text-xs text-lootora-muted font-light font-poppins block">No records match your criteria. Please calibrate your parameters.</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.slice((currentPageNum - 1) * 12, currentPageNum * 12).map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product} 
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    handleBuyNow={handleBuyNow}
                    navigateToProduct={navigateToProduct}
                  />
                ))}
              </div>

              {/* Pagination Component */}
              {Math.ceil(sortedProducts.length / 12) > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-10 border-t border-white/5">
                  <button
                    disabled={currentPageNum === 1}
                    onClick={() => { setCurrentPageNum(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }}
                    className="px-3.5 py-1.5 rounded border border-white/10 bg-lootora-card hover:bg-lootora-purple/20 text-xs font-orbitron font-bold tracking-widest disabled:opacity-30 disabled:pointer-events-none transition"
                  >
                    PREV
                  </button>
                  {Array.from({ length: Math.min(5, Math.ceil(sortedProducts.length / 12)) }).map((_, idx) => {
                    const totalPages = Math.ceil(sortedProducts.length / 12);
                    let targetPage = currentPageNum;
                    if (currentPageNum <= 3) {
                      targetPage = idx + 1;
                    } else if (currentPageNum >= totalPages - 2) {
                      targetPage = totalPages - 4 + idx;
                    } else {
                      targetPage = currentPageNum - 2 + idx;
                    }
                    if (targetPage < 1 || targetPage > totalPages) return null;
                    return (
                      <button
                        key={targetPage}
                        onClick={() => { setCurrentPageNum(targetPage); window.scrollTo(0, 0); }}
                        className={`px-3 py-1.5 rounded border text-xs font-orbitron font-bold transition ${
                          currentPageNum === targetPage
                            ? "border-lootora-purple bg-lootora-purple/30 text-white shadow-neonPurple"
                            : "border-white/5 bg-lootora-bg text-lootora-muted hover:border-white/20"
                        }`}
                      >
                        {targetPage}
                      </button>
                    );
                  })}
                  <button
                    disabled={currentPageNum === Math.ceil(sortedProducts.length / 12)}
                    onClick={() => { setCurrentPageNum(prev => Math.min(prev + 1, Math.ceil(sortedProducts.length / 12))); window.scrollTo(0, 0); }}
                    className="px-3.5 py-1.5 rounded border border-white/10 bg-lootora-card hover:bg-lootora-purple/20 text-xs font-orbitron font-bold tracking-widest disabled:opacity-30 disabled:pointer-events-none transition"
                  >
                    NEXT
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// GAMING SETUP BUILDER VIEW
// ----------------------------------------------------
function SetupBuilderPage({ 
  setupBudget, setSetupBudget, setupRecommendation, setupLoading, handleBuyNow, navigateToProduct 
}) {
  const budgetTiers = [
    { value: 25000, label: "₹25K", desc: "Esports Rookie Setup" },
    { value: 50000, label: "₹50K", desc: "Core Gamer Setup" },
    { value: 75000, label: "₹75K", desc: "Pro Streamer Setup" },
    { value: 100000, label: "₹100K+", desc: "Godlike OLED Setup" }
  ];

  const specLabels = {
    keyboard: "KEYBOARD",
    mouse: "MOUSE",
    headset: "HEADSET",
    monitor: "MONITOR",
    chair: "CHAIR"
  };

  const getSavingsColor = () => {
    if (!setupRecommendation) return "text-white";
    const delta = setupRecommendation.budget - setupRecommendation.totalCost;
    return delta >= 0 ? "text-green-400" : "text-lootora-pink";
  };

  const deltaBudget = setupRecommendation ? (setupRecommendation.budget - setupRecommendation.totalCost) : 0;

  return (
    <div className="space-y-10">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-3xl font-black font-orbitron tracking-widest uppercase">SETUP CONSTRUCTOR</h1>
        <p className="text-xs text-lootora-muted">Select your budget envelope. The AI will recommend calibrated components.</p>
      </div>

      <section className="glass-panel p-8 rounded-xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-lootora-blue/5 blur-3xl pointer-events-none" />
        
        <div className="text-center max-w-md mx-auto space-y-2">
          <span className="text-[10px] font-orbitron font-extrabold tracking-widest text-lootora-blue block">CREDIT LINE TIER</span>
          <span className="font-orbitron font-black text-2xl tracking-wider block text-white">CHOOSE ALLOCATION</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {budgetTiers.map(tier => (
            <button
              key={tier.value}
              onClick={() => setSetupBudget(tier.value)}
              className={`p-5 rounded-lg border text-left flex flex-col justify-between transition-all relative ${
                setupBudget === tier.value
                  ? "border-lootora-purple bg-lootora-purple/10 shadow-neonPurple text-white"
                  : "border-white/5 bg-lootora-card/60 text-lootora-muted hover:border-white/20 hover:bg-lootora-card"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-orbitron font-extrabold text-sm tracking-widest">{tier.label}</span>
                {setupBudget === tier.value && <Check className="w-4 h-4 text-lootora-blue" />}
              </div>
              <span className="text-[9px] font-medium tracking-wide mt-4 uppercase leading-none">{tier.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {setupLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader className="w-10 h-10 text-lootora-purple animate-spin mb-4" />
          <span className="font-orbitron text-xs text-lootora-muted tracking-widest">RUNNING SIMULATIONS...</span>
        </div>
      ) : setupRecommendation ? (
        <div className="space-y-8">
          
          <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-lootora-blue">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:w-auto">
              <div>
                <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest block uppercase">BUDGET TIER</span>
                <span className="font-orbitron font-black text-lg text-white">₹{setupBudget.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest block uppercase">RECOMMENDED TOTAL</span>
                <span className="font-orbitron font-black text-lg text-lootora-blue">₹{setupRecommendation.totalCost.toLocaleString()}</span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest block uppercase">SURPLUS/DEFICIT</span>
                <span className={`font-orbitron font-black text-lg ${getSavingsColor()}`}>
                  {deltaBudget >= 0 ? `+₹${deltaBudget.toLocaleString()}` : `-₹${Math.abs(deltaBudget).toLocaleString()}`}
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                const items = ["keyboard", "mouse", "headset", "monitor", "chair"];
                items.forEach((key, idx) => {
                  const item = setupRecommendation[key];
                  if (item) {
                    setTimeout(() => handleBuyNow(item.id, item.buyUrl), idx * 400);
                  }
                });
              }}
              className="w-full md:w-auto bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white px-6 py-3 rounded-lg font-orbitron font-extrabold text-xs tracking-wider transition-all"
            >
              ORDER ENTIRE BUILD
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {["keyboard", "mouse", "headset", "monitor", "chair"].map(key => {
              const item = setupRecommendation[key];
              if (!item) return null;

              return (
                <div key={key} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-4 group hover:border-lootora-purple/30 transition-all">
                  <div className="space-y-3">
                    <span className="bg-lootora-bg text-lootora-blue text-[8px] font-orbitron font-bold px-2 py-0.5 rounded tracking-widest border border-lootora-blue/20">
                      {specLabels[key]}
                    </span>
                    
                    <div 
                      className="relative pt-[70%] rounded overflow-hidden cursor-pointer"
                      onClick={() => navigateToProduct(item.slug)}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"; }}
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-orbitron text-lootora-muted tracking-wider block uppercase">{item.brand}</span>
                      <h4 
                        onClick={() => navigateToProduct(item.slug)}
                        className="font-orbitron font-bold text-xs tracking-wide text-white cursor-pointer hover:text-lootora-blue transition line-clamp-1"
                      >
                        {item.name}
                      </h4>
                      <span className="font-orbitron font-extrabold text-xs text-lootora-text block pt-1">
                        ₹{(item.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleBuyNow(item.id, item.buyUrl)}
                    className="w-full text-center py-2 bg-white/5 border border-white/10 hover:border-lootora-pink/30 hover:text-lootora-pink rounded text-[9px] font-orbitron font-bold tracking-widest transition-all"
                  >
                    BUY ITEM
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      ) : null}
    </div>
  );
}

// ----------------------------------------------------
// WISHLIST VIEW
// ----------------------------------------------------
function WishlistPage({ wishlist, toggleWishlist, handleBuyNow, navigateToProduct, setCurrentPage }) {
  return (
    <div className="space-y-8">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-3xl font-black font-orbitron tracking-widest uppercase">SAVED VAULT</h1>
        <p className="text-xs text-lootora-muted">Hardware caches earmarked for future deployment.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel text-center py-24 rounded-xl space-y-6 max-w-2xl mx-auto">
          <Gamepad className="w-12 h-12 text-lootora-muted mx-auto animate-pulse" />
          <div className="space-y-2">
            <span className="font-orbitron font-extrabold text-lootora-pink block text-lg tracking-widest">VAULT IS EMPTY</span>
            <span className="text-xs text-lootora-muted font-light font-poppins block max-w-sm mx-auto leading-relaxed">
              Explore the discovery network and bookmark top-tier equipment to populate your personal repository.
            </span>
          </div>
          <button 
            onClick={() => setCurrentPage("shop")}
            className="bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white px-6 py-2.5 rounded font-orbitron font-bold text-xs tracking-wider transition-all"
          >
            DISCOVER GEAR
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="glass-panel rounded-xl overflow-hidden flex flex-col justify-between group border border-white/5 hover:border-lootora-purple/40 hover:shadow-neonPurple transition-all">
              <div className="relative pt-[70%] bg-white/2 overflow-hidden cursor-pointer" onClick={() => navigateToProduct(product.slug)}>
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 bg-black/60 border border-white/10 hover:border-lootora-pink p-2 rounded-full text-lootora-pink transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-lootora-muted font-semibold tracking-wider font-orbitron">
                    <span>{product.brand.toUpperCase()}</span>
                    <span className="text-lootora-blue">{product.categoryName?.toUpperCase() || "GEAR"}</span>
                  </div>
                  <h3 
                    onClick={() => navigateToProduct(product.slug)}
                    className="font-orbitron font-bold text-sm tracking-wide text-white group-hover:text-lootora-blue transition cursor-pointer line-clamp-1 mt-1"
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="font-orbitron font-black text-sm text-lootora-text">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => handleBuyNow(product.id, product.buyUrl)}
                    className="bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white px-4 py-1.5 rounded text-[10px] font-orbitron font-bold tracking-widest transition-all"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// PRODUCT DETAILS VIEW
// ----------------------------------------------------
function ProductDetailsPage({ 
  slug, products, wishlist, toggleWishlist, handleBuyNow, navigateToProduct, user, showNotification 
}) {
  const [productDetails, setProductDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  
  // Review inputs
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [slug]);

  const fetchDetails = async () => {
    setDetailsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/product/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProductDetails(data);
        setSelectedPhoto(data.imageUrl);
      } else {
        loadMockDetails();
      }
    } catch (err) {
      loadMockDetails();
    } finally {
      setDetailsLoading(false);
    }
  };

  const loadMockDetails = () => {
    const matched = products.find(p => p.slug === slug);
    if (matched) {
      const mockDet = {
        ...matched,
        galleryImages: matched.galleryImages && matched.galleryImages.length > 0 ? matched.galleryImages : [matched.imageUrl],
        specifications: matched.specifications || {},
        reviews: matched.reviews || []
      };
      setProductDetails(mockDet);
      setSelectedPhoto(mockDet.imageUrl);
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification("Please Sign In to add reviews", "warning");
      return;
    }
    if (!reviewComment.trim()) {
      showNotification("Review comment cannot be empty", "warning");
      return;
    }

    setSubmitLoading(true);
    const token = localStorage.getItem("gamevault_token");
    try {
      const res = await fetch(`${API_BASE}/product/${productDetails.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });

      if (res.ok) {
        const data = await res.json();
        showNotification("Review published!");
        setReviewComment("");
        fetchDetails();
      } else {
        postMockReview();
      }
    } catch (err) {
      postMockReview();
    } finally {
      setSubmitLoading(false);
    }
  };

  const postMockReview = () => {
    const newRev = {
      id: (productDetails.reviews?.length || 0) + 1,
      username: user.username,
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString()
    };
    const updatedReviews = [newRev, ...(productDetails.reviews || [])];
    const avgRating = Math.round(updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length * 10) / 10;
    
    setProductDetails(prev => ({
      ...prev,
      reviews: updatedReviews,
      rating: avgRating,
      reviewCount: updatedReviews.length
    }));
    
    setReviewComment("");
    showNotification("Review published (Offline Mode)");
  };

  const isSaved = wishlist.some(item => item.id === productDetails?.id);

  if (detailsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader className="w-10 h-10 text-lootora-blue animate-spin mb-4" />
        <span className="font-orbitron text-xs text-lootora-muted tracking-widest">LOADING SPEC SHEETS...</span>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="glass-panel text-center py-20 rounded-xl space-y-4">
        <span className="font-orbitron font-extrabold text-lootora-pink block text-lg tracking-widest">PRODUCT NOT FOUND</span>
        <span className="text-xs text-lootora-muted block font-poppins">The selected item slug could not be located in database catalogs.</span>
      </div>
    );
  }

  const related = products
    .filter(p => p.categorySlug === productDetails.categorySlug && p.id !== productDetails.id)
    .slice(0, 4);

  return (
    <div className="space-y-16">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative pt-[80%] rounded-xl overflow-hidden border border-white/5 glass-panel bg-white/2">
            <img 
              src={selectedPhoto} 
              alt={productDetails.name}
              className="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-300"
            />
          </div>
          
          {productDetails.galleryImages && productDetails.galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productDetails.galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(img)}
                  className={`relative w-20 h-20 rounded border overflow-hidden flex-shrink-0 bg-lootora-card ${
                    selectedPhoto === img ? "border-lootora-blue" : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specs / Summary */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-orbitron font-semibold tracking-widest text-lootora-muted border-b border-white/5 pb-3">
              <span>{productDetails.brand.toUpperCase()} BRAND GEAR</span>
              <span className="text-lootora-blue uppercase">{productDetails.categoryName}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide uppercase text-white font-orbitron">
              {productDetails.name}
            </h1>

            <div className="flex items-center space-x-2">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(productDetails.rating) ? "fill-amber-500" : ""}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-white">{productDetails.rating} ★</span>
              <span className="text-xs text-lootora-muted">({productDetails.reviewCount} user reviews)</span>
            </div>

            <p className="text-lootora-muted text-sm leading-relaxed font-light font-poppins pt-2">
              {productDetails.description}
            </p>

            {/* Unique features highlights */}
            <div className="pt-4 space-y-2">
              <span className="text-[10px] font-orbitron font-extrabold tracking-wider text-lootora-blue uppercase block">PRODUCT FEATURES</span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-lootora-muted font-light">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lootora-purple shrink-0" /> Premium Cyberpunk Aesthetics</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lootora-purple shrink-0" /> High-End Build Quality</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lootora-purple shrink-0" /> Low Input Latency Calibration</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lootora-purple shrink-0" /> Official Manufacturer Validation</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-baseline space-x-2">
              <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest">RATED PRICE:</span>
              <span className="text-2xl font-black font-orbitron text-white">₹{productDetails.price.toLocaleString()}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleBuyNow(productDetails.id, productDetails.buyUrl)}
                className="flex-1 bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white py-3.5 rounded-lg font-orbitron font-extrabold text-xs tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                PROCEED TO PURCHASE
                <ExternalLink className="w-4 h-4" />
              </button>
              <button 
                onClick={() => toggleWishlist(productDetails)}
                className={`px-6 py-3.5 rounded-lg border font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isSaved 
                    ? "border-lootora-pink bg-lootora-pink/10 text-lootora-pink" 
                    : "border-white/10 hover:border-lootora-purple hover:text-lootora-purple text-lootora-muted"
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-lootora-pink" : ""}`} />
                <span>{isSaved ? "VAULTED" : "SAVE TO VAULT"}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Specifications */}
      <section className="space-y-6">
        <div className="border-b border-white/5 pb-3">
          <h3 className="font-orbitron font-black text-lg tracking-widest uppercase">TECHNICAL SPECIFICATIONS</h3>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
          <table className="w-full text-left text-xs font-poppins border-collapse">
            <tbody>
              {Object.keys(productDetails.specifications).length === 0 ? (
                <tr>
                  <td className="p-4 text-lootora-muted">Standard operational metrics apply. Specific parameter metrics not indexed.</td>
                </tr>
              ) : (
                Object.entries(productDetails.specifications).map(([key, val], idx) => (
                  <tr key={key} className={`${idx % 2 === 0 ? "bg-white/2" : "bg-transparent"} border-b border-white/5`}>
                    <td className="p-4 font-bold font-orbitron tracking-wider text-lootora-muted w-1/3 border-r border-white/5 uppercase">{key}</td>
                    <td className="p-4 text-white font-medium">{val}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reviews */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-orbitron font-black text-lg tracking-widest uppercase">OPERATIVE EVALUATIONS</h3>
          </div>

          {(productDetails.reviews || []).length === 0 ? (
            <div className="glass-panel p-8 text-center text-xs text-lootora-muted rounded-xl">
              No field test reports filed for this hardware. Be the first to catalog parameters.
            </div>
          ) : (
            <div className="space-y-4">
              {productDetails.reviews.map(rev => (
                <div key={rev.id} className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-orbitron font-extrabold text-lootora-blue">{rev.username}</span>
                    <span className="text-[10px] text-lootora-muted">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-amber-500" : ""}`} />
                    ))}
                  </div>
                  <p className="text-xs text-lootora-muted font-light leading-relaxed pt-1">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-orbitron font-black text-lg tracking-widest uppercase">SUBMIT RECON LOG</h3>
          </div>

          <form onSubmit={handlePostReview} className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">CALIBRATE RATING</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="text-amber-500 hover:scale-110 transition"
                  >
                    <Star className={`w-6 h-6 ${star <= reviewRating ? "fill-amber-500" : "text-lootora-muted"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">COMMUNICATIONS FEED</label>
              <textarea
                rows="4"
                placeholder="Log performance stats, feedback, ergonomics..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-lootora-purple"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white py-2.5 rounded font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
            >
              {submitLoading ? <Loader className="w-4 h-4 animate-spin" /> : "PUBLISH DISPATCH"}
            </button>
          </form>
        </div>

      </section>

      {/* Synergistic Related Products */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-orbitron font-black text-lg tracking-widest uppercase">SYNERGISTIC SOLUTIONS</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard 
                key={p.id}
                product={p} 
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                handleBuyNow={handleBuyNow}
                navigateToProduct={navigateToProduct}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

// ----------------------------------------------------
// ABOUT VIEW
// ----------------------------------------------------
function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-10">
      <div className="border-b border-white/5 pb-4 text-center">
        <h1 className="text-4xl font-black font-orbitron tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-lootora-purple via-lootora-pink to-lootora-blue">MISSION BRIEF</h1>
        <p className="text-xs text-lootora-muted mt-2">Index coordinates: GameVault Discovery Subsystems.</p>
      </div>

      <div className="glass-panel p-8 rounded-xl space-y-6 text-sm font-poppins leading-relaxed font-light text-lootora-muted">
        <p>
          <strong className="font-orbitron font-extrabold text-white">GAMEVAULT</strong> is an interactive catalog mapping premium gaming equipment, hardware platforms, collectibles, and apparel. We curate indexes based on ergonomics, thermal efficacy, design aesthetic, and retail authenticity.
        </p>
        <p>
          GameVault does <strong className="text-lootora-pink font-semibold">NOT</strong> process transactions, execute direct sales, or store merchant inventory. Instead, GameVault functions as a redirection node, connecting gamers to authentic official brand storefronts (e.g. Razer, Logitech, PlayStation, Xbox, Secretlab) or large retailers for secure direct fulfillment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-center border-t border-white/5">
          <div className="p-4 rounded-lg bg-white/2 border border-white/5">
            <h3 className="font-orbitron font-extrabold text-lootora-blue tracking-wide text-xs">DIRECT LINK REDIRECTS</h3>
            <span className="text-[11px] block mt-1">Zero intermediary markups. Complete authentic vendor validation.</span>
          </div>
          <div className="p-4 rounded-lg bg-white/2 border border-white/5">
            <h3 className="font-orbitron font-extrabold text-lootora-purple tracking-wide text-xs">SETUP CALIBRATIONS</h3>
            <span className="text-[11px] block mt-1">Algorithmic budget matching matching keyboards, mice, headsets.</span>
          </div>
          <div className="p-4 rounded-lg bg-white/2 border border-white/5">
            <h3 className="font-orbitron font-extrabold text-lootora-pink tracking-wide text-xs">SPECIFICATIONS MATRICES</h3>
            <span className="text-[11px] block mt-1">Unified specs tracking across dimensions, sensors, and microcontrollers.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// AUTHENTICATION VIEW
// ----------------------------------------------------
function AuthPage({ setUser, showNotification, setCurrentPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || (!isLogin && !email)) {
      showNotification("Please fill in all inputs", "warning");
      return;
    }

    setAuthLoading(true);
    try {
      if (isSupabaseConfigured && (username.includes("@") || !isLogin)) {
        if (isLogin) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password
          });
          if (error) throw error;

          // Attempt backend login sync
          try {
            const syncRes = await fetch(`${API_BASE}/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ usernameOrEmail: username, password })
            });

            if (syncRes.ok) {
              const syncData = await syncRes.json();
              localStorage.setItem("gamevault_token", syncData.token);
              localStorage.setItem("gamevault_user", JSON.stringify({ username: syncData.username, email: syncData.email, role: syncData.role }));
              setUser({ username: syncData.username, email: syncData.email, role: syncData.role });
            } else {
              // Automatically register in backend if they exist in Supabase but database reset
              const autoRegRes = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  username: data.user?.user_metadata?.username || data.user?.email?.split('@')[0] || "Gamer", 
                  email: data.user?.email || username, 
                  password 
                })
              });
              if (autoRegRes.ok) {
                const syncData = await autoRegRes.json();
                localStorage.setItem("gamevault_token", syncData.token);
                localStorage.setItem("gamevault_user", JSON.stringify({ username: syncData.username, email: syncData.email, role: syncData.role }));
                setUser({ username: syncData.username, email: syncData.email, role: syncData.role });
              } else {
                // local fallback
                const userObj = { username: data.user?.user_metadata?.username || data.user?.email?.split('@')[0] || "Gamer", email: data.user?.email || username, role: "User" };
                localStorage.setItem("gamevault_token", "supabase_active_token");
                localStorage.setItem("gamevault_user", JSON.stringify(userObj));
                setUser(userObj);
              }
            }
          } catch (syncErr) {
            const userObj = { username: data.user?.user_metadata?.username || data.user?.email?.split('@')[0] || "Gamer", email: data.user?.email || username, role: "User" };
            localStorage.setItem("gamevault_token", "supabase_active_token");
            localStorage.setItem("gamevault_user", JSON.stringify(userObj));
            setUser(userObj);
          }

          showNotification(`Authorized via Supabase. Welcome back, ${data.user?.user_metadata?.username || data.user?.email}!`);
          setCurrentPage("home");
        } else {
          // Supabase signup
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                username: username
              }
            }
          });
          if (error) throw error;

          // Sync registration to backend
          try {
            const syncRes = await fetch(`${API_BASE}/auth/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, email, password })
            });

            if (syncRes.ok) {
              const syncData = await syncRes.json();
              localStorage.setItem("gamevault_token", syncData.token);
              localStorage.setItem("gamevault_user", JSON.stringify({ username: syncData.username, email: syncData.email, role: syncData.role }));
              setUser({ username: syncData.username, email: syncData.email, role: syncData.role });
            } else {
              const userObj = { username, email, role: "User" };
              localStorage.setItem("gamevault_token", "supabase_active_token");
              localStorage.setItem("gamevault_user", JSON.stringify(userObj));
              setUser(userObj);
            }
          } catch (syncErr) {
            const userObj = { username, email, role: "User" };
            localStorage.setItem("gamevault_token", "supabase_active_token");
            localStorage.setItem("gamevault_user", JSON.stringify(userObj));
            setUser(userObj);
          }

          showNotification(`Verification email sent (Supabase)! Profile node ${username} initialized.`);
          setCurrentPage("home");
        }
      } else {
        // Fallback to local database authentication
        const endpoint = isLogin ? "/auth/login" : "/auth/register";
        const payload = isLogin 
          ? { usernameOrEmail: username, password }
          : { username, email, password };

        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("gamevault_token", data.token);
          localStorage.setItem("gamevault_user", JSON.stringify({ username: data.username, email: data.email, role: data.role }));
          setUser({ username: data.username, email: data.email, role: data.role });
          showNotification(`Welcome back, ${data.username}!`);
          setCurrentPage("home");
        } else {
          const data = await res.json();
          throw new Error(data.message || "Credential authentication rejected.");
        }
      }
    } catch (err) {
      if (isSupabaseConfigured) {
        showNotification(err.message || "Supabase validation rejected", "error");
      } else {
        localAuthMock();
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const localAuthMock = () => {
    if (username.toLowerCase() === "admin" && password === "Admin@123") {
      const adminUsr = { username: "admin", email: "admin@gamevault.com", role: "Admin" };
      localStorage.setItem("gamevault_token", "mock_admin_jwt_token");
      localStorage.setItem("gamevault_user", JSON.stringify(adminUsr));
      setUser(adminUsr);
      showNotification("Welcome back Commander (Admin auth seeded offline)!");
      setCurrentPage("home");
    } else if (username.toLowerCase() === "gamer" && password === "Gamer@123") {
      const gamerUsr = { username: "gamer", email: "gamer@gamevault.com", role: "User" };
      localStorage.setItem("gamevault_token", "mock_gamer_jwt_token");
      localStorage.setItem("gamevault_user", JSON.stringify(gamerUsr));
      setUser(gamerUsr);
      showNotification("Gamer profile validated (Offline)!");
      setCurrentPage("home");
    } else if (!isLogin) {
      const userObj = { username, email, role: "User" };
      localStorage.setItem("gamevault_token", "mock_gen_jwt_token");
      localStorage.setItem("gamevault_user", JSON.stringify(userObj));
      setUser(userObj);
      showNotification(`Registered! Profile ${username} initialized.`);
      setCurrentPage("home");
    } else {
      showNotification("Credentials mismatch. Use admin/Admin@123 or gamer/Gamer@123 offline.", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-lootora-pink/5 blur-3xl pointer-events-none" />
        
        {/* Supabase Connection Status Badge */}
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div className="flex items-center space-x-1.5">
            <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? "bg-green-500 animate-pulse" : "bg-orange-500 animate-pulse"}`} />
            <span className="text-[9px] font-orbitron font-semibold tracking-widest text-lootora-muted uppercase">
              {isSupabaseConfigured ? "SUPABASE ACTIVE" : "SUPABASE OFFLINE (SANDBOX)"}
            </span>
          </div>
          {isSupabaseConfigured && (
            <span className="text-[8px] font-mono text-white/40">Secure Verification Active</span>
          )}
        </div>

        <div className="text-center space-y-1">
          <span className="font-orbitron font-black text-2xl tracking-widest text-white uppercase">{isLogin ? "SIGN IN" : "REGISTER"}</span>
          <p className="text-[10px] text-lootora-muted tracking-widest font-orbitron">GAMEVAULT SECURE SHELL CONSOLE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">
              {isSupabaseConfigured ? "EMAIL / IDENTITY" : "USERNAME / IDENTITY"}
            </label>
            <input
              type="text"
              placeholder={isSupabaseConfigured ? "Enter your email address..." : "Username or email..."}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-lootora-blue"
            />
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="Secure email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-lootora-blue"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">ACCESS PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-lootora-blue"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-gradient-to-r from-lootora-purple via-lootora-pink to-lootora-blue hover:shadow-neonPurple text-white py-3 rounded font-orbitron font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 pt-3.5"
          >
            {authLoading ? <Loader className="w-4 h-4 animate-spin" /> : (isLogin ? "IDENTITY AUTHORIZE" : "INITIALIZE PROFILE")}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[10px] font-orbitron font-bold text-lootora-blue hover:text-lootora-pink hover:underline tracking-wider"
          >
            {isLogin ? "CREATE A NEW PROFILE NODE" : "EXISTING NODE? SIGN IN"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// ADMIN DASHBOARD VIEW
// ----------------------------------------------------
function AdminPage({ 
  products, categories, adminStats, handleAdminDelete, isEditModalOpen, setIsEditModalOpen,
  adminSelectedProduct, setAdminSelectedProduct, adminForm, setAdminForm, handleAdminCrud
}) {
  const [activeTab, setActiveTab] = useState("telemetry");

  const openAddModal = () => {
    setAdminSelectedProduct(null);
    setAdminForm({
      name: "", brand: "", price: "", discountPrice: "", stock: "", tags: "",
      description: "", imageUrl: "", galleryImages: "", specifications: "",
      categoryId: categories[0]?.id || 1, buyUrl: "", isTrending: false,
      isLimitedEdition: false, featured: false
    });
    setIsEditModalOpen(true);
  };

  const openEditModal = (p) => {
    setAdminSelectedProduct(p);
    
    let specStr = "";
    if (p.specifications) {
      if (typeof p.specifications === "string") {
        try {
          const parsed = JSON.parse(p.specifications);
          specStr = Object.entries(parsed).map(([k, v]) => `${k}:${v}`).join(";");
        } catch {
          specStr = p.specifications;
        }
      } else {
        specStr = Object.entries(p.specifications).map(([k, v]) => `${k}:${v}`).join(";");
      }
    }

    const galStr = Array.isArray(p.galleryImages) 
      ? p.galleryImages.join(";")
      : p.galleryImages;

    setAdminForm({
      name: p.name,
      brand: p.brand,
      price: p.price.toString(),
      discountPrice: p.discountPrice ? p.discountPrice.toString() : "",
      stock: p.stock ? p.stock.toString() : "",
      tags: p.tags || "",
      description: p.description,
      imageUrl: p.imageUrl,
      galleryImages: galStr || "",
      specifications: specStr,
      categoryId: p.categoryId || 1,
      buyUrl: p.buyUrl,
      isTrending: p.isTrending,
      isLimitedEdition: p.isLimitedEdition,
      featured: !!p.featured
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-black font-orbitron tracking-widest uppercase">ADMIN COMMAND SHELL</h1>
          <p className="text-xs text-lootora-muted">Manage global product catalog data and view redirect redirection stats.</p>
        </div>

        <div className="flex items-center space-x-2 bg-lootora-card p-1 border border-white/5 rounded">
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-1.5 rounded text-[10px] font-orbitron font-bold tracking-widest transition-all ${
              activeTab === "telemetry" 
                ? "bg-lootora-purple text-white shadow-neonPurple" 
                : "text-lootora-muted hover:text-white"
            }`}
          >
            TELEMETRY
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-1.5 rounded text-[10px] font-orbitron font-bold tracking-widest transition-all ${
              activeTab === "products" 
                ? "bg-lootora-purple text-white shadow-neonPurple" 
                : "text-lootora-muted hover:text-white"
            }`}
          >
            CATALOG CRUD
          </button>
        </div>
      </div>

      {activeTab === "telemetry" && adminStats && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest block uppercase">TOTAL PRODUCTS</span>
              <span className="text-3xl font-black font-orbitron text-white">{adminStats.totalProducts}</span>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest block uppercase">TOTAL CATEGORIES</span>
              <span className="text-3xl font-black font-orbitron text-lootora-blue">{adminStats.totalCategories}</span>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest block uppercase">REGISTERED USERS</span>
              <span className="text-3xl font-black font-orbitron text-lootora-purple">{adminStats.totalUsers}</span>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-orbitron font-bold text-lootora-muted tracking-widest block uppercase">BUY NOW CLICKS</span>
              <span className="text-3xl font-black font-orbitron text-lootora-pink">{adminStats.totalRedirections}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 glass-panel p-6 rounded-xl space-y-4">
              <span className="font-orbitron font-bold text-xs tracking-wider text-white uppercase block">REDIRECTION FLOW (LAST 7 DAYS)</span>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={adminStats.clicksOverTime}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="date" stroke="#A0A0A0" />
                    <YAxis stroke="#A0A0A0" />
                    <Tooltip contentStyle={{ backgroundColor: "#141414", borderColor: "#8B5CF6", color: "#FFF" }} />
                    <Area type="monotone" dataKey="clicks" stroke="#00E5FF" fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 glass-panel p-6 rounded-xl space-y-4">
              <span className="font-orbitron font-bold text-xs tracking-wider text-white uppercase block">CLICKS BY BRAND</span>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminStats.clicksByBrand}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="brand" stroke="#A0A0A0" />
                    <YAxis stroke="#A0A0A0" />
                    <Tooltip contentStyle={{ backgroundColor: "#141414", borderColor: "#FF2E88", color: "#FFF" }} />
                    <Bar dataKey="clicks" fill="#FF2E88" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          <div className="glass-panel p-6 rounded-xl space-y-4">
            <span className="font-orbitron font-bold text-xs tracking-wider text-white uppercase block">TOP PRODUCT REDIRECT CLICK NODES</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-poppins">
                <thead>
                  <tr className="border-b border-white/10 text-lootora-muted font-bold font-orbitron uppercase text-[9px] tracking-widest">
                    <th className="pb-3">PRODUCT</th>
                    <th className="pb-3">BRAND</th>
                    <th className="pb-3 text-right">REDIRECT CLICKS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-lootora-muted">
                  {adminStats.clicksByProduct.map((p, idx) => (
                    <tr key={idx} className="hover:text-white">
                      <td className="py-3 font-semibold text-white">{p.productName}</td>
                      <td className="py-3 font-orbitron">{p.brand}</td>
                      <td className="py-3 text-right font-orbitron text-lootora-blue font-bold">{p.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <span className="font-orbitron font-bold text-xs tracking-wider text-lootora-muted uppercase">MANAGE SYSTEM HARDWARE INVENTORY</span>
            <button 
              onClick={openAddModal}
              className="bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white px-4 py-2 rounded font-orbitron font-bold text-xs tracking-wider transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> ADD HARDWARE
            </button>
          </div>

          <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-poppins">
                <thead>
                  <tr className="bg-white/2 border-b border-white/10 text-lootora-muted font-bold font-orbitron text-[9px] tracking-widest uppercase">
                    <th className="p-4">ITEM NAME</th>
                    <th className="p-4">BRAND</th>
                    <th className="p-4">CATEGORY</th>
                    <th className="p-4 text-right">VALUATION</th>
                    <th className="p-4 text-center">ACTION OPTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-lootora-muted">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/1 hover:text-white transition-all">
                      <td className="p-4 font-semibold text-white flex items-center space-x-3">
                        <img src={p.imageUrl} className="w-8 h-8 rounded object-cover" />
                        <span>{p.name}</span>
                      </td>
                      <td className="p-4 font-orbitron">{p.brand}</td>
                      <td className="p-4 text-lootora-blue uppercase font-orbitron">{p.categoryName || "GEAR"}</td>
                      <td className="p-4 text-right font-orbitron text-white">₹{p.price.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-3">
                          <button onClick={() => openEditModal(p)} className="hover:text-lootora-blue transition">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAdminDelete(p.id)} className="hover:text-lootora-pink transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Edit/Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-xl border border-white/10 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-lootora-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="border-b border-white/5 pb-3">
              <span className="font-orbitron font-black text-xl tracking-wide block uppercase">
                {adminSelectedProduct ? "EDIT DEVICE" : "ADD DEVICE"}
              </span>
            </div>
            <form onSubmit={handleAdminCrud} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">PRODUCT NAME</label>
                <input type="text" required value={adminForm.name} onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">BRAND</label>
                <input type="text" required value={adminForm.brand} onChange={(e) => setAdminForm({...adminForm, brand: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">VALUATION INR (₹)</label>
                <input type="number" required value={adminForm.price} onChange={(e) => setAdminForm({...adminForm, price: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">DISCOUNT PRICE INR (₹) (OPTIONAL)</label>
                <input type="number" value={adminForm.discountPrice} onChange={(e) => setAdminForm({...adminForm, discountPrice: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" placeholder="Same as valuation if empty..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">STOCK COUNT (OPTIONAL)</label>
                <input type="number" value={adminForm.stock} onChange={(e) => setAdminForm({...adminForm, stock: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" placeholder="10..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">SEARCH TAGS (OPTIONAL, SEMICOLON SEPARATED)</label>
                <input type="text" value={adminForm.tags} onChange={(e) => setAdminForm({...adminForm, tags: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" placeholder="gaming;rgb;wireless..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">CATEGORY NODE</label>
                <select value={adminForm.categoryId} onChange={(e) => setAdminForm({...adminForm, categoryId: parseInt(e.target.value)})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white font-orbitron">
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">DESCRIPTION</label>
                <textarea rows="3" required value={adminForm.description} onChange={(e) => setAdminForm({...adminForm, description: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">IMAGE URL (OPTIONAL - AUTO-GENERATED IF BLANK)</label>
                <input type="url" value={adminForm.imageUrl} onChange={(e) => setAdminForm({...adminForm, imageUrl: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" placeholder="Leave blank to auto-generate placeholder image..." />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">GALLERY (SEMICOLON SEPARATED URLS)</label>
                <input type="text" value={adminForm.galleryImages} onChange={(e) => setAdminForm({...adminForm, galleryImages: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">SPECIFICATIONS (FORMAT: KEY1:VAL1;KEY2:VAL2)</label>
                <input type="text" value={adminForm.specifications} onChange={(e) => setAdminForm({...adminForm, specifications: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-orbitron font-bold text-lootora-muted tracking-widest uppercase">RETAILER BUY URL (OPTIONAL - AUTO-GENERATED IF BLANK)</label>
                <input type="url" value={adminForm.buyUrl} onChange={(e) => setAdminForm({...adminForm, buyUrl: e.target.value})} className="w-full bg-lootora-bg border border-white/10 rounded px-3 py-2 text-white" placeholder="Leave blank to auto-generate Amazon Affiliate link..." />
              </div>
              <div className="flex flex-wrap items-center gap-6 py-2 md:col-span-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={adminForm.isTrending} onChange={(e) => setAdminForm({...adminForm, isTrending: e.target.checked})} className="accent-lootora-purple rounded" />
                  <span className="font-orbitron font-bold tracking-widest text-[9px] text-lootora-muted uppercase">TRENDING DEALS</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={adminForm.isLimitedEdition} onChange={(e) => setAdminForm({...adminForm, isLimitedEdition: e.target.checked})} className="accent-lootora-pink rounded" />
                  <span className="font-orbitron font-bold tracking-widest text-[9px] text-lootora-muted uppercase">LIMITED EDITION</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={adminForm.featured} onChange={(e) => setAdminForm({...adminForm, featured: e.target.checked})} className="accent-lootora-blue rounded" />
                  <span className="font-orbitron font-bold tracking-widest text-[9px] text-lootora-muted uppercase">FEATURED ON HOMEPAGE</span>
                </label>
              </div>
              <button type="submit" className="md:col-span-2 bg-gradient-to-r from-lootora-purple to-lootora-pink hover:shadow-neonPurple text-white py-3 rounded font-orbitron font-bold text-xs tracking-wider transition-all">
                SUBMIT HARDWARE DATA
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------
// FOOTER COMPONENT
// ----------------------------------------------------
function Footer({ setCurrentPage, selectCategoryNode }) {
  return (
    <footer className="glass-panel border-t border-white/5 py-12 px-6 md:px-12 mt-20 relative z-20 text-xs text-lootora-muted leading-relaxed font-light font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Gamepad className="w-6 h-6 text-lootora-pink" />
            <span className="font-orbitron font-black tracking-widest text-white text-lg">GAMEVAULT</span>
          </div>
          <p className="max-w-xs text-[11px]">
            GameVault is a premium gaming marketplace discovery platform indexing hardware specs and comparison metrics.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-orbitron font-extrabold tracking-widest text-white uppercase text-[10px]">DEVICES</h4>
          <ul className="space-y-2 text-[11px] font-orbitron">
            <li><button onClick={() => selectCategoryNode("mice")} className="hover:text-lootora-blue transition">GAMING MICE</button></li>
            <li><button onClick={() => selectCategoryNode("keyboards")} className="hover:text-lootora-blue transition">KEYBOARDS</button></li>
            <li><button onClick={() => selectCategoryNode("headsets")} className="hover:text-lootora-blue transition">HEADSETS</button></li>
            <li><button onClick={() => selectCategoryNode("gpus")} className="hover:text-lootora-blue transition">GRAPHICS CARDS (GPU)</button></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-orbitron font-extrabold tracking-widest text-white uppercase text-[10px]">LEGAL CORE</h4>
          <ul className="space-y-2 text-[11px] font-orbitron">
            <li><a href="#" className="hover:text-lootora-blue transition">PRIVACY POLICY</a></li>
            <li><a href="#" className="hover:text-lootora-blue transition">TERMS OF OPERATION</a></li>
            <li><a href="#" className="hover:text-lootora-blue transition">RELIABILITY INDEX</a></li>
            <li><button onClick={() => setCurrentPage("about")} className="hover:text-lootora-blue transition uppercase">ABOUT SERVICE</button></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-orbitron font-extrabold tracking-widest text-white uppercase text-[10px]">TRANSMISSION NETWORK</h4>
          <ul className="space-y-2 text-[11px]">
            <li>HQ Node Kakinada, India</li>
            <li>Terminal: <a href="mailto:supportlootora@gmail.com" className="text-lootora-blue hover:underline">supportlootora@gmail.com</a></li>
            <li>Node Status: <span className="text-green-400 font-orbitron text-[9px] font-bold border border-green-500/20 px-1 py-0.5 rounded bg-green-500/5">SECTOR 1 ACTIVE</span></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-lootora-muted font-orbitron">
        <span>© 2026 GAMEVAULT PROTOCOLS. ALL HARDWARE LOGOS TRADEMARKED BY SOURCE BRAND CORPORATIONS.</span>
        <span className="mt-2 sm:mt-0 text-lootora-pink">BUILT FOR ELITE DISCOVERIES</span>
      </div>
    </footer>
  );
}
