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
    .AsEnumerable()
    .Select(s => new SOSViewModel
    {
        Id = s.Id,
        CustomerName = _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.FullName
                       ?? _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.UserName
                       ?? "Unknown",
        EmergencyType = s.EmergencyType,
        AnimalType = s.AnimalType,
        AnimalCondition = s.AnimalCondition,
        
        MediaPaths = s.MediaPaths,
        ReporterName = s.ReporterName,
        ReporterPhone = s.ReporterPhone,
        ReporterEmail = s.ReporterEmail,
        Status = s.Status,
        CreatedAt = s.CreatedAt
    })
    .ToList();


            return View(sosList);
        }

        // GET: Vet Dashboard
    
[Authorize(Roles = "ServiceProvider")]
public IActionResult Dashboard()
{
    var sosList = _context.SOSRequests
        .OrderByDescending(s => s.CreatedAt)
        .AsEnumerable()
        .Select(s => new SOSViewModel
        {
            Id = s.Id,
            CustomerName = _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.FullName
                            ?? _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.UserName
                            ?? "Unknown",
            EmergencyType = s.EmergencyType,
            AnimalType = s.AnimalType,
            AnimalCondition = s.AnimalCondition,
            Description = s.Description,
            Location = s.Location,
            MediaPaths = s.MediaPaths,
            ReporterName = s.ReporterName,
            ReporterPhone = s.ReporterPhone,
            ReporterEmail = s.ReporterEmail,
            Status = s.Status,
            CreatedAt = s.CreatedAt
        })
        .ToList();

    return View(sosList);
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
        [HttpGet]
[HttpGet]
[Authorize(Roles = "ServiceProvider")]
public async Task<IActionResult> UnseenSOS()
{
    // Fetch unseen SOS requests
    var unseen = await _context.SOSRequests
        .Where(s => !s.IsSeen)
        .OrderByDescending(s => s.CreatedAt)
        .ToListAsync();

    // Map to a simple JSON-friendly structure
    var result = unseen.Select(s => new
    {
        id = s.Id,
        customerId = s.CustomerId,
        customerName = _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.FullName
                       ?? _userManager.Users.FirstOrDefault(u => u.Id == s.CustomerId)?.UserName
                       ?? "Unknown",
        location = s.Location ?? "Unknown",        // ✅ Updated
        description = s.Description ?? "No details", // ✅ Updated
        emergencyType = s.EmergencyType,
        animalType = s.AnimalType,
        animalCondition = s.AnimalCondition,
        createdAt = s.CreatedAt
    }).ToList();

    // Mark as seen
    var vetId = _userManager.GetUserId(User);
    foreach (var s in unseen)
    {
        s.IsSeen = true;
        s.SeenByVetId = vetId;
    }
    await _context.SaveChangesAsync();

    return Json(result);
}

        public IActionResult Profile() => View();
    }
}
