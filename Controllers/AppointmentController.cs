using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResQPaw.Data;
using ResQPaw.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ResQPaw.Controllers
{
    // [Authorize(Roles = "Customer")]
    public class AppointmentController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AppointmentController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Index()
        {
            var userId = _userManager.GetUserId(User);

            // Load from DB first
            var list = await _context.Appointments
                .Include(a => a.Vet)
                .Where(a => a.CustomerId == userId)
                .ToListAsync();

            // Then order in memory (works with TimeSpan)
            var ordered = list
                .OrderByDescending(a => a.Date)
                .ThenByDescending(a => a.Time)
                .ToList();

            return View(ordered);
        }

        [HttpGet]
[Authorize(Roles = "Customer")]
public async Task<IActionResult> Create(int? vetId)
{
    if (vetId.HasValue && vetId.Value > 0)
    {
        var vet = await _context.Vets.FindAsync(vetId.Value);
        if (vet == null) return NotFound();

        ViewBag.LockVet = true;
        ViewBag.SelectedVet = vet;

        // When locked, you can still set an empty SelectList to be safe
        ViewBag.Vets = new SelectList(Enumerable.Empty<SelectListItem>(), "Value", "Text");

        return View(new Appointment
        {
            VetId = vet.Id,
            Date = DateTime.Today.AddDays(1),
            Time = new TimeSpan(10, 0, 0)
        });
    }

    // Dropdown path — MUST be SelectList
    var vetItems = await _context.Vets
        .OrderBy(v => v.Name)
        .Select(v => new { v.Id, Text = $"{v.Name} — {v.VetClinic} ({v.Specialty})" })
        .ToListAsync();

    ViewBag.LockVet = false;
    ViewBag.SelectedVet = null;
    ViewBag.Vets = new SelectList(vetItems, "Id", "Text", vetId); // ✅ correct type

    return View(new Appointment
    {
        Date = DateTime.Today.AddDays(1),
        Time = new TimeSpan(10, 0, 0)
    });
}

[HttpPost]
[Authorize(Roles = "Customer")]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Create(Appointment model)
{
    if (!ModelState.IsValid)
    {
        // Repopulate vet dropdown in case of validation errors
        var vetItems = await _context.Vets
            .OrderBy(v => v.Name)
            .Select(v => new { v.Id, Text = $"{v.Name} — {v.VetClinic} ({v.Specialty})" })
            .ToListAsync();

        ViewBag.Vets = new SelectList(vetItems, "Id", "Text", model.VetId);
        ViewBag.LockVet = model.VetId > 0;
        return View(model);
    }

    var userId = _userManager.GetUserId(User);

    model.CustomerId = userId;
    model.Status = "Pending";
    model.CreatedAt = DateTime.Now;

    _context.Appointments.Add(model);
    await _context.SaveChangesAsync();

    TempData["Flash"] = "✅ Appointment booked successfully!";
    return RedirectToAction(nameof(Index));
}


       


        // Allow customer to cancel their own appointment
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Cancel(int id)
        {
            var userId = _userManager.GetUserId(User);
            var appt = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id && a.CustomerId == userId);
            if (appt == null) return NotFound();

            if (appt.Status != "Cancelled")
            {
                appt.Status = "Cancelled";
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

       [Authorize(Roles = "Vet,ServiceProvider,Admin")]
public async Task<IActionResult> Manage()
{
    var userEmail = User.Identity?.Name;

    if (User.IsInRole("Vet"))
    {
        // Find the vet using their email
        var vet = await _context.Vets.FirstOrDefaultAsync(v => v.Email == userEmail);
        if (vet == null)
            return NotFound("Vet record not found.");

        // Show only appointments for this vet
        var appointments = await _context.Appointments
            .Where(a => a.VetId == vet.Id)
            .Include(a => a.Customer)
            .Include(a => a.Vet)
            .ToListAsync();

        return View(appointments);
    }

    if (User.IsInRole("ServiceProvider"))
    {
        // If you have no separate ServiceProvider table, you can decide what to show.
        // For now, let's show all appointments.
        var appointments = await _context.Appointments
            .Include(a => a.Customer)
            .Include(a => a.Vet)
            .ToListAsync();

        return View(appointments);
    }

    // If Admin, show all appointments
    if (User.IsInRole("Admin"))
    {
        var allAppointments = await _context.Appointments
            .Include(a => a.Customer)
            .Include(a => a.Vet)
            .ToListAsync();

        return View(allAppointments);
    }

    return Forbid();
}



        [HttpPost]
        [ValidateAntiForgeryToken]
         [Authorize(Roles = "ServiceProvider,Admin")] 
        public async Task<IActionResult> SetStatus(int id, string status, int? vetId, string? returnStatus, DateTime? dateFrom, DateTime? dateTo, string? q)
        {
            var allowed = new[] { "Pending", "Confirmed", "Cancelled", "Completed" };
            if (!allowed.Contains(status)) return BadRequest("Invalid status.");

            var appt = await _context.Appointments.FindAsync(id);
            if (appt == null) return NotFound();

            appt.Status = status;
            await _context.SaveChangesAsync();

            TempData["Flash"] = $"Appointment #{id} set to {status}.";
            return RedirectToAction(nameof(Manage), new
            {
                vetId = vetId ?? appt.VetId,
                status = returnStatus ?? "All",
                dateFrom,
                dateTo,
                q
            });
        }
        
    }
}