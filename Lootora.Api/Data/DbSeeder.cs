using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Lootora.Api.Models;
using Lootora.Api.Services;

namespace Lootora.Api.Data
{
    public static class DbSeeder
    {
        public static void Seed(LootoraDbContext context)
        {
            // Ensure tables are created (Postgres does not allow dropping the open 'postgres' system database)
            try
            {
                var databaseCreator = (RelationalDatabaseCreator)context.Database.GetService<IDatabaseCreator>();
                databaseCreator.CreateTables();
            }
            catch (Exception)
            {
                // Tables already exist or were created
            }

            // 1. Seed Users
            if (!context.Users.Any())
            {
                var admin = new User
                {
                    Username = "admin",
                    Email = "admin@gamevault.com",
                    PasswordHash = PasswordHasher.HashPassword("Admin@123"),
                    Role = "Admin"
                };

                var gamer = new User
                {
                    Username = "gamer",
                    Email = "gamer@gamevault.com",
                    PasswordHash = PasswordHasher.HashPassword("Gamer@123"),
                    Role = "User"
                };

                context.Users.AddRange(admin, gamer);
                context.SaveChanges();
            }

            // 2. Seed GameVault Categories
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Gaming Mouse", Slug = "mice", Description = "High-precision gaming and esports mice", Icon = "MousePointer" },
                    new Category { Name = "Gaming Keyboard", Slug = "keyboards", Description = "Mechanical and wireless gaming keyboards", Icon = "Keyboard" },
                    new Category { Name = "Gaming Headset", Slug = "headsets", Description = "Spatial surround sound headsets", Icon = "Headphones" },
                    new Category { Name = "Gaming Chair", Slug = "chairs", Description = "Contoured ergonomic gaming chairs", Icon = "Armchair" },
                    new Category { Name = "Gaming Monitor", Slug = "monitors", Description = "OLED and high-refresh gaming displays", Icon = "Layers" },
                    new Category { Name = "Gaming Laptop", Slug = "laptops", Description = "Ultra-thin high-fps portable gaming laptops", Icon = "Gamepad" },
                    new Category { Name = "Gaming PC", Slug = "pcs", Description = "Prebuilt high-end gaming desktop setups", Icon = "Gamepad" },
                    new Category { Name = "Gaming Console", Slug = "consoles", Description = "Next-generation console gaming hardware", Icon = "Gamepad" },
                    new Category { Name = "Controllers & Gamepads", Slug = "controllers", Description = "Wireless gamepads and modular controllers", Icon = "Gamepad" },
                    new Category { Name = "Graphics Cards", Slug = "gpus", Description = "Next-gen ray tracing graphics cards", Icon = "Layers" },
                    new Category { Name = "Processors", Slug = "cpus", Description = "Extreme performance multi-threaded CPUs", Icon = "Gamepad" },
                    new Category { Name = "Motherboards", Slug = "motherboards", Description = "ATX mainboards with PCIe 5.0 lanes", Icon = "Gamepad" },
                    new Category { Name = "RAM", Slug = "ram", Description = "RGB high frequency RAM modules", Icon = "Layers" },
                    new Category { Name = "SSD Storage", Slug = "ssds", Description = "High-speed M.2 NVMe SSD storage chips", Icon = "Layers" },
                    new Category { Name = "Power Supply Units", Slug = "psus", Description = "Modular power supply units", Icon = "Layers" },
                    new Category { Name = "PC Cases", Slug = "cases", Description = "Airflow focused computer glass cases", Icon = "Shirt" },
                    new Category { Name = "Webcams", Slug = "webcams", Description = "HD stream webcams and ring lights", Icon = "Layers" },
                    new Category { Name = "Microphones", Slug = "microphones", Description = "Broadcast quality USB/XLR microphones", Icon = "Layers" },
                    new Category { Name = "Gaming Speakers", Slug = "speakers", Description = "Premium gaming desktop speaker systems", Icon = "Headphones" },
                    new Category { Name = "Gaming Desks", Slug = "desks", Description = "Height adjustable ergonomic gaming desks", Icon = "Armchair" },
                    new Category { Name = "Mouse Pads", Slug = "mousepads", Description = "Desk mats and speed hybrid mouse pads", Icon = "Layers" },
                    new Category { Name = "RGB Lights", Slug = "rgb-lights", Description = "Ambient lightbars and RGB wall panels", Icon = "Layers" },
                    new Category { Name = "VR Headsets", Slug = "vr", Description = "Virtual reality goggles and motion sensors", Icon = "Gamepad" },
                    new Category { Name = "Capture Cards", Slug = "capturecards", Description = "USB and PCIe stream capture cards", Icon = "Layers" },
                    new Category { Name = "Stream Decks", Slug = "streamdecks", Description = "Macro stream controls and keys decks", Icon = "Keyboard" },
                    new Category { Name = "Racing Wheels", Slug = "wheels", Description = "Sim force-feedback steering wheels", Icon = "Gamepad" },
                    new Category { Name = "Flight Sim Controllers", Slug = "flightsim", Description = "Yokes and throttle quadrants for flight sims", Icon = "Gamepad" },
                    new Category { Name = "Mobile Gaming Accessories", Slug = "mobile-acc", Description = "Mobile gamepad clips and phone coolers", Icon = "Gamepad" },
                    new Category { Name = "Gaming Merchandise", Slug = "merchandise", Description = "Collectible merchandise, mugs and gear", Icon = "ToyBrick" },
                    new Category { Name = "Gaming Apparel", Slug = "apparel", Description = "Cozy hoodies, t-shirts, and street caps", Icon = "Shirt" },
                    new Category { Name = "Gaming Backpacks", Slug = "backpacks", Description = "Heavy-duty waterproof laptop backpacks", Icon = "Shirt" },
                    new Category { Name = "Gaming Collectibles", Slug = "collectibles-gear", Description = "Prop replicas and limited collectibles", Icon = "ToyBrick" },
                    new Category { Name = "Action Figures", Slug = "actionfigures", Description = "Collectible action figures of gaming heroes", Icon = "ToyBrick" },
                    new Category { Name = "Trading Cards", Slug = "tradingcards", Description = "Collectible foil booster packs and cards", Icon = "Layers" },
                    new Category { Name = "Collector Editions", Slug = "collectors-editions", Description = "Collector boxsets containing custom statues", Icon = "ToyBrick" },
                    new Category { Name = "Posters & Wall Art", Slug = "wallart", Description = "Gaming framed prints and metal posters", Icon = "Layers" },
                    new Category { Name = "Gaming Memorabilia", Slug = "memorabilia", Description = "Signed items and retro gaming memorabilia", Icon = "ToyBrick" },
                    new Category { Name = "Trending Deals", Slug = "deals", Description = "Limited-time deals on popular gear", Icon = "ToyBrick" }
                };

