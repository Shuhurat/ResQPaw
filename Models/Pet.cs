using System.ComponentModel.DataAnnotations;

namespace ResQPaw.Models
{
    public class Pet
    {
        public int Id { get; set; }

        [Required] public string Name { get; set; }
        public string Breed { get; set; }
        public int Age { get; set; }

        // Adoption, Rescue, Foster
        public string Status { get; set; }
    }
}
