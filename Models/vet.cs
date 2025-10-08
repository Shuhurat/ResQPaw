using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ResQPaw.Models
{
    public class Vet
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Clinic { get; set; } = string.Empty;

        [Required]
        public string Specialty { get; set; } = string.Empty;

        [Required]
        public string Experience { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string ContactNumber { get; set; } = string.Empty;

        [Range(1, 5)]
        public double Rating { get; set; }

        public int Reviews { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;

        public List<string> Species { get; set; } = new List<string>();

        [Required]
        public string Availability { get; set; } = string.Empty;

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        // New properties for profile page
        public List<string> Languages { get; set; } = new List<string>();
        public string Education { get; set; } = string.Empty;
        public string ConsultationFee { get; set; } = string.Empty;
    }
}