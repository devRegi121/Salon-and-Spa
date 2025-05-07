using Microsoft.EntityFrameworkCore;
using SalonAndSpa.Data.Models;

namespace SalonAndSpa.Data
{
    public class AppDbInitializer
    {
        public static void Seed(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<AppDbContext>();

                // Apply pending migrations if any
                context.Database.Migrate();

                // Seed the Manager (ONLY if not already exists)
                if (!context.Managers.Any())
                {
                    context.Managers.Add(new Manager
                    {
                        Username = "manager",                        
                        Email = "manager@salonspa.com",      
                        Password = "1234",                        
                        Phone = "123456789",
                        Title = "Manager",                        
                        Permissions = "CanManageStaff,CanManageServices,CanViewAppointments,CanCheckReports,CanHandleInventory,CanViewPayments",
                        Description = "Main system manager seeded from backend."
                    });

                    context.SaveChanges();
                }

                
            }
        }
    }
}
