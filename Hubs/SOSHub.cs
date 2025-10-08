using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ResQPaw.Hubs
{
    public class SOSHub : Hub
    {
        public async Task JoinVetGroup()
{
    await Groups.AddToGroupAsync(Context.ConnectionId, "Vets");
    await Clients.Caller.SendAsync("JoinedGroup", "Vets");
}


        // Server-side helper if you ever want to call hub method directly
        public async Task SendSOSAlert(string customerName, string address, string message)
        {
            await Clients.Group("Vets").SendAsync("ReceiveSOS", customerName, address, message);
        }
    }
}
