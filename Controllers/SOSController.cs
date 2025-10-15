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
        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Send(
    string EmergencyType,
    string AnimalType,
    string AnimalCondition,
    string Description,
    string Address,
    string ReporterName,
    string ReporterPhone,
    string ReporterEmail,
    List<IFormFile>? MediaFiles)
        {
            var user = await _userManager.GetUserAsync(User);

            var sos = new SOSRequest
            {
                CustomerId = user.Id,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                IsSeen = false,

                // ✅ New fields
                EmergencyType = EmergencyType,
                AnimalType = AnimalType,
                AnimalCondition = AnimalCondition,
                ReporterName = ReporterName,
                ReporterPhone = ReporterPhone,
                ReporterEmail = ReporterEmail,
                Description = Description,
                Location = Address

            };

            // ✅ Handle file uploads
            if (MediaFiles != null && MediaFiles.Count > 0)
            {
                string uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/sos");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                var filePaths = new List<string>();
                foreach (var file in MediaFiles)
                {
                    string fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    string path = Path.Combine(uploadFolder, fileName);
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    filePaths.Add("/uploads/sos/" + fileName);
                }

                sos.MediaPaths = string.Join(",", filePaths); // Save all uploaded paths as comma-separated
            }

            _context.SOSRequests.Add(sos);
            await _context.SaveChangesAsync();

            // Real-time alert for vets/admins
            await _hubContext.Clients.Group("Vets").SendAsync(
                "ReceiveSOS",
                ReporterName ?? user.UserName ?? "Unknown",
                Address ?? "No address provided",
                Description ?? "No message provided"
            );

            TempData["Success"] = "SOS alert sent successfully!";
            return RedirectToAction("Status");
        }
       [Authorize(Roles = "Customer")]
public async Task<IActionResult> Status()
{
    var userId = _userManager.GetUserId(User);

var sosList = _context.SOSRequests
    .Where(s => s.CustomerId == userId) // only current user
    .OrderByDescending(s => s.CreatedAt)
    .AsEnumerable()  // bring into memory, EF stops translating to SQL
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


    return View(sosList); // now only passes user's own SOS requests
}


        [Authorize(Roles = "ServiceProvider")]
        public IActionResult VetDashboard()
{
    var sosList = _context.SOSRequests
        .OrderByDescending(s => s.CreatedAt)
        .AsEnumerable() // fetch into memory
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

    return View(sosList); // ✅ Now passes List<SOSViewModel>
}



        [Authorize(Roles = "Admin")]
        public IActionResult AdminMonitor()
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

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [IgnoreAntiforgeryToken]  // 🚨 Important for JS fetch()
        public async Task<IActionResult> Delete(int id)
        {
            var sos = await _context.SOSRequests.FindAsync(id);
            if (sos == null)
                return NotFound(new { success = false, message = "Not found" });

            _context.SOSRequests.Remove(sos);
            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkDone(int id)
        {
            var sos = await _context.SOSRequests.FindAsync(id);
            if (sos != null && sos.Status == "Contacted")
            {
                sos.Status = "Completed";
                await _context.SaveChangesAsync();
            }

            return RedirectToAction("AdminMonitor");
        }

    }
    
    
}