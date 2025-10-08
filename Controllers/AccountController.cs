using Microsoft.AspNetCore.Mvc;
using ResQPaw.Models;
using System.Threading.Tasks;

namespace ResQPaw.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string email, string password, bool rememberMe)
        {
            // Add your login logic here
            // For now, redirect to home page
            return RedirectToAction("Index", "Home");
        }

        // REMOVED THE DUPLICATE: public IActionResult UserProfile() { return View(); }
        
        // KEEP ONLY THIS ONE UserProfile ACTION WITH OPTIONAL PARAMETER
        [HttpGet]
        public IActionResult UserProfile(string tab = "profile-info")
        {
            // Pass the tab parameter to the view if needed
            ViewData["ActiveTab"] = tab;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Your login logic here
                return RedirectToAction("Index", "Home");
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Your registration logic here
                // Create user, sign in, etc.
                return RedirectToAction("Index", "Home");
            }
            return View(model);
        }

        [HttpPost]
        public IActionResult Register(string fullName, string email, string password, string confirmPassword,
                                   string userType, bool agreeToTerms, bool subscribeToNewsletter)
        {
            // Add your registration logic here
            // For now, redirect to home page
            return RedirectToAction("Index", "Home");
        }
    }
}