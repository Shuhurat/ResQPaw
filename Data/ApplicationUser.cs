


using Microsoft.AspNetCore.Identity;

namespace ResQPaw.Models
{
    public class ApplicationUser : IdentityUser
    {
        // If you want vendors/service providers
    public bool IsVendorApproved { get; set; } = false;

        // Add custom properties here
        // public string CustomProperty { get; set; }
        public string ?Role { get; set; }  // store user role (Admin/Customer/ServiceProvider)
        public string ?FullName { get; set; } // extra info if you want
    }
}