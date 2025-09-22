using System;
using System.ComponentModel.DataAnnotations;

namespace ResQPaw.Models
{
    public class SOSRequest
    {
        public int Id { get; set; }

        public string UserId { get; set; }   // Who made the request

        [Required] public string PetName { get; set; }
        [Required] public string PetType { get; set; } // Dog, Cat, etc.
        [Required] public string ProblemDescription { get; set; }
        [Required] public string ContactNumber { get; set; }

        public string Location { get; set; }
        public DateTime RequestTime { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Pending";
    }
}
