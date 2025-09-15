using Microsoft.AspNetCore.Mvc;

namespace QuiosqueBeach.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                status = "healthy", 
                timestamp = DateTime.UtcNow,
                service = "QuiosqueBeach API"
            });
        }
    }
}
