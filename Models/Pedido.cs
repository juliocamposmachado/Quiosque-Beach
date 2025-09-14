using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuiosqueBeach.Models
{
    public enum StatusPedido
    {
        Pendente = 0,
        Confirmado = 1,
        EmPreparo = 2,
        Pronto = 3,
        Entregue = 4,
        Cancelado = 5
    }

    public class Pedido
    {
        public int Id { get; set; }
        
        [Required]
        public string NumeroMesa { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? NomeCliente { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal ValorTotal { get; set; }
        
        public StatusPedido Status { get; set; } = StatusPedido.Pendente;
        
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public DateTime? DataConfirmacao { get; set; }
        public DateTime? DataEntrega { get; set; }
        
        [MaxLength(500)]
        public string? Observacoes { get; set; }
        
        public virtual ICollection<ItemPedido> Itens { get; set; } = new List<ItemPedido>();
        
        // Propriedades calculadas para separação de pedidos
        public bool TemItensCozinha => Itens?.Any(i => i.Produto?.Categoria?.Tipo == "Comida") ?? false;
        public bool TemItensBar => Itens?.Any(i => i.Produto?.Categoria?.Tipo == "Bebida") ?? false;
    }
}
