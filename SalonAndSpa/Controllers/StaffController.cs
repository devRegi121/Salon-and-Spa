using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonAndSpa.Data;
using SalonAndSpa.Data.Models;

namespace SalonAndSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StaffController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Staff → View All Staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetStaff()
        {
            return await _context.Staff.ToListAsync();
        }

        // GET: api/Staff/5 → View Staff by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Staff>> GetStaffById(int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
            {
                return NotFound("Staff member not found.");
            }
            return staff;
        }

        // POST: api/Staff → Add Staff
        [HttpPost]
        public async Task<ActionResult<Staff>> AddStaff(Staff staff)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == staff.Username))
            {
                return BadRequest("Username already exists.");
            }

            staff.Title = "Staff";  //Force title to be "Staff"
            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStaffById), new { id = staff.UserId }, staff);
        }

        // PUT: api/Staff/5 → Update Staff
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(int id, Staff staff)
        {
            if (id != staff.UserId)
            {
                return BadRequest("Staff ID mismatch.");
            }

            var existingStaff = await _context.Staff.FindAsync(id);
            if (existingStaff == null)
            {
                return NotFound("Staff member not found.");
            }

            // Only update allowed fields
            existingStaff.Username = staff.Username;
            existingStaff.Email = staff.Email;
            existingStaff.Password = staff.Password;
            existingStaff.Phone = staff.Phone;
            existingStaff.Specialization = staff.Specialization;
            existingStaff.WorkingHours = staff.WorkingHours;
            existingStaff.JobTitle = staff.JobTitle;

            _context.Entry(existingStaff).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Staff/5 → Delete Staff
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
            {
                return NotFound("Staff member not found.");
            }

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
