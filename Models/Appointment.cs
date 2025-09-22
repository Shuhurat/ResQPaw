using System;
using System.ComponentModel.DataAnnotations;

namespace ResQPaw.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        [Required] public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        [Required] public int VetId { get; set; }
        public Vet Vet { get; set; }

        [Required] public DateTime Date { get; set; }
        [Required] public string Time { get; set; }

        // Pending, Confirmed, Cancelled
        public string Status { get; set; } = "Pending";
    }
}
