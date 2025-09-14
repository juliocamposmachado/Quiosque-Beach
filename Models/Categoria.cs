using System.ComponentModel.DataAnnotations;

namespace QuiosqueBeach.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Descricao { get; set; }
        
        public bool Ativo { get; set; } = true;
        
        // Tipo de categoria: "Bebida" ou "Comida"
        [Required]
        [MaxLength(50)]
        public string Tipo { get; set; } = string.Empty;
        
        public virtual ICollection<Produto> Produtos { get; set; } = new List<Produto>();
    }
}
