using System.ComponentModel.DataAnnotations;

namespace SalonAndSpa.Data.Models
{
    public class Service
    {
        [Key]
        public int ServiceId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int DurationInMinutes { get; set; }  // Example: 60 minutes

        [StringLength(50)]
        public string? Category { get; set; }  // Example: "Hair", "Nails", "Massage"
    }
}
