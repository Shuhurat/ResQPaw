using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResQPaw.Data;
using ResQPaw.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Database (SQLite)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configure Identity with ApplicationUser
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders()
.AddDefaultUI(); // <-- adds Razor Pages for Identity

// 3. Configure Application Cookie (MOVE THIS BEFORE builder.Build())
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login"; // Make sure this points to your custom login
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Home/AccessDenied";
});

// 4. Add MVC + Razor Pages
builder.Services.AddControllersWithViews();
//builder.Services.AddRazorPages();

var app = builder.Build();

// Middleware
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Map routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

//app.MapRazorPages(); // enable Identity Razor Pages

app.Run();
// NOTHING SHOULD BE AFTER app.Run() - IT WILL NEVER EXECUTE