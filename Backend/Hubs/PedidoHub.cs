using Microsoft.AspNetCore.SignalR;

namespace QuiosqueBeach.Hubs
{
    public class PedidoHub : Hub
    {
        public async Task JoinAdminGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
        }

        public async Task LeaveAdminGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
        }

        public async Task JoinMesaGroup(string mesa)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Mesa_{mesa}");
        }

        public async Task LeaveMesaGroup(string mesa)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Mesa_{mesa}");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
