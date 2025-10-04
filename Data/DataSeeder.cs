using Microsoft.AspNetCore.Identity;





public static class DbInitializer
{
    public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync("Customer"))
            await roleManager.CreateAsync(new IdentityRole("Customer"));
        if (!await roleManager.RoleExistsAsync("ServiceProvider"))
            await roleManager.CreateAsync(new IdentityRole("ServiceProvider"));
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));
    }
}
