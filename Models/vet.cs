using System.ComponentModel.DataAnnotations;

namespace ResQPaw.Models
{
    public class Vet
    {
        public int Id { get; set; }

        [Required] public string Name { get; set; }
        public string Specialty { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
    }
}
