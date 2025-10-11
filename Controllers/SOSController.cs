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
        Message = message,
        IsSeen = false,          // <- mark unseen
        CreatedAt = DateTime.UtcNow
    };

    _context.SOSRequests.Add(sos);
    await _context.SaveChangesAsync();

    // Notify connected vets (real-time)
    await _hubContext.Clients.Group("Vets").SendAsync(
        "ReceiveSOS",
        user.UserName ?? user.Email ?? "Unknown",
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
    // Fetch SOSRequests from database
    var sosList = _context.SOSRequests
        .OrderByDescending(s => s.CreatedAt)
        .AsEnumerable() // move to memory so we can use ?. safely
        .Select(s => new SOSViewModel
        {
            Id = s.Id,
            Address = s.Address,
            Message = s.Message,
            Status = s.Status,
            CreatedAt = s.CreatedAt,
            CustomerName = _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.FullName
                           ?? _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.UserName
                           ?? "Unknown"
        })
        .ToList();

    return View(sosList); // ✅ now returns List<SOSViewModel>
}
    }
}
