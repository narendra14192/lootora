using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lootora.Api.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Slug { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Brand { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public string Description { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        // JSON or semicolon separated string of image URLs
        public string GalleryImages { get; set; } = string.Empty;

        // JSON string storing key-value specifications
        public string Specifications { get; set; } = string.Empty;

        public double Rating { get; set; } = 0.0;

        public int ReviewCount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountPrice { get; set; }

        public int Stock { get; set; } = 0;

        public string Tags { get; set; } = string.Empty;

        public bool Featured { get; set; } = false;

        [Required]
        public int CategoryId { get; set; }

        public Category? Category { get; set; }

        [Required]
        public string BuyUrl { get; set; } = string.Empty;

        public bool IsTrending { get; set; } = false;

        public bool IsLimitedEdition { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
