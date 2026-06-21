using System;
using System.Collections.Generic;
using System.Linq;
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
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly LootoraDbContext _context;

        public AdminController(LootoraDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalProducts = await _context.Products.CountAsync();
            var totalCategories = await _context.Categories.CountAsync();
            var totalUsers = await _context.Users.CountAsync();
            var totalRedirections = await _context.RedirectionLogs.CountAsync();

            var brandClicks = await _context.RedirectionLogs
                .GroupBy(l => l.Brand)
                .Select(g => new BrandClickDto
                {
                    Brand = g.Key,
                    Clicks = g.Count()
                })
                .OrderByDescending(b => b.Clicks)
                .Take(10)
                .ToListAsync();

            var productClicks = await _context.RedirectionLogs
                .GroupBy(l => new { l.ProductName, l.Brand })
                .Select(g => new ProductClickDto
                {
                    ProductName = g.Key.ProductName,
                    Brand = g.Key.Brand,
                    Clicks = g.Count()
                })
                .OrderByDescending(p => p.Clicks)
                .Take(10)
                .ToListAsync();

            var minDate = DateTime.UtcNow.Date.AddDays(-7);
            var logs = await _context.RedirectionLogs
                .Where(l => l.ClickedAt >= minDate)
                .ToListAsync();

            var dailyClicks = logs
                .GroupBy(l => l.ClickedAt.Date)
                .Select(g => new DailyClickDto
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Clicks = g.Count()
                })
                .OrderBy(d => d.Date)
                .ToList();

            var resultDays = new List<DailyClickDto>();
            for (int i = 6; i >= 0; i--)
            {
                var dateStr = DateTime.UtcNow.Date.AddDays(-i).ToString("yyyy-MM-dd");
                var existing = dailyClicks.FirstOrDefault(d => d.Date == dateStr);
                resultDays.Add(existing ?? new DailyClickDto { Date = dateStr, Clicks = 0 });
            }

            var stats = new AdminStatsDto
            {
                TotalProducts = totalProducts,
                TotalCategories = totalCategories,
                TotalUsers = totalUsers,
                TotalRedirections = totalRedirections,
                ClicksByBrand = brandClicks,
                ClicksByProduct = productClicks,
                ClicksOverTime = resultDays
            };

            return Ok(stats);
        }

        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromBody] UpsertProductRequest request)
        {
            var slug = GenerateSlug(request.Name);
            if (await _context.Products.AnyAsync(p => p.Slug == slug))
            {
                slug = $"{slug}-{Guid.NewGuid().ToString().Substring(0, 4)}";
            }

            var galleryImages = string.Join(";", request.GalleryImages);
            var specifications = JsonSerializer.Serialize(request.Specifications);

            var product = new Product
            {
                Name = request.Name,
                Slug = slug,
                Brand = request.Brand,
                Price = request.Price,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                GalleryImages = galleryImages,
                Specifications = specifications,
                CategoryId = request.CategoryId,
                BuyUrl = request.BuyUrl,
                IsTrending = request.IsTrending,
                IsLimitedEdition = request.IsLimitedEdition
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category != null)
            {
                category.ProductCount = await _context.Products.CountAsync(p => p.CategoryId == request.CategoryId);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Product created successfully.", product });
        }

        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpsertProductRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var oldCategoryId = product.CategoryId;

            product.Name = request.Name;
            product.Brand = request.Brand;
            product.Price = request.Price;
            product.Description = request.Description;
            product.ImageUrl = request.ImageUrl;
            product.GalleryImages = string.Join(";", request.GalleryImages);
            product.Specifications = JsonSerializer.Serialize(request.Specifications);
            product.CategoryId = request.CategoryId;
            product.BuyUrl = request.BuyUrl;
            product.IsTrending = request.IsTrending;
            product.IsLimitedEdition = request.IsLimitedEdition;

            await _context.SaveChangesAsync();

            var oldCategory = await _context.Categories.FindAsync(oldCategoryId);
            if (oldCategory != null)
            {
                oldCategory.ProductCount = await _context.Products.CountAsync(p => p.CategoryId == oldCategoryId);
            }

            var newCategory = await _context.Categories.FindAsync(request.CategoryId);
            if (newCategory != null)
            {
                newCategory.ProductCount = await _context.Products.CountAsync(p => p.CategoryId == request.CategoryId);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Product updated successfully.", product });
        }

        [HttpDelete("products/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var categoryId = product.CategoryId;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            var category = await _context.Categories.FindAsync(categoryId);
            if (category != null)
            {
                category.ProductCount = await _context.Products.CountAsync(p => p.CategoryId == categoryId);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Product deleted successfully." });
        }

        private string GenerateSlug(string text)
        {
            return text.ToLower()
                .Replace(" ", "-")
                .Replace("\"", "")
                .Replace("'", "")
                .Replace("&", "and")
                .Replace("/", "-")
                .Replace("\\", "-")
                .Trim('-');
        }
    }
}
