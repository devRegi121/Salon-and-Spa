using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonAndSpa.Data;
using SalonAndSpa.Data.Models;   

namespace SalonAndSpa.Controllers   
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbacksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbacksController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Feedbacks → Customer adds feedback
        [HttpPost]
        public async Task<IActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            var customer = await _context.Customers.FindAsync(feedback.CustomerId);
            var appointment = await _context.Appointments.FindAsync(feedback.AppointmentId);

            if (customer == null || appointment == null)
            {
                return BadRequest(new { message = "Customer or Appointment not found." });
            }

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Feedback submitted successfully!" });
        }

        //GET: api/Feedbacks → Manager/Staff view all feedback
        [HttpGet]
        public async Task<IActionResult> GetFeedbacks()
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.Customer)
                .Include(f => f.Appointment)
                .ToListAsync();

            return Ok(feedbacks);
        }
    }
}
