using System.ComponentModel.DataAnnotations;

namespace Lootora.Api.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Slug { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        public string Icon { get; set; } = string.Empty; // Lucide icon identifier

        public int ProductCount { get; set; }
    }
}
