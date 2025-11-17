using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace ResQPaw.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        [Required]
        public int VetId { get; set; }

        [ValidateNever]                 // ← ignore during model binding/validation
        public Vet? Vet { get; set; }   // ← make nullable

        // This is set server-side; do NOT require from the form
        public string? CustomerId { get; set; }

        [ValidateNever]                             // ← ignore
        public ApplicationUser? Customer { get; set; } // ← make nullable

        [Required, DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Required, DataType(DataType.Time)]
        public TimeSpan Time { get; set; }

        [Required, StringLength(500)]
        public string Reason { get; set; } = string.Empty;

        [Required, StringLength(30)]
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}