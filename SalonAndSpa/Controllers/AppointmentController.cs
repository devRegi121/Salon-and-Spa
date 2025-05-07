using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonAndSpa.Data;
using SalonAndSpa.Data.Models;
using System.Net;
using System.Net.Mail;

namespace SalonAndSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointment → View All Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Staff)
                .Include(a => a.Service)
                .ToListAsync();
        }

        // GET: api/Appointment/5 → View Appointment by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Staff)
                .Include(a => a.Service)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            return appointment;
        }

        // POST: api/Appointment → Add New Booking (Always Cash Payment)
        [HttpPost]
        public async Task<ActionResult<Appointment>> AddAppointment(Appointment appointment)
        {
            appointment.Status = "Pending";
            appointment.PaymentMethod = "Cash";
            appointment.IsPaid = false;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointmentId }, appointment);
        }

        // PUT: api/Appointment/Confirm/5 → Confirm Appointment AND Send Email!
        [HttpPut("Confirm/{id}")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Customer)  // Include customer to access email!
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            appointment.Status = "Confirmed";
            await _context.SaveChangesAsync();

            // Send confirmation email
            SendConfirmationEmail(
                appointment.Customer!.Email,
                appointment.Customer.Username,
                appointment.AppointmentDate,
                appointment.AppointmentTime
            );

            return Ok(new { message = "Appointment confirmed and confirmation email sent!" });
        }

        // PUT: api/Appointment/MarkPaid/5 → Mark Payment as Paid
        [HttpPut("MarkPaid/{id}")]
        public async Task<IActionResult> MarkAsPaid(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            appointment.IsPaid = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment marked as paid (Cash)." });
        }

        // DELETE: api/Appointment/5 → Delete Appointment
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Appointment/Customer/5 → View all bookings for Customer ID 5
        [HttpGet("Customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByCustomer(int customerId)
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

        // Email sending method!
        private void SendConfirmationEmail(string toEmail, string customerName, DateTime appointmentDate, TimeSpan appointmentTime)
        {
            var fromAddress = new MailAddress("your-salon-email@example.com", "Salon & Spa");  // CHANGE THIS!
            var toAddress = new MailAddress(toEmail, customerName);
            const string fromPassword = "your-email-password";  // ⚠️ Use app password or secure storage!

            const string subject = "Your Appointment is Confirmed!";
            string body = $"Hello {customerName},\n\n" +
                          $"Your appointment on {appointmentDate:yyyy-MM-dd} at {appointmentTime} has been confirmed.\n\n" +
                          $"Thank you for choosing Salon & Spa! 💖";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",  // Change if using different provider!
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            };

            smtp.Send(message);
        }
    }
}