                context.Categories.AddRange(categories);
                context.SaveChanges();
            }

            // 3. Seed GameVault Products
            if (!context.Products.Any())
            {
                var categories = context.Categories.ToDictionary(c => c.Slug, c => c.Id);

                var products = new List<Product>
                {
                    // Gaming Mouse
                    new Product
                    {
                        Name = "Razer DeathAdder V3",
                        Slug = "razer-deathadder-v3",
                        Brand = "Razer",
                        Price = 6999m,
                        Description = "Esports-grade wired mouse weighing only 59g. Features an ergonomic shape, standard raw 30,000 DPI sensor, and a tactile rubberized scroll wheel.",
                        ImageUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Sensor\":\"Focus Pro 30K Optical\",\"Weight\":\"59g\",\"Poling Rate\":\"8000Hz\",\"Connection\":\"Wired Speedflex Cable\"}",
                        Rating = 4.6,
                        ReviewCount = 142,
                        CategoryId = categories["mice"],
                        BuyUrl = "https://www.razer.com/gaming-mice/razer-deathadder-v3",
                        IsTrending = false
                    },
                    new Product
                    {
                        Name = "Logitech G Pro X Superlight 2",
                        Slug = "logitech-g-pro-x-superlight-2",
                        Brand = "Logitech G",
                        Price = 16995m,
                        Description = "Champion-winning wireless gaming mouse upgraded with LIGHTFORCE switches and the HERO 2 sensor, boasting a 32,000 DPI resolution.",
                        ImageUrl = "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Sensor\":\"HERO 2\",\"Weight\":\"60g\",\"Battery Life\":\"Up to 95 hours\",\"Switches\":\"LIGHTFORCE Hybrid\"}",
                        Rating = 4.9,
                        ReviewCount = 285,
                        CategoryId = categories["mice"],
                        BuyUrl = "https://www.logitechg.com/en-in/products/gaming-mice/pro-x-superlight-2.910-006632.html",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "SteelSeries Rival 5",
                        Slug = "steelseries-rival-5",
                        Brand = "SteelSeries",
                        Price = 5999m,
                        Description = "Precision multi-genre gaming mouse with 9 programmable buttons, golden micro IP54 switches, and PrismSync RGB elements.",
                        ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Sensor\":\"TrueMove Air\",\"Weight\":\"85g\",\"Buttons\":\"9 programmable\",\"Switches\":\"IP54 Mechanical\"}",
                        Rating = 4.4,
                        ReviewCount = 95,
                        CategoryId = categories["mice"],
                        BuyUrl = "https://steelseries.com/gaming-mice/rival-5",
                        IsTrending = false
                    },

                    // Gaming Keyboard
                    new Product
                    {
                        Name = "Razer BlackWidow V4",
                        Slug = "razer-blackwidow-v4",
                        Brand = "Razer",
                        Price = 15999m,
                        Description = "Full-sized mechanical gaming keyboard wired with Razer Green Clicky switches, dynamic per-key Chroma RGB lighting, and robust double-shot ABS keycaps.",
                        ImageUrl = "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Switches\":\"Razer Green Clicky Mechanical\",\"Form Factor\":\"Full-size\",\"Lighting\":\"Razer Chroma RGB\",\"Media Keys\":\"4 Media keys + Roller\"}",
                        Rating = 4.7,
                        ReviewCount = 110,
                        CategoryId = categories["keyboards"],
                        BuyUrl = "https://www.razer.com/gaming-keyboards/razer-blackwidow-v4",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "Logitech G915",
                        Slug = "logitech-g915",
                        Brand = "Logitech G",
                        Price = 19995m,
                        Description = "Thin wireless gaming keyboard featuring low-profile GL mechanical switches, LIGHTSPEED wireless connectivity, and customizable LIGHTSYNC RGB lights.",
                        ImageUrl = "https://images.unsplash.com/photo-1626958390898-162d3577f593?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Switches\":\"Low-Profile GL Tactile\",\"Wireless\":\"LIGHTSPEED & Bluetooth\",\"Battery Life\":\"Up to 30 hours (RGB max)\",\"Form Factor\":\"Full-size\"}",
                        Rating = 4.6,
                        ReviewCount = 145,
                        CategoryId = categories["keyboards"],
                        BuyUrl = "https://www.logitechg.com/en-in/products/gaming-keyboards/g915-low-profile-wireless-mechanical-gaming-keyboard.html"
                    },
                    new Product
                    {
                        Name = "Corsair K70 RGB Pro",
                        Slug = "corsair-k70-rgb-pro",
                        Brand = "Corsair",
                        Price = 14999m,
                        Description = "Legendary mechanical keyboard with a sturdy aluminum frame, AXON hyper-processing technology, Cherry MX switches, and per-key RGB lights.",
                        ImageUrl = "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Switches\":\"Cherry MX Red Linear\",\"Material\":\"Anodized Aluminum\",\"Polling Rate\":\"8000Hz (AXON)\",\"Cable\":\"Detachable USB Type-C\"}",
                        Rating = 4.5,
                        ReviewCount = 135,
                        CategoryId = categories["keyboards"],
                        BuyUrl = "https://www.corsair.com/us/en/p/keyboards/ch-9109410-na/k70-rgb-pro-mechanical-gaming-keyboard-with-pbt-double-shot-pro-keycaps-cherry-mx-red-ch-9109410-na"
                    },

                    // Gaming Headset
                    new Product
                    {
                        Name = "HyperX Cloud III",
                        Slug = "hyperx-cloud-iii",
                        Brand = "HyperX",
                        Price = 8490m,
                        Description = "Evolution of the legendary Cloud II. Built with memory foam headband and ear cushions, angled 53mm drivers, and an ultra-clear microphone.",
                        ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Drivers\":\"53mm Angled\",\"Frequency\":\"10Hz - 21kHz\",\"Mic\":\"Detachable Noise-Cancelling\",\"Comfort\":\"Signature Memory Foam\"}",
                        Rating = 4.5,
                        ReviewCount = 290,
                        CategoryId = categories["headsets"],
                        BuyUrl = "https://row.hyperx.com/products/hyperx-cloud-iii-gaming-headset",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "Logitech G Pro X Headset",
                        Slug = "logitech-g-pro-x-headset",
                        Brand = "Logitech G",
                        Price = 13995m,
                        Description = "Tournament-proven wired gaming headset with Blue VO!CE microphone technology, memory foam ear cups, and robust PRO-G 50mm precision drivers.",
                        ImageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Drivers\":\"PRO-G 50mm Mesh\",\"Mic Tech\":\"Blue VO!CE filters\",\"Surround\":\"DTS Headphone:X 2.0\",\"Materials\":\"Aluminum fork, steel headband\"}",
                        Rating = 4.6,
                        ReviewCount = 180,
                        CategoryId = categories["headsets"],
                        BuyUrl = "https://www.logitechg.com/en-in/products/gaming-audio/pro-x-gaming-headset-blue-voice-mic.html"
                    },
                    new Product
                    {
                        Name = "SteelSeries Arctis Nova 7",
                        Slug = "steelseries-arctis-nova-7",
                        Brand = "SteelSeries",
                        Price = 18999m,
                        Description = "High fidelity wireless gaming headset featuring the Nova Acoustic System, simultaneous 2.4GHz and Bluetooth wireless, and 38-hour battery span.",
                        ImageUrl = "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Acoustics\":\"Nova Acoustic System\",\"Battery Life\":\"38 Hours\",\"Wireless\":\"Dual Connect 2.4GHz & BT\",\"Mic\":\"ClearCast Gen 2 Retractable\"}",
                        Rating = 4.7,
                        ReviewCount = 160,
                        CategoryId = categories["headsets"],
                        BuyUrl = "https://steelseries.com/gaming-headsets/arctis-nova-7"
                    },

                    // Gaming Monitor
                    new Product
                    {
                        Name = "Samsung Odyssey G7",
                        Slug = "samsung-odyssey-g7",
                        Brand = "Samsung",
                        Price = 49990m,
                        Description = "Curved 27-inch gaming monitor with 1000R curvature, 240Hz refresh rate, 1ms latency, QLED display quality, and WQHD resolution.",
                        ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Resolution\":\"2560 x 1440 WQHD\",\"Refresh Rate\":\"240Hz\",\"Curvature\":\"1000R\",\"Panel\":\"VA QLED\",\"Sync\":\"G-Sync Compatible\"}",
                        Rating = 4.6,
                        ReviewCount = 94,
                        CategoryId = categories["monitors"],
                        BuyUrl = "https://www.samsung.com/in/monitors/gaming/odyssey-g7-27-inch-lc27g75tqswxxl/",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "LG UltraGear 27GR95QE",
                        Slug = "lg-ultragear-27gr95qe",
                        Brand = "LG",
                        Price = 69990m,
                        Description = "The worlds first 240Hz OLED gaming monitor. Curved 27-inch display with 0.03ms response time, HDMI 2.1 support, and 98.5% DCI-P3 color scale.",
                        ImageUrl = "https://images.unsplash.com/photo-1585796856575-5015e21d339f?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Resolution\":\"2560 x 1440 QHD\",\"Refresh Rate\":\"240Hz\",\"Response Time\":\"0.03ms (GtG)\",\"Panel\":\"OLED\",\"HDR Support\":\"HDR10\"}",
                        Rating = 4.8,
                        ReviewCount = 76,
                        CategoryId = categories["monitors"],
                        BuyUrl = "https://www.lg.com/in/monitors/gaming-monitors/27gr95qe-b/"
                    },
                    new Product
                    {
                        Name = "ASUS ROG Swift OLED",
                        Slug = "asus-rog-swift-oled",
                        Brand = "ASUS ROG",
                        Price = 75000m,
                        Description = "ASUS ROG Swift PG27AQDM featuring a custom heatsink, 240Hz refresh rate, QHD resolution, and smart voltage optimization for OLED lifetime care.",
                        ImageUrl = "https://images.unsplash.com/photo-1547119944-1525918b04a1?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Display\":\"27 inch OLED\",\"Refresh\":\"240Hz\",\"Heatsink\":\"Custom ROG layout\",\"Brightness\":\"1000 nits Peak\"}",
                        Rating = 4.9,
                        ReviewCount = 55,
                        CategoryId = categories["monitors"],
                        BuyUrl = "https://rog.asus.com/monitors/27-to-31-5-inches/rog-swift-oled-pg27aqdm/",
                        IsLimitedEdition = true
                    },

                    // Gaming Chair
                    new Product
                    {
                        Name = "Secretlab Titan Evo",
                        Slug = "secretlab-titan-evo",
                        Brand = "Secretlab",
                        Price = 45000m,
                        Description = "The gold standard of ergonomic gaming chairs. Features customized L-ADAPT 4-way lumbar support, magnetic memory foam head pillow, and 4D armrests.",
                        ImageUrl = "https://images.unsplash.com/photo-1598550476439-6847785fce6e?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Lumbar Support\":\"L-ADAPT 4-way\",\"Pillow\":\"Magnetic Memory Foam\",\"Armrests\":\"4D CloudSwap compatible\",\"Gas Lift\":\"Class 4\"}",
                        Rating = 4.8,
                        ReviewCount = 210,
                        CategoryId = categories["chairs"],
                        BuyUrl = "https://secretlab.co/products/titan-evo-2022-series",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "DXRacer Air",
                        Slug = "dxracer-air",
                        Brand = "DXRacer",
                        Price = 29999m,
                        Description = "Mesh gaming chair built for cool airflow. Constructed with spring suspension mesh, adjustable memory foam headrest, and modular structures.",
                        ImageUrl = "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Material\":\"Ultra-breathable Mesh\",\"Suspension\":\"Steel springs\",\"Lumbar Support\":\"Adjustable plastic guide\",\"Recline\":\"150 degrees\"}",
                        Rating = 4.3,
                        ReviewCount = 89,
                        CategoryId = categories["chairs"],
                        BuyUrl = "https://www.dxracer.com/pages/air-series"
                    },
                    new Product
                    {
                        Name = "AndaSeat Kaiser 3",
                        Slug = "andaseat-kaiser-3",
                        Brand = "AndaSeat",
                        Price = 35000m,
                        Description = "Premium executive size gaming chair in DuraXtra leatherette with integrated lumbar support, 4D magnetic armrests, and 160-degree recline angle.",
                        ImageUrl = "https://images.unsplash.com/photo-1688531383569-42b7fe3e970a?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Material\":\"DuraXtra Premium Leatherette\",\"Lumbar\":\"Integrated 4-way\",\"Armrests\":\"Magnetic 4D\",\"Recline\":\"90 - 165 degrees\"}",
                        Rating = 4.5,
                        ReviewCount = 112,
                        CategoryId = categories["chairs"],
                        BuyUrl = "https://www.andaseat.com/products/andaseat-kaiser-3-series-premium-gaming-chair"
                    },

                    // Graphics Cards
                    new Product
                    {
                        Name = "NVIDIA GeForce RTX 5090",
                        Slug = "nvidia-geforce-rtx-5090",
                        Brand = "NVIDIA",
                        Price = 199000m,
                        Description = "The ultimate powerhouse of ray tracing graphics cards. Powered by NVIDIA Blackwell architecture, featuring 32GB GDDR7 VRAM, DLSS 4, and high core counts.",
                        ImageUrl = "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Architecture\":\"Blackwell\",\"VRAM\":\"32GB GDDR7\",\"Bus Width\":\"512-bit\",\"CUDA Cores\":\"21760\",\"Recommended PSU\":\"1000W\"}",
                        Rating = 4.9,
                        ReviewCount = 64,
                        CategoryId = categories["gpus"],
                        BuyUrl = "https://www.nvidia.com/en-in/geforce/graphics-cards/50-series/",
                        IsTrending = true,
                        IsLimitedEdition = true
                    },
                    new Product
                    {
                        Name = "NVIDIA GeForce RTX 5080",
                        Slug = "nvidia-geforce-rtx-5080",
                        Brand = "NVIDIA",
                        Price = 119000m,
                        Description = "Extreme desktop performance rendering games at high frame rates at true 4K resolution. Equipped with 16GB GDDR7 and Blackwell ray tracing.",
                        ImageUrl = "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Architecture\":\"Blackwell\",\"VRAM\":\"16GB GDDR7\",\"CUDA Cores\":\"10752\",\"Recommended PSU\":\"850W\"}",
                        Rating = 4.7,
                        ReviewCount = 82,
                        CategoryId = categories["gpus"],
                        BuyUrl = "https://www.nvidia.com/en-in/geforce/graphics-cards/50-series/",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "AMD Radeon RX 9900 XT",
                        Slug = "amd-radeon-rx-9900-xt",
                        Brand = "AMD",
                        Price = 99000m,
                        Description = "High efficiency chiplet graphics card powered by AMD RDNA 5 architecture, with 20GB VRAM and extreme compute units designed for AI calculations.",
                        ImageUrl = "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Architecture\":\"RDNA 5\",\"VRAM\":\"20GB GDDR6\",\"Compute Units\":\"96\",\"Recommended PSU\":\"800W\"}",
                        Rating = 4.6,
                        ReviewCount = 54,
                        CategoryId = categories["gpus"],
                        BuyUrl = "https://www.amd.com/en/graphics/radeon-rx-series",
                        IsTrending = false
                    },

                    // Processors
                    new Product
                    {
                        Name = "AMD Ryzen 9 9950X",
                        Slug = "amd-ryzen-9-9950x",
                        Brand = "AMD",
                        Price = 59990m,
                        Description = "The flagship Zen 5 computing processor featuring 16 cores and 32 threads, designed for socket AM5 builds. Reaches up to 5.7 GHz boost.",
                        ImageUrl = "https://images.unsplash.com/photo-1559893088-c0787ebfc084?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Cores\":\"16\",\"Threads\":\"32\",\"Boost Clock\":\"5.7 GHz\",\"Socket\":\"AM5\",\"TDP\":\"170W\"}",
                        Rating = 4.8,
                        ReviewCount = 74,
                        CategoryId = categories["cpus"],
                        BuyUrl = "https://www.amd.com/en/processors/ryzen",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "Intel Core Ultra 9",
                        Slug = "intel-core-ultra-9",
                        Brand = "Intel",
                        Price = 54990m,
                        Description = "Intel Arrow Lake processor featuring a dedicated NPU for artificial intelligence operations, with 24 cores (8P + 16E) and LGA 1851 socket compatibility.",
                        ImageUrl = "https://images.unsplash.com/photo-1559893088-c0787ebfc084?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Total Cores\":\"24 (8 P-core, 16 E-core)\",\"Socket\":\"LGA1851\",\"NPU\":\"Intel AI Boost\",\"Max Frequency\":\"5.7 GHz\"}",
                        Rating = 4.5,
                        ReviewCount = 52,
                        CategoryId = categories["cpus"],
                        BuyUrl = "https://www.intel.in/content/www/in/en/products/details/processors/core-ultra.html"
                    },

                    // Consoles
                    new Product
                    {
                        Name = "PlayStation 5 Pro",
                        Slug = "playstation-5-pro",
                        Brand = "Sony PlayStation",
                        Price = 69990m,
                        Description = "Sony's ultimate console system featuring upgraded GPU power, PlayStation Spectral Super Resolution (PSSR) AI upscaling, and 2TB high speed SSD storage.",
                        ImageUrl = "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Upscaling\":\"PSSR AI upscaling\",\"Storage\":\"2TB custom SSD\",\"Ray Tracing\":\"Advanced Hardware-accelerated\",\"Target Frame Rate\":\"60 FPS at 4K\"}",
                        Rating = 4.8,
                        ReviewCount = 189,
                        CategoryId = categories["consoles"],
                        BuyUrl = "https://www.playstation.com/en-in/ps5/",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "Nintendo Switch 2",
                        Slug = "nintendo-switch-2",
                        Brand = "Nintendo",
                        Price = 34990m,
                        Description = "Next generation hybrid console from Nintendo. Featuring a 1080p OLED handheld screen and custom NVIDIA DLSS upscaling inside the TV dock.",
                        ImageUrl = "https://images.unsplash.com/photo-1559893088-c0787ebfc084?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Display\":\"8.0 inch OLED 1080p\",\"Dock Output\":\"4K upscaled via DLSS\",\"Storage\":\"64GB eMMC + microSD slot\",\"CPU\":\"Custom NVIDIA Tegra\"}",
                        Rating = 4.7,
                        ReviewCount = 310,
                        CategoryId = categories["consoles"],
                        BuyUrl = "https://www.nintendo.com/",
                        IsTrending = true,
                        IsLimitedEdition = true
                    }
                };

                context.Products.AddRange(products);
                context.SaveChanges();
            }

            // Sync category counts
            foreach (var category in context.Categories.ToList())
            {
                category.ProductCount = context.Products.Count(p => p.CategoryId == category.Id);
            }
            context.SaveChanges();
        }
    }
}
