using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.EntityFrameworkCore;
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
            // Drop tables if the old schema is present to allow RelationalDatabaseCreator to recreate them with new columns
            try
            {
                bool columnExists = false;
                using (var command = context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='gamevault' AND table_name='Products' AND column_name='DiscountPrice');";
                    context.Database.OpenConnection();
                    columnExists = (bool)(command.ExecuteScalar() ?? false);
                }

                if (!columnExists)
                {
                    context.Database.ExecuteSqlRaw("DROP TABLE IF EXISTS gamevault.\"WishlistItems\" CASCADE;");
                    context.Database.ExecuteSqlRaw("DROP TABLE IF EXISTS gamevault.\"Reviews\" CASCADE;");
                    context.Database.ExecuteSqlRaw("DROP TABLE IF EXISTS gamevault.\"RedirectionLogs\" CASCADE;");
                    context.Database.ExecuteSqlRaw("DROP TABLE IF EXISTS gamevault.\"Products\" CASCADE;");
                    Console.WriteLine("Dropped old tables to update product schema.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking/dropping old tables: {ex.Message}");
            }

            // Ensure tables are created
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

            // 3. Seed GameVault Products from JSON
            var firstProduct = context.Products.FirstOrDefault();
            bool needsSeedUpdate = firstProduct == null || !firstProduct.BuyUrl.Contains("linkId=adb686c2312ad063f605e51bfbbe995f");
            if (context.Products.Count() < 500 || needsSeedUpdate)
            {
                var categories = context.Categories.ToDictionary(c => c.Slug, c => c.Id);
                try
                {
                    // Clear existing products if any (since we want to clean slate seed all 500+ items)
                    if (context.Products.Any())
                    {
                        context.Products.RemoveRange(context.Products);
                        context.SaveChanges();
                    }

                    var seedFilePath = Path.Combine(AppContext.BaseDirectory, "products_seed.json");
                    if (File.Exists(seedFilePath))
                    {
                        var json = File.ReadAllText(seedFilePath);
                        var seedProducts = System.Text.Json.JsonSerializer.Deserialize<List<SeedProductDto>>(json);
                        if (seedProducts != null)
                        {
                            var products = seedProducts.Select(p => new Product
                            {
                                Name = p.Name,
                                Slug = p.Slug,
                                Brand = p.Brand,
                                Price = p.Price,
                                DiscountPrice = p.DiscountPrice,
                                Stock = p.Stock,
                                Tags = p.Tags,
                                Featured = p.Featured,
                                Description = p.Description,
                                ImageUrl = p.ImageUrl,
                                Specifications = p.Specifications,
                                Rating = p.Rating,
                                ReviewCount = p.ReviewCount,
                                CategoryId = categories.ContainsKey(p.CategorySlug) ? categories[p.CategorySlug] : categories.Values.First(),
                                BuyUrl = p.BuyUrl,
                                IsTrending = p.IsTrending,
                                IsLimitedEdition = p.IsLimitedEdition
                            }).ToList();

                            context.Products.AddRange(products);
                            context.SaveChanges();
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Seeder JSON file not found at: {seedFilePath}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error seeding products from JSON: {ex.Message}");
                }
            }

            // Sync category counts
            foreach (var category in context.Categories.ToList())
            {
                category.ProductCount = context.Products.Count(p => p.CategoryId == category.Id);
            }
            context.SaveChanges();
        }
    }

    public class SeedProductDto
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Brand { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountPrice { get; set; }
        public int Stock { get; set; }
        public string Tags { get; set; }
        public bool Featured { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string Specifications { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public string CategorySlug { get; set; }
        public string BuyUrl { get; set; }
        public bool IsTrending { get; set; }
        public bool IsLimitedEdition { get; set; }
    }
}
