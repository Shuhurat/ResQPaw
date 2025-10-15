using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http; // for file uploads

namespace ResQPaw.Models
{
    public class SOSRequest
    {
        public int Id { get; set; }

        // 👤 Customer Info
        public string CustomerId { get; set; }

        [Required]
        [Display(Name = "Your Name")]
        public string ReporterName { get; set; }

        [Required]
        [Phone]
        [Display(Name = "Your Phone")]
        public string ReporterPhone { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Your Email")]
        public string ReporterEmail { get; set; }

        // 🐶 Animal Information
        [Required]
        [Display(Name = "Animal Type")]
        public string AnimalType { get; set; } // Dog, Cat, Bird, etc.

        [Required]
        [Display(Name = "Animal Condition")]
        public string AnimalCondition { get; set; } // Injured, Sick, Trapped, etc.

        [Required]
        [Display(Name = "Type of Emergency")]
        public string EmergencyType { get; set; } // Accident, Abandonment, etc.

        [Required]
        [Display(Name = "Emergency Description")]
        public string Description { get; set; }

        [Required]
        [Display(Name = "Location Found")]
        public string  Location { get; set; }

        // 📸 Photos/Videos (store file paths)
        [Display(Name = "Uploaded Media")]
        public string? MediaFilePath { get; set; }

        public string? MediaPaths { get; set; } // comma-separated file URLs

        // ⚙️ Status tracking
        public string Status { get; set; } = "Pending"; // Pending, Contacted, Completed

        // 🧑‍⚕️ Assigned rescuer/vet
        public string? AssignedVetId { get; set; }

        // 🕒 Created time
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // 🔔 Seen tracking
        public bool IsSeen { get; set; } = false;
        public string? SeenByVetId { get; set; }
    }
}
