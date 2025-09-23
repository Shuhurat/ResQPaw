using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ResQPaw.Controllers
{
    [Authorize] // Protect all actions in this controller
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            // No need to check session - [Authorize] handles authentication
            // User.Identity.Name is automatically available
            return View();
        }
    }
}