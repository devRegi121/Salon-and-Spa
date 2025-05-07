using System.ComponentModel.DataAnnotations;

namespace SalonAndSpa.Data.Models
{
    public class Staff : User
    {
        [Required]
        [StringLength(100)]
        public string Specialization { get; set; } = string.Empty;  

        [Required]
        [StringLength(50)]
        public string WorkingHours { get; set; } = string.Empty;    

        [Required]
        [StringLength(50)]
        public string JobTitle { get; set; } = string.Empty;        
    }
}
