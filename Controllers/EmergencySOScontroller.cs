using Microsoft.AspNetCore.Mvc;
using ResQPaw.Models;
using System;

namespace ResQPaw.Controllers
{
    public class EmergencyController : Controller
    {
        [HttpGet]
        public IActionResult SOS()
        {
            return View();
        }

        [HttpPost]
        public IActionResult SOS(string emergencyType, string animalType, string animalCondition, 
                               string emergencyDescription, string location, string reporterName, 
                               string reporterPhone, string reporterEmail, bool canAssist)
        {
            // Create SOSRequest model from form data
            var sosRequest = new SOSRequest
            {
                PetName = "Unknown", // You can modify this based on your form
                PetType = animalType,
                ProblemDescription = emergencyDescription,
                ContactNumber = reporterPhone,
                Location = location,
                RequestTime = DateTime.UtcNow,
                Status = "Pending",
                UserId = "anonymous"
            };

            // TODO: Add your emergency report processing logic here
            // Save to database, send notifications, etc.
            // _context.SOSRequests.Add(sosRequest);
            // _context.SaveChanges();

            // Pass data to confirmation page
            TempData["EmergencyReported"] = true;
            TempData["AnimalType"] = animalType;
            TempData["Location"] = location;
            TempData["ReporterName"] = reporterName;
            
            return RedirectToAction("SOSConfirmation");
        }

        [HttpGet]
        public IActionResult SOSConfirmation()
        {
            // Check if user came from SOS form submission
            if (TempData["EmergencyReported"] != null && (bool)TempData["EmergencyReported"])
            {
                ViewBag.AnimalType = TempData["AnimalType"];
                ViewBag.Location = TempData["Location"]; 
                ViewBag.ReporterName = TempData["ReporterName"];
                return View();
            }
            
            // If not, redirect back to SOS form
            return RedirectToAction("SOS");
        }
    }
}