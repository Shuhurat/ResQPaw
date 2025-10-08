using System;
using System.ComponentModel.DataAnnotations;

namespace ResQPaw.Models
{
    public class SOSRequest
    {
        public int Id { get; set; }

        // 🧍 Customer info
        public string CustomerId { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string Message { get; set; }

        // 🩺 Status tracking
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Completed

        // 🧑‍⚕️ Assigned Vet info
        public string? AssignedVetId { get; set; }

        // 🕒 Created time
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // ✅ NEW: Notification tracking
        public bool IsSeen { get; set; } = false; // For offline notification handling
        public string? SeenByVetId { get; set; } // Which vet has seen it
    }
}
