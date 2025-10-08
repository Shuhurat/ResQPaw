using Microsoft.AspNetCore.Mvc;
using ResQPaw.Models;
using System.Collections.Generic;
using System.Linq;

namespace ResQPaw.Controllers
{
    public class VeterinariansController : Controller
    {
        // Enhanced mock data with all 12 vets
        private List<Vet> _vets = new List<Vet>
        {
            new Vet 
            { 
                Id = 1,
                Name = "Dr. Ayesha Rahman",
                Clinic = "Dhaka Pet Care Center",
                Specialty = "Surgery & Emergency Care",
                Experience = "12 years",
                Location = "Dhaka",
                Address = "123 Animal Road, Dhaka 1212",
                ContactNumber = "+880 1712 345 678",
                Rating = 4.9,
                Reviews = 142,
                Status = "available",
                Species = new List<string> { "dog", "cat" },
                Availability = "now",
                ImageUrl = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                Description = "Specializing in surgical procedures and emergency pet care with over a decade of experience. Available for consultations and emergency cases.",
                Languages = new List<string> { "Bengali", "English" },
                Education = "DVM, Bangladesh Agricultural University",
                ConsultationFee = "৳1,500"
            },
            new Vet 
            { 
                Id = 2,
                Name = "Dr. Mohammad Ali",
                Clinic = "Chittagong Animal Hospital",
                Specialty = "Dermatology & Allergy",
                Experience = "9 years",
                Location = "Chittagong",
                Address = "456 Marine Drive, Chittagong 4000",
                ContactNumber = "+880 1812 345 679",
                Rating = 4.8,
                Reviews = 98,
                Status = "available",
                Species = new List<string> { "dog", "cat", "bird" },
                Availability = "today",
                ImageUrl = "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                Description = "Expert in diagnosing and treating pet skin conditions and allergies. Special interest in canine dermatology.",
                Languages = new List<string> { "Bengali", "English", "Hindi" },
                Education = "DVM, Chittagong Veterinary College",
                ConsultationFee = "৳1,200"
            },
            // Add remaining 10 vets with similar structure...
            new Vet 
            { 
                Id = 3,
                Name = "Dr. Fatima Begum",
                Clinic = "Sylhet Veterinary Clinic",
                Specialty = "Dentistry & Oral Surgery",
                Experience = "11 years",
                Location = "Sylhet",
                Address = "789 Tea Garden Road, Sylhet 3100",
                ContactNumber = "+880 1912 345 680",
                Rating = 4.7,
                Reviews = 87,
                Status = "busy",
                Species = new List<string> { "dog", "cat", "small" },
                Availability = "weekend",
                ImageUrl = "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                Description = "Specialized training in veterinary dentistry and oral surgery procedures. Certified by the International Veterinary Dentistry Association.",
                Languages = new List<string> { "Bengali", "English" },
                Education = "DVM, Sylhet Agricultural University",
                ConsultationFee = "৳1,800"
            }
            // Continue with the rest of your 12 vets...
        };

        [Route("Veterinarians")]
        public IActionResult Vet()
        {
            return View(_vets);
        }

        [Route("Veterinarians/VetProfile/{id}")]
        public IActionResult VetProfile(int id)
        {
            var vet = _vets.FirstOrDefault(v => v.Id == id);
            if (vet == null)
            {
                return NotFound();
            }
            return View(vet);
        }

        [HttpPost]
        public IActionResult BookAppointment(int vetId, string appointmentDate)
        {
            // Handle appointment booking logic here
            var vet = _vets.FirstOrDefault(v => v.Id == vetId);
            if (vet == null)
            {
                return Json(new { success = false, message = "Veterinarian not found!" });
            }

            // In real application, save to database
            return Json(new { success = true, message = $"Appointment request with {vet.Name} received!" });
        }
    }
}