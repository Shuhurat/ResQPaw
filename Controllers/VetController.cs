using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ResQPaw.Data;
using ResQPaw.Models;
using System.Linq;

namespace ResQPaw.Controllers
{
    [Authorize(Roles = "ServiceProvider")] // Only vets can access
    public class VetController : Controller
    {
        // ✅ Vet dashboard — shows pending SOS alerts, etc.

        private readonly ApplicationDbContext _context;
         private readonly UserManager<ApplicationUser> _userManager;



    public VetController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
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


        [Authorize(Roles = "ServiceProvider")]
public IActionResult UnseenSOS()
{
    var unseenSos = _context.SOSRequests
        .Where(s => !s.IsSeen)
        .OrderByDescending(s => s.CreatedAt)
        .ToList();

    // ✅ Once loaded, mark as seen by this vet
    var vetId = _userManager.GetUserId(User);
    foreach (var sos in unseenSos)
    {
        sos.IsSeen = true;
        sos.SeenByVetId = vetId;
    }
    _context.SaveChanges();

    return Json(unseenSos);
}


        
        public IActionResult Dashboard()
        {
            return View();
        }

        // ✅ Vet profile page (optional)
        public IActionResult Profile()
        {
            return View();
        }

       
    }
}
