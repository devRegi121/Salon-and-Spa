namespace SalonAndSpa.Data.Models
{
    public class Customer : User  // Inherits from User
    {
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
    }

}
