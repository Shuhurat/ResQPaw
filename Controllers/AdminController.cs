using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ResQPaw.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ResQPaw.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // ✅ Admin dashboard (your existing action)
        public IActionResult Dashboard()
        {
            return View();
        }

        // ✅ Show all users and their roles
        public async Task<IActionResult> UserRoles()
        {
            var users = _userManager.Users.ToList();
            var userRoles = new List<(string Email, IList<string> Roles)>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userRoles.Add((user.Email, roles));
            }

            return View(userRoles);
        }
    }
}
