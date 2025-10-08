using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ResQPaw.Data;
using ResQPaw.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using ResQPaw.Hubs;
using System.Threading.Tasks;

namespace ResQPaw.Controllers
{
    [Authorize(Roles = "ServiceProvider")]
    public class VetController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<SOSHub> _hubContext;

        public VetController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHubContext<SOSHub> hubContext)
        {
            _context = context;
            _userManager = userManager;
            _hubContext = hubContext;
        }

        public IActionResult Notifications()
        {
            var sosList = _context.SOSRequests
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new SOSViewModel
                {
                    Id = s.Id,
                    Address = s.Address,
                    Message = s.Message,
                    Status = s.Status,
                    CreatedAt = s.CreatedAt,
                    CustomerName = _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId).FullName
                                   ?? _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId).UserName
                                   ?? "Unknown"
                })
                .ToList();

            return View(sosList);
        }

        // GET: Vet Dashboard
    
public IActionResult Dashboard()
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



        // Mark SOS as contacted
        [HttpPost]
        public async Task<IActionResult> MarkContacted(int id)
        {
            var sos = await _context.SOSRequests.FindAsync(id);
            if (sos != null && sos.Status != "Contacted")
            {
                sos.Status = "Contacted";
                await _context.SaveChangesAsync();

                // Notify customer live
                await _hubContext.Clients.User(sos.CustomerId)
                    .SendAsync("SOSUpdated", sos.Id, sos.Status);
            }
            return RedirectToAction("Dashboard");
        }

        // Optional: fetch unseen SOS
        [HttpGet]
        public async Task<IActionResult> UnseenSOS()
        {
            var unseen = await _context.SOSRequests
                .Where(s => s.Status == "Pending")
                .OrderByDescending(s => s.CreatedAt)
                .AsNoTracking()
                .ToListAsync();

            var result = unseen.Select(s => new
            {
                id = s.Id,
                customerId = s.CustomerId,
                customerName = _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.FullName
                               ?? _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.UserName
                               ?? "Unknown",
                address = s.Address,
                message = s.Message,
                createdAt = s.CreatedAt
            }).ToList();

            return Json(result);
        }

        public IActionResult Profile() => View();
    }
}
