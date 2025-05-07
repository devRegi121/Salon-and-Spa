using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonAndSpa.Data.Models
{
    public class Manager : User  // Inherits all fields from User
    {
        [StringLength(1000)]
        public string? Permissions { get; set; }
        // Example: "CanManageStaff,CanManageServices,CanViewAppointments,CanCheckReports,CanHandleInventory,CanViewPayments"

        [StringLength(255)]
        public string? Description { get; set; }
        // Example: "Senior Manager responsible for all appointments and staff management."

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        // Automatically sets the time when the Manager account is created
    }
}
