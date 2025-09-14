using System.ComponentModel.DataAnnotations;

namespace QuiosqueBeach.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string SenhaHash { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Perfil { get; set; } = "Admin"; // Admin, Cozinha, Bar
        
        public bool Ativo { get; set; } = true;
        
        [MaxLength(100)]
        public string? GoogleId { get; set; } // ID do usuário no Google
        
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public DateTime? UltimoLogin { get; set; }
    }
}
