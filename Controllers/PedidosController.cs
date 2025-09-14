using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QuiosqueBeach.Data;
using QuiosqueBeach.Models;

namespace QuiosqueBeach.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosController : ControllerBase
    {
        private readonly QuiosqueContext _context;
        private readonly IHubContext<PedidoHub> _hubContext;

        public PedidosController(QuiosqueContext context, IHubContext<PedidoHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/Pedidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos([FromQuery] StatusPedido? status = null, [FromQuery] DateTime? data = null)
        {
            var query = _context.Pedidos
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                        .ThenInclude(pr => pr.Categoria)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(p => p.Status == status.Value);
            }

            if (data.HasValue)
            {
                query = query.Where(p => p.DataCriacao.Date == data.Value.Date);
            }

            var pedidos = await query
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();

            return Ok(pedidos);
        }

        // GET: api/Pedidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pedido>> GetPedido(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                        .ThenInclude(pr => pr.Categoria)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
            {
                return NotFound();
            }

            return pedido;
        }

        // GET: api/Pedidos/cozinha
        [HttpGet("cozinha")]
        public async Task<ActionResult<IEnumerable<object>>> GetPedidosCozinha()
        {
            var pedidos = await _context.Pedidos
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                        .ThenInclude(pr => pr.Categoria)
                .Where(p => p.Status != StatusPedido.Entregue && p.Status != StatusPedido.Cancelado)
                .OrderBy(p => p.DataCriacao)
                .ToListAsync();

            var pedidosCozinha = pedidos
                .Where(p => p.Itens.Any(i => i.Produto.Categoria.Tipo == "Comida"))
                .Select(p => new
                {
                    p.Id,
                    p.NumeroMesa,
                    p.NomeCliente,
                    p.Status,
                    p.DataCriacao,
                    p.Observacoes,
                    Itens = p.Itens.Where(i => i.Produto.Categoria.Tipo == "Comida").Select(i => new
                    {
                        i.Produto.Nome,
                        i.Quantidade,
                        i.Observacoes
                    })
                })
                .ToList();

            return Ok(pedidosCozinha);
        }

        // GET: api/Pedidos/bar
        [HttpGet("bar")]
        public async Task<ActionResult<IEnumerable<object>>> GetPedidosBar()
        {
            var pedidos = await _context.Pedidos
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                        .ThenInclude(pr => pr.Categoria)
                .Where(p => p.Status != StatusPedido.Entregue && p.Status != StatusPedido.Cancelado)
                .OrderBy(p => p.DataCriacao)
                .ToListAsync();

            var pedidosBar = pedidos
                .Where(p => p.Itens.Any(i => i.Produto.Categoria.Tipo == "Bebida"))
                .Select(p => new
                {
                    p.Id,
                    p.NumeroMesa,
                    p.NomeCliente,
                    p.Status,
                    p.DataCriacao,
                    p.Observacoes,
                    Itens = p.Itens.Where(i => i.Produto.Categoria.Tipo == "Bebida").Select(i => new
                    {
                        i.Produto.Nome,
                        i.Quantidade,
                        i.Observacoes
                    })
                })
                .ToList();

            return Ok(pedidosBar);
        }

        // POST: api/Pedidos
        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido(Pedido pedido)
        {
            // Calcular valores dos itens
            foreach (var item in pedido.Itens)
            {
                var produto = await _context.Produtos.FindAsync(item.ProdutoId);
                if (produto != null)
                {
                    item.PrecoUnitario = produto.Preco;
                    item.Subtotal = item.Quantidade * produto.Preco;
                }
            }

            pedido.ValorTotal = pedido.Itens.Sum(i => i.Subtotal);
            pedido.DataCriacao = DateTime.Now;

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            // Notificar via SignalR
            await _hubContext.Clients.All.SendAsync("NovoPedido", pedido);

            return CreatedAtAction("GetPedido", new { id = pedido.Id }, pedido);
        }

        // PUT: api/Pedidos/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusPedido novoStatus)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return NotFound();
            }

            pedido.Status = novoStatus;

            if (novoStatus == StatusPedido.Confirmado)
            {
                pedido.DataConfirmacao = DateTime.Now;
            }
            else if (novoStatus == StatusPedido.Entregue)
            {
                pedido.DataEntrega = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            // Notificar via SignalR
            await _hubContext.Clients.All.SendAsync("StatusPedidoAtualizado", new { pedidoId = id, status = novoStatus });

            return NoContent();
        }

        // DELETE: api/Pedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return NotFound();
            }

            pedido.Status = StatusPedido.Cancelado;
            await _context.SaveChangesAsync();

            // Notificar via SignalR
            await _hubContext.Clients.All.SendAsync("PedidoCancelado", id);

            return NoContent();
        }
    }

    // Hub para SignalR
    public class PedidoHub : Hub
    {
        // Métodos do hub podem ser adicionados aqui se necessário
    }
}
