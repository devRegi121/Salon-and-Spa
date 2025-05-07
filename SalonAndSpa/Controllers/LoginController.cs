using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonAndSpa.Data;
using SalonAndSpa.Data.Requests;
using SalonAndSpa.Data.Models;

namespace SalonAndSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Login
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Search for the manager with matching username and password
            var manager = await _context.Managers
                .FirstOrDefaultAsync(m => m.Username == request.Username && m.Password == request.Password);

            if (manager == null)
            {
                return Unauthorized(new { message = "Invalid username or password!" });
            }

            //  Successfully logged in!
            return Ok(new
            {
                message = "Login successful!",
                username = manager.Username,
                role = manager.Title,
                permissions = manager.Permissions
            });
        }
    }

  
}
