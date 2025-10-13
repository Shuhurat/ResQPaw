using System;
using System.ComponentModel.DataAnnotations;

namespace ResQPaw.Models
{
    public class Vet
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Specialty { get; set; }
        public required string Location { get; set; }
        public required string VetClinic { get; set; }
        public required string Availability { get; set; }
        public required string Species { get; set; }


        // Additional info
        public required string Phone { get; set; }
        public required string Email { get; set; }

        public int ?ExperienceYears { get; set; }
        public string? Services { get; set; }      // Comma-separated list of services
        public double? Rating { get; set; }                // Average rating
        public string? ProfilePhotoUrl { get; set; }
        public bool EmergencyService { get; set; }
        public string? Website { get; set; }
        public string? LanguagesSpoken { get; set; }
    }

}