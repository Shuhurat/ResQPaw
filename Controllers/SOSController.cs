using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using ResQPaw.Data;
using ResQPaw.Hubs;
using ResQPaw.Models;
using Microsoft.AspNetCore.Identity;

namespace ResQPaw.Controllers
{
    [Authorize]
    public class SOSController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<SOSHub> _hubContext;

        public SOSController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHubContext<SOSHub> hubContext)
        {
            _context = context;
            _userManager = userManager;
            _hubContext = hubContext;
        }

        [Authorize(Roles = "Customer")]
        public IActionResult Send() => View();

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Send(string address, string message)
        {
            var user = await _userManager.GetUserAsync(User);

            var sos = new SOSRequest
            {
                CustomerId = user.Id,
                Address = address,
                Message = message
            };
            _context.SOSRequests.Add(sos);
            await _context.SaveChangesAsync();

            // ✅ Properly trigger SignalR group message
            await _hubContext.Clients.Group("Vets").SendAsync(
                "ReceiveSOS",
                user.UserName ?? "Unknown Customer",
                address ?? "No address provided",
                message ?? "No message provided"
            );

            TempData["Success"] = "SOS alert sent!";
            return RedirectToAction("Status");
        }

        [Authorize(Roles = "Customer")]
        public IActionResult Status()
        {
            var userId = _userManager.GetUserId(User);
            var requests = _context.SOSRequests
                .Where(r => r.CustomerId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToList();
            return View(requests);
        }

        [Authorize(Roles = "ServiceProvider")]
        public IActionResult VetDashboard()
        {
            var sosList = _context.SOSRequests
                .Where(r => r.Status == "Pending")
                .OrderByDescending(r => r.CreatedAt)
                .ToList();
            return View(sosList);
        }
    }
}
