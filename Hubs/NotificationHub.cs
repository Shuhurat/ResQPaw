using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var user = Context.User;
        if (user.IsInRole("Vet"))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Vets");
        }
        else if (user.IsInRole("Admin"))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
        }
        await base.OnConnectedAsync();
    }
}
