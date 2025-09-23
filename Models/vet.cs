using System.ComponentModel.DataAnnotations;

namespace ResQPaw.Models
{
    public class Vet
    {
        public int Id { get; set; }

        [Required]
         public string Name { get; set; } = null;

        [Required]
        public string Specialty { get; set; } = null;

        [Required]
        public string Address { get; set; } = null;

        private string contactNumber;

        public Vet(string contactNumber)
        {
            this.contactNumber = contactNumber;
        }

        public string GetContactNumber()
        {
            return contactNumber;
        }

        public void SetContactNumber(string value)
        {
            contactNumber = value;
        }
    }
}
