using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonAndSpa.Data;
using SalonAndSpa.Data.Requests;
using SalonAndSpa.Data.Models;

namespace SalonAndSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        // Customer Registration (POST /api/Customer/Register)
        [HttpPost("Register")]
        public async Task<IActionResult> Register(Customer customer)
        {
            if (await _context.Users.AnyAsync(u => u.Username == customer.Username))
            {
                return BadRequest(new { message = "Username already exists." });
            }

            customer.Title = "Customer";  // Always set as Customer
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Customer registered successfully!", customerId = customer.UserId });
        }

        // Customer Login (POST /api/Customer/Login)
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Username == request.Username && c.Password == request.Password);

            if (customer == null)
            {
                return Unauthorized(new { message = "Invalid username or password!" });
            }

            return Ok(new
            {
                message = "Login successful!",
                customerId = customer.UserId,
                username = customer.Username
            });
        }

        [HttpPost]
        public async Task<IActionResult> AddAppointment([FromBody] Appointment appointment)
        {
            var customer = await _context.Customers.FindAsync(appointment.CustomerId);
            if (customer == null)
            {
                return BadRequest(new { message = "Customer not found." });
            }

            // Check staff and service the same way (optional, recommended!)

            appointment.Status = "Pending";
            appointment.PaymentMethod = "Cash";
            appointment.IsPaid = false;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment booked successfully!", appointmentId = appointment.AppointmentId });
        }

        // GET: api/Appointment/Customer/5 → View bookings for Customer ID 5
        [HttpGet("Customer/{customerId}")]
        public async Task<IActionResult> GetAppointmentsByCustomer(int customerId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.Staff)
                .Where(a => a.CustomerId == customerId)
                .ToListAsync();

            if (appointments == null || appointments.Count == 0)
            {
                return NotFound(new { message = "No appointments found for this customer." });
            }

            return Ok(appointments);
        }


    }


}
