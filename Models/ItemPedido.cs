using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuiosqueBeach.Models
{
    public class ItemPedido
    {
        public int Id { get; set; }
        
        public int Quantidade { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal PrecoUnitario { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal Subtotal { get; set; }
        
        [MaxLength(500)]
        public string? Observacoes { get; set; }
        
        // Foreign Keys
        public int PedidoId { get; set; }
        public virtual Pedido Pedido { get; set; } = null!;
        
        public int ProdutoId { get; set; }
        public virtual Produto Produto { get; set; } = null!;
    }
}
