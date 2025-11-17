     using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ResQPaw.Models;

namespace ResQPaw.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<SOSRequest> SOSRequests { get; set; }

        public DbSet<Appointment> Appointments { get; set; }

        

        public DbSet<Vet> Vets { get; set; }
    }

    
    



}