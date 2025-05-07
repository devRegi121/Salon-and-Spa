using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonAndSpa.Data.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }

        [Required]
        public int CustomerId { get; set; }        // Links to the Customer (User table)

        [Required]
        public int StaffId { get; set; }           // Links to Staff (User table)

        [Required]
        public int ServiceId { get; set; }         // Links to the Service

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public TimeSpan AppointmentTime { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending";    // Pending, Confirmed, Canceled

        [Required]
        [StringLength(10)]
        public string PaymentMethod { get; set; } = "Cash";  // Always Cash 

        public bool IsPaid { get; set; } = false;           // Paid or Not Paid

        // Navigation properties (optional)
        [ForeignKey("CustomerId")]
        public User? Customer { get; set; }

        [ForeignKey("StaffId")]
        public Staff? Staff { get; set; }

        [ForeignKey("ServiceId")]
        public Service? Service { get; set; }
    }
}
