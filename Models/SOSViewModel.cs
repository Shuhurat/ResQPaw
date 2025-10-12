using System;

namespace ResQPaw.Models
{
    public class SOSViewModel
    {
        public int Id { get; set; }

        // 👤 Customer Info
        public string CustomerName { get; set; } = "";

        // 🐾 Emergency Details
        public string? EmergencyType { get; set; } // e.g., Injury, Lost, Stray, etc.
        public string? AnimalType { get; set; }    // e.g., Dog, Cat, Bird
        public string? AnimalCondition { get; set; } // e.g., Critical, Injured, Safe
        public string? Description { get; set; }     // Details about the emergency

        // 📍 Location
        public string? Location { get; set; }

        // 📸 Media
        public string? MediaPaths { get; set; }

        // ☎️ Reporter Info
        public string? ReporterName { get; set; }
        public string? ReporterPhone { get; set; }
        public string? ReporterEmail { get; set; }

        // 🩺 Status
        public string Status { get; set; } = "Pending";
        public string? AssignedVetName { get; set; }

        public DateTime CreatedAt { get; set; }

        // 🕹️ Backward Compatibility (old fields used in old code)
       
    }
}
