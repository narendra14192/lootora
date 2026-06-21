using System;
using System.Collections.Generic;

namespace Lootora.Api.DTOs
{
    public class ProductListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string CategorySlug { get; set; } = string.Empty;
        public bool IsTrending { get; set; }
        public bool IsLimitedEdition { get; set; }
    }

    public class ProductDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> GalleryImages { get; set; } = new();
        public Dictionary<string, string> Specifications { get; set; } = new();
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string CategorySlug { get; set; } = string.Empty;
        public string BuyUrl { get; set; } = string.Empty;
        public bool IsTrending { get; set; }
        public bool IsLimitedEdition { get; set; }
        public List<ReviewDto> Reviews { get; set; } = new();
    }

    public class ReviewDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AddReviewRequest
    {
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }

    public class SetupBuilderRecommendationDto
    {
        public decimal TotalCost { get; set; }
        public decimal Budget { get; set; }
        public ProductListDto? Keyboard { get; set; }
        public ProductListDto? Mouse { get; set; }
        public ProductListDto? Headset { get; set; }
        public ProductListDto? Monitor { get; set; }
        public ProductListDto? Chair { get; set; }
    }

    public class AdminStatsDto
    {
        public int TotalProducts { get; set; }
        public int TotalCategories { get; set; }
        public int TotalUsers { get; set; }
        public int TotalRedirections { get; set; }
        public List<BrandClickDto> ClicksByBrand { get; set; } = new();
        public List<ProductClickDto> ClicksByProduct { get; set; } = new();
        public List<DailyClickDto> ClicksOverTime { get; set; } = new();
    }

    public class BrandClickDto
    {
        public string Brand { get; set; } = string.Empty;
        public int Clicks { get; set; }
    }

    public class ProductClickDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public int Clicks { get; set; }
    }

    public class DailyClickDto
    {
        public string Date { get; set; } = string.Empty;
        public int Clicks { get; set; }
    }

    public class UpsertProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> GalleryImages { get; set; } = new();
        public Dictionary<string, string> Specifications { get; set; } = new();
        public int CategoryId { get; set; }
        public string BuyUrl { get; set; } = string.Empty;
        public bool IsTrending { get; set; }
        public bool IsLimitedEdition { get; set; }
    }
}
