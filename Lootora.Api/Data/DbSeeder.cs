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
                        BuyUrl = "https://www.amazon.in/s?k=Razer%20DeathAdder%20V3&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Logitech%20G%20Pro%20X%20Superlight%202&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=SteelSeries%20Rival%205&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Razer%20BlackWidow%20V4&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Logitech%20G915&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Corsair%20K70%20RGB%20Pro&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=HyperX%20Cloud%20III&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Logitech%20G%20Pro%20X%20Headset&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=SteelSeries%20Arctis%20Nova%207&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Samsung%20Odyssey%20G7&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=LG%20UltraGear%2027GR95QE&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=ASUS%20ROG%20Swift%20OLED&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Secretlab%20Titan%20Evo&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=DXRacer%20Air&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=AndaSeat%20Kaiser%203&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=NVIDIA%20GeForce%20RTX%205090&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=NVIDIA%20GeForce%20RTX%205080&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=AMD%20Radeon%20RX%209900%20XT&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=AMD%20Ryzen%209%209950X&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Intel%20Core%20Ultra%209&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=PlayStation%205%20Pro&tag=lootora21-21",
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
                        BuyUrl = "https://www.amazon.in/s?k=Nintendo%20Switch%202&tag=lootora21-21",
                        IsTrending = true,
                        IsLimitedEdition = true
                    },
                    new Product
                    {
                        Name = "EvoFox One S Wireless Gamepad",
                        Slug = "evofox-one-s-wireless-gamepad",
                        Brand = "EvoFox",
                        Price = 1599m,
                        Description = "3-Mode Wireless controller featuring Hall-Effect Joysticks & Triggers, zero stick drift, and dynamic vibration feedback.",
                        ImageUrl = "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Connectivity\":\"2.4GHz Wireless, Bluetooth, Wired\",\"Sensor\":\"Hall-Effect Magnetic\",\"Compatibility\":\"PC, Android, iOS, Switch\",\"Battery Life\":\"Up to 12 Hours\"}",
                        Rating = 4.5,
                        ReviewCount = 142,
                        CategoryId = categories["controllers"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20One%20S%20Wireless%20Gamepad&tag=lootora21-21",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "EvoFox One X Wireless Gamepad",
                        Slug = "evofox-one-x-wireless-gamepad",
                        Brand = "EvoFox",
                        Price = 2999m,
                        Description = "Premium Tri-Mode Wireless controller with Hall-Effect precision, custom RGB LED lighting, and 1000Hz polling rate in wired mode.",
                        ImageUrl = "https://images.unsplash.com/photo-1600086882484-013a8c69201e?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Connectivity\":\"Tri-Mode (2.4GHz, BT 5.0, USB-C)\",\"Polling Rate\":\"1000Hz (Wired)\",\"Features\":\"Hall-Effect Sensors, RGB, Macros\",\"Compatibility\":\"PC, Switch, Mobile\"}",
                        Rating = 4.7,
                        ReviewCount = 98,
                        CategoryId = categories["controllers"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20One%20X%20Wireless%20Gamepad&tag=lootora21-21",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "EvoFox Elite X Wired Gamepad",
                        Slug = "evofox-elite-x-wired-gamepad",
                        Brand = "EvoFox",
                        Price = 1399m,
                        Description = "Ergonomic wired gaming controller for PC with RGB lighting accents, dual rumble motors, and plug-and-play setup.",
                        ImageUrl = "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Connection\":\"Wired (1.8m Braided Cable)\",\"Vibration\":\"Dual Rumble Motors\",\"Lighting\":\"RGB Accent\",\"Compatibility\":\"PC (X-Input/D-Input)\"}",
                        Rating = 4.3,
                        ReviewCount = 210,
                        CategoryId = categories["controllers"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20Elite%20X%20Wired%20Gamepad&tag=lootora21-21",
                        IsTrending = false
                    },
                    new Product
                    {
                        Name = "EvoFox Ronin X75 Wireless Mechanical Keyboard",
                        Slug = "evofox-ronin-x75-wireless",
                        Brand = "EvoFox",
                        Price = 4999m,
                        Description = "75% layout premium gasket-mounted wireless mechanical keyboard with hot-swappable linear switches and multi-layer sound dampening.",
                        ImageUrl = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Form Factor\":\"75% Layout (82 Keys)\",\"Mounting\":\"Gasket Mount\",\"Connection\":\"Tri-Mode (2.4GHz, BT, USB-C)\",\"Switches\":\"Hot-Swappable Linear\"}",
                        Rating = 4.8,
                        ReviewCount = 57,
                        CategoryId = categories["keyboards"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20Ronin%20X75%20Wireless%20Mechanical%20Keyboard&tag=lootora21-21",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "EvoFox Katana X2 TKL Mechanical Keyboard",
                        Slug = "evofox-katana-x2-tkl",
                        Brand = "EvoFox",
                        Price = 1899m,
                        Description = "Compact tenkeyless mechanical gaming keyboard with clicky blue switches, rainbow LED backlighting, and a durable steel top plate.",
                        ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Form Factor\":\"TKL (87 Keys)\",\"Switches\":\"Outemu Blue Clicky\",\"Lighting\":\"Rainbow LED\",\"Keycaps\":\"Double-Shot Injection\"}",
                        Rating = 4.4,
                        ReviewCount = 340,
                        CategoryId = categories["keyboards"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20Katana%20X2%20TKL%20Mechanical%20Keyboard&tag=lootora21-21",
                        IsTrending = false
                    },
                    new Product
                    {
                        Name = "EvoFox Fireblade TKL Gaming Keyboard",
                        Slug = "evofox-fireblade-tkl",
                        Brand = "EvoFox",
                        Price = 949m,
                        Description = "The legendary compact membrane gaming keyboard with breathing RGB effects, 19-key anti-ghosting, and durable spill-resistant keys.",
                        ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Form Factor\":\"Compact TKL\",\"Keys Type\":\"Tactile Membrane\",\"Anti-Ghosting\":\"19-Key\",\"Cable\":\"1.5m Braided USB\"}",
                        Rating = 4.2,
                        ReviewCount = 1850,
                        CategoryId = categories["keyboards"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20Fireblade%20TKL%20Gaming%20Keyboard&tag=lootora21-21",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "EvoFox Phantom Gaming Mouse",
                        Slug = "evofox-phantom-mouse",
                        Brand = "EvoFox",
                        Price = 999m,
                        Description = "Ergonomic wired gaming mouse with 4-stage adjustable DPI up to 3200, breathing RGB LED, and 6 programmable buttons.",
                        ImageUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Sensor\":\"High Precision Optical\",\"DPI\":\"Adjustable 1200-1600-2400-3200\",\"Buttons\":\"6 Programmable\",\"Lighting\":\"RGB Breathing\"}",
                        Rating = 4.3,
                        ReviewCount = 1240,
                        CategoryId = categories["mice"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20Phantom%20Gaming%20Mouse&tag=lootora21-21",
                        IsTrending = false
                    },
                    new Product
                    {
                        Name = "EvoFox Blaze Wireless Gaming Mouse",
                        Slug = "evofox-blaze-wireless-mouse",
                        Brand = "EvoFox",
                        Price = 1299m,
                        Description = "Rechargeable wireless gaming mouse with ergonomic thumb rest, customizable RGB lighting, and adjustable DPI up to 4800.",
                        ImageUrl = "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Connection\":\"2.4GHz Wireless\",\"Battery\":\"Rechargeable (USB-C)\",\"DPI\":\"Up to 4800 DPI\",\"Lighting\":\"RGB Cycle\"}",
                        Rating = 4.5,
                        ReviewCount = 280,
                        CategoryId = categories["mice"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20Blaze%20Wireless%20Gaming%20Mouse&tag=lootora21-21",
                        IsTrending = true
                    },
                    new Product
                    {
                        Name = "EvoFox G-Blade Gaming Headset",
                        Slug = "evofox-g-blade-headset",
                        Brand = "EvoFox",
                        Price = 1199m,
                        Description = "Over-ear wired gaming headset with soft memory foam ear cushions, flexible omnidirectional microphone, and RGB LED light ring.",
                        ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Driver Size\":\"40mm Neodymium\",\"Microphone\":\"Flexible Omnidirectional\",\"Cable\":\"2.1m Durable Braided\",\"Interface\":\"3.5mm Jack + USB (for LED)\"}",
                        Rating = 4.3,
                        ReviewCount = 490,
                        CategoryId = categories["headsets"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20G-Blade%20Gaming%20Headset&tag=lootora21-21",
                        IsTrending = false
                    },
                    new Product
                    {
                        Name = "EvoFox Shadow Gaming Headset",
                        Slug = "evofox-shadow-headset",
                        Brand = "EvoFox",
                        Price = 1499m,
                        Description = "Immersive gaming headset featuring powerful 50mm drivers, noise-reducing microphone, and comfortable self-adjusting headband.",
                        ImageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
                        Specifications = "{\"Driver Size\":\"50mm Dual Drivers\",\"Microphone\":\"Noise-Reducing Retractable\",\"Sound\":\"Virtual 7.1 Surround (via USB)\",\"Lighting\":\"Breathing RGB\"}",
                        Rating = 4.5,
                        ReviewCount = 185,
                        CategoryId = categories["headsets"],
                        BuyUrl = "https://www.amazon.in/s?k=EvoFox%20Shadow%20Gaming%20Headset&tag=lootora21-21",
                        IsTrending = true
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
