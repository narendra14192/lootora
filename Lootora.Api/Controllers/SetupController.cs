using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lootora.Api.Data;
using Lootora.Api.DTOs;
using Lootora.Api.Models;

namespace Lootora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SetupController : ControllerBase
    {
        private readonly LootoraDbContext _context;

        public SetupController(LootoraDbContext context)
        {
            _context = context;
        }

        [HttpGet("recommend")]
        public async Task<IActionResult> RecommendSetup([FromQuery] decimal budget)
        {
            string kbSlug, mouseSlug, hsSlug, monSlug, chairSlug;

            if (budget <= 25000)
            {
                kbSlug = "logitech-g213-prodigy";
                mouseSlug = "logitech-g102-lightsync";
                hsSlug = "hyperx-cloud-stinger-2";
                monSlug = "asus-vy249he-24";
                chairSlug = "corsair-office-chair-basic";
            }
            else if (budget <= 50000)
            {
                kbSlug = "razer-cynosa-v2";
                mouseSlug = "razer-deathadder-essential";
                hsSlug = "hyperx-cloud-core";
                monSlug = "asus-tuf-gaming-vg249q1a";
                chairSlug = "corsair-t3-rush";
            }
            else if (budget <= 75000)
            {
                kbSlug = "logitech-g512-carbon";
                mouseSlug = "logitech-g502-hero";
                hsSlug = "steelseries-arctis-nova-1";
                monSlug = "alienware-aw2523hf-360hz";
                chairSlug = "razer-tarok-essentials";
            }
            else
            {
                kbSlug = "razer-huntsman-v3-pro";
                mouseSlug = "logitech-g-pro-x-superlight-2";
                hsSlug = "steelseries-arctis-nova-pro-wireless";
                monSlug = "asus-rog-swift-pg27aqdm-oled";
                chairSlug = "corsair-tc100-relaxed";
            }

            var slugs = new List<string> { kbSlug, mouseSlug, hsSlug, monSlug, chairSlug };

            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => slugs.Contains(p.Slug))
                .ToListAsync();

            var kb = products.FirstOrDefault(p => p.Slug == kbSlug);
            var mouse = products.FirstOrDefault(p => p.Slug == mouseSlug);
            var hs = products.FirstOrDefault(p => p.Slug == hsSlug);
            var mon = products.FirstOrDefault(p => p.Slug == monSlug);
            var chair = products.FirstOrDefault(p => p.Slug == chairSlug);

            decimal totalCost = products.Sum(p => p.Price);

            var recommendation = new SetupBuilderRecommendationDto
            {
                TotalCost = totalCost,
                Budget = budget,
                Keyboard = kb != null ? MapToDto(kb) : null,
                Mouse = mouse != null ? MapToDto(mouse) : null,
                Headset = hs != null ? MapToDto(hs) : null,
                Monitor = mon != null ? MapToDto(mon) : null,
                Chair = chair != null ? MapToDto(chair) : null
            };

            return Ok(recommendation);
        }

        private ProductListDto MapToDto(Product p)
        {
            return new ProductListDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Brand = p.Brand,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Rating = p.Rating,
                ReviewCount = p.ReviewCount,
                CategoryName = p.Category?.Name ?? string.Empty,
                CategorySlug = p.Category?.Slug ?? string.Empty,
                IsTrending = p.IsTrending,
                IsLimitedEdition = p.IsLimitedEdition
            };
        }
    }
}
