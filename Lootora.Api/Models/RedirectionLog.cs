using System;
using System.ComponentModel.DataAnnotations;

namespace Lootora.Api.Models
{
    public class RedirectionLog
    {
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        public Product? Product { get; set; }

        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Brand { get; set; } = string.Empty;

        public DateTime ClickedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        public string UserIp { get; set; } = string.Empty;
    }
}
