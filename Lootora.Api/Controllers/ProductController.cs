using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lootora.Api.Data;
using Lootora.Api.DTOs;
using Lootora.Api.Models;

namespace Lootora.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly LootoraDbContext _context;

        public ProductController(LootoraDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? search,
            [FromQuery] string? category,
            [FromQuery] string? brand,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] double? minRating,
            [FromQuery] string? sortBy, // popularity, rating, price_asc, price_desc, newest
            [FromQuery] bool? isTrending,
            [FromQuery] bool? isLimitedEdition)
        {
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            // Filters
            if (!string.IsNullOrEmpty(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(lowerSearch) || 
                                         p.Brand.ToLower().Contains(lowerSearch) || 
                                         p.Description.ToLower().Contains(lowerSearch));
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category!.Slug.ToLower() == category.ToLower() || p.Category.Name.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrEmpty(brand))
            {
                query = query.Where(p => p.Brand.ToLower() == brand.ToLower());
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            if (minRating.HasValue)
            {
                query = query.Where(p => p.Rating >= minRating.Value);
            }

            if (isTrending.HasValue && isTrending.Value)
            {
                query = query.Where(p => p.IsTrending);
            }

            if (isLimitedEdition.HasValue && isLimitedEdition.Value)
            {
                query = query.Where(p => p.IsLimitedEdition);
            }

            // Sorting
            query = sortBy switch
            {
                "rating" => query.OrderByDescending(p => p.Rating),
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "newest" => query.OrderByDescending(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.ReviewCount) // Default/Popularity
            };

            var products = await query.ToListAsync();

            var dtos = products.Select(p => new ProductListDto
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
            }).ToList();

            return Ok(dtos);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetProductBySlug(string slug)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            // Fetch reviews
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == product.Id)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            // Deserialize JSON specs and gallery images list
            List<string> galleryList = new();
            if (!string.IsNullOrEmpty(product.GalleryImages))
            {
                galleryList = product.GalleryImages.Split(';').ToList();
            }

            Dictionary<string, string> specsDict = new();
            if (!string.IsNullOrEmpty(product.Specifications))
            {
                try
                {
                    specsDict = JsonSerializer.Deserialize<Dictionary<string, string>>(product.Specifications) ?? new();
                }
                catch
                {
                    // Fallback
                }
            }

            var detailsDto = new ProductDetailsDto
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                Brand = product.Brand,
                Price = product.Price,
                Description = product.Description,
                ImageUrl = product.ImageUrl,
                GalleryImages = galleryList,
                Specifications = specsDict,
                Rating = product.Rating,
                ReviewCount = product.ReviewCount,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name ?? string.Empty,
                CategorySlug = product.Category?.Slug ?? string.Empty,
                BuyUrl = product.BuyUrl,
                IsTrending = product.IsTrending,
                IsLimitedEdition = product.IsLimitedEdition,
                Reviews = reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Username = r.Username,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToList()
            };

            return Ok(detailsDto);
        }

        [HttpPost("{id}/redirect")]
        public async Task<IActionResult> LogRedirection(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var log = new RedirectionLog
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Brand = product.Brand,
                UserIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown"
            };

            _context.RedirectionLogs.Add(log);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Redirection logged successfully.", buyUrl = product.BuyUrl });
        }

        [Authorize]
        [HttpPost("{id}/review")]
        public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var usernameClaim = User.FindFirst(ClaimTypes.Name);

            if (userIdClaim == null || usernameClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);
            var username = usernameClaim.Value;

            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.ProductId == id && r.UserId == userId);

            if (existingReview != null)
            {
                existingReview.Rating = request.Rating;
                existingReview.Comment = request.Comment;
                existingReview.CreatedAt = DateTime.UtcNow;
            }
            else
            {
                var review = new Review
                {
                    ProductId = id,
                    UserId = userId,
                    Username = username,
                    Rating = request.Rating,
                    Comment = request.Comment
                };
                _context.Reviews.Add(review);
            }

            await _context.SaveChangesAsync();

            var reviews = await _context.Reviews.Where(r => r.ProductId == id).ToListAsync();
            product.ReviewCount = reviews.Count;
            product.Rating = Math.Round(reviews.Average(r => r.Rating), 1);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Review added successfully.", averageRating = product.Rating, reviewCount = product.ReviewCount });
        }
    }
}
