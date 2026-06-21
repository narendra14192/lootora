using System;
using System.ComponentModel.DataAnnotations;

namespace Lootora.Api.Models
{
    public class WishlistItem
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public User? User { get; set; }

        [Required]
        public int ProductId { get; set; }

        public Product? Product { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
