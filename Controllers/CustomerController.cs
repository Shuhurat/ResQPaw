using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ResQPaw.Controllers
{
    [Authorize(Roles = "Customer")] // Only customers can access
    public class CustomerController : Controller
    {
        // ✅ Customer dashboard — see SOS status, pet info, etc.
        public IActionResult Dashboard()
        {
            return View();
        }

        // ✅ Customer profile page
        public IActionResult Profile()
        {
            return View();
        }
    }
}
