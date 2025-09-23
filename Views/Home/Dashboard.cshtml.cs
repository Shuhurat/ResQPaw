using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ResQPaw.Pages
{
    [Authorize] // 🔑 Only authenticated users can access this page
    public class DashboardModel : PageModel
    {
        public void OnGet()
        {
            // Optional: add any logic you need when the page loads
        }
    }
}
