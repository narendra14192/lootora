using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lootora.Api.Data;
using Lootora.Api.DTOs;
using Lootora.Api.Models;

namespace Lootora.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly LootoraDbContext _context;

        public WishlistController(LootoraDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            var items = await _context.WishlistItems
                .Include(w => w.Product)
                .ThenInclude(p => p!.Category)
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.CreatedAt)
                .ToListAsync();

            var dtos = items.Select(w => new ProductListDto
            {
                Id = w.Product!.Id,
                Name = w.Product.Name,
                Slug = w.Product.Slug,
                Brand = w.Product.Brand,
                Price = w.Product.Price,
                ImageUrl = w.Product.ImageUrl,
                Rating = w.Product.Rating,
                ReviewCount = w.Product.ReviewCount,
                CategoryName = w.Product.Category?.Name ?? string.Empty,
                CategorySlug = w.Product.Category?.Slug ?? string.Empty,
                IsTrending = w.Product.IsTrending,
                IsLimitedEdition = w.Product.IsLimitedEdition
            }).ToList();

            return Ok(dtos);
        }

        [HttpPost("{productId}")]
        public async Task<IActionResult> ToggleWishlist(int productId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var item = await _context.WishlistItems
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            bool isAdded;
            if (item != null)
            {
                _context.WishlistItems.Remove(item);
                isAdded = false;
            }
            else
            {
                var newItem = new WishlistItem
                {
                    UserId = userId,
                    ProductId = productId
                };
                _context.WishlistItems.Add(newItem);
                isAdded = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new { isAdded, message = isAdded ? "Product added to wishlist." : "Product removed from wishlist." });
        }
    }
}
