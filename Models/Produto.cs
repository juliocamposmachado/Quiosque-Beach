using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuiosqueBeach.Models
{
    public class Produto
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Descricao { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal Preco { get; set; }
        
        [MaxLength(255)]
        public string? ImagemUrl { get; set; }
        
        public bool Ativo { get; set; } = true;
        
        public int EstoqueAtual { get; set; } = 0;
        
        public int EstoqueMinimo { get; set; } = 0;
        
        // Foreign Key
        public int CategoriaId { get; set; }
        public virtual Categoria Categoria { get; set; } = null!;
        
        public virtual ICollection<ItemPedido> ItensPedido { get; set; } = new List<ItemPedido>();
        
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public DateTime DataAtualizacao { get; set; } = DateTime.Now;
    }
}
