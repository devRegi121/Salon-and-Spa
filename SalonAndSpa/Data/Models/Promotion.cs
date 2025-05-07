using System;
using System.ComponentModel.DataAnnotations;

namespace SalonAndSpa.Data.Models
{
    public class Promotion
    {
        [Key]
        public int PromotionId { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; } // Example: "Loyalty Discount", "Spring Promo"

        [Range(0, 100)]
        public decimal DiscountPercentage { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int? ServiceId { get; set; }        // Optional: null = applies to all services
        public Service? Service { get; set; }      // Navigation

        public int? CustomerId { get; set; }       // Optional: null = applies to everyone
        public Customer? Customer { get; set; }    // Navigation
    }
}
