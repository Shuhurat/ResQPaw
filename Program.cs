using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResQPaw.Data;
using ResQPaw.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Database (SQLite for now) - Use configuration instead of hardcoding
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configure Identity with ApplicationUser
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// 3. Add MVC Controllers + Views
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();  // for Identity UI

var app = builder.Build();

// Middleware pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// 🔑 Enable authentication + authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();  // enable Identity UI endpoints

app.Run();