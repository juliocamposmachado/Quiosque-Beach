using Microsoft.EntityFrameworkCore;
using QuiosqueBeach.Data;
using QuiosqueBeach.Models;
using QuiosqueBeach.Services;

namespace QuiosqueBeach
{
    public class DatabaseInitializer
    {
        public static async Task InitializeAsync(QuiosqueContext context, IAuthService authService)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if we have data already
            if (context.Categorias.Any())
            {
                return; // Database has been seeded
            }

            // Add Categories
            var categorias = new List<Categoria>
            {
                new Categoria { Nome = "Bebidas Geladas", Descricao = "Cervejas, refrigerantes e sucos gelados", Tipo = "Bebida" },
                new Categoria { Nome = "Bebidas Quentes", Descricao = "Café, chá e chocolate quente", Tipo = "Bebida" },
                new Categoria { Nome = "Drinks", Descricao = "Coquetéis e bebidas alcoólicas", Tipo = "Bebida" },
                new Categoria { Nome = "Petiscos Fritos", Descricao = "Porções fritas e crocantes", Tipo = "Comida" },
                new Categoria { Nome = "Petiscos Grelhados", Descricao = "Carnes e peixes grelhados", Tipo = "Comida" },
                new Categoria { Nome = "Saladas", Descricao = "Saladas frescas e saudáveis", Tipo = "Comida" },
                new Categoria { Nome = "Sobremesas", Descricao = "Doces e sobremesas especiais", Tipo = "Comida" }
            };

            context.Categorias.AddRange(categorias);
            await context.SaveChangesAsync();

            // Add Products
            var produtos = new List<Produto>
            {
                // Bebidas Geladas (ID 1)
                new Produto { Nome = "Cerveja Original 600ml", Descricao = "Cerveja gelada long neck", Preco = 8.50m, CategoriaId = 1, EstoqueAtual = 50, EstoqueMinimo = 10 },
                new Produto { Nome = "Cerveja Skol 350ml", Descricao = "Cerveja gelada lata", Preco = 5.00m, CategoriaId = 1, EstoqueAtual = 100, EstoqueMinimo = 20 },
                new Produto { Nome = "Coca-Cola 350ml", Descricao = "Refrigerante gelado", Preco = 4.50m, CategoriaId = 1, EstoqueAtual = 80, EstoqueMinimo = 15 },
                new Produto { Nome = "Guaraná Antarctica 350ml", Descricao = "Guaraná gelado", Preco = 4.50m, CategoriaId = 1, EstoqueAtual = 60, EstoqueMinimo = 15 },
                new Produto { Nome = "Suco de Laranja Natural", Descricao = "Suco natural da fruta", Preco = 6.00m, CategoriaId = 1, EstoqueAtual = 30, EstoqueMinimo = 5 },
                new Produto { Nome = "Água Mineral 500ml", Descricao = "Água mineral gelada", Preco = 3.00m, CategoriaId = 1, EstoqueAtual = 100, EstoqueMinimo = 20 },

                // Bebidas Quentes (ID 2)
                new Produto { Nome = "Café Expresso", Descricao = "Café forte e aromático", Preco = 4.00m, CategoriaId = 2, EstoqueAtual = 999, EstoqueMinimo = 0 },
                new Produto { Nome = "Cappuccino", Descricao = "Café com leite e canela", Preco = 7.00m, CategoriaId = 2, EstoqueAtual = 999, EstoqueMinimo = 0 },
                new Produto { Nome = "Chocolate Quente", Descricao = "Chocolate cremoso", Preco = 8.00m, CategoriaId = 2, EstoqueAtual = 999, EstoqueMinimo = 0 },

                // Drinks (ID 3)
                new Produto { Nome = "Caipirinha", Descricao = "Cachaça com limão e açúcar", Preco = 12.00m, CategoriaId = 3, EstoqueAtual = 999, EstoqueMinimo = 0 },
                new Produto { Nome = "Mojito", Descricao = "Rum com hortelã e limão", Preco = 15.00m, CategoriaId = 3, EstoqueAtual = 999, EstoqueMinimo = 0 },
                new Produto { Nome = "Piña Colada", Descricao = "Rum com coco e abacaxi", Preco = 18.00m, CategoriaId = 3, EstoqueAtual = 999, EstoqueMinimo = 0 },

                // Petiscos Fritos (ID 4)
                new Produto { Nome = "Batata Frita Simples", Descricao = "Batata frita crocante (500g)", Preco = 15.00m, CategoriaId = 4, EstoqueAtual = 30, EstoqueMinimo = 5 },
                new Produto { Nome = "Batata Frita com Queijo", Descricao = "Batata frita com queijo derretido", Preco = 18.00m, CategoriaId = 4, EstoqueAtual = 25, EstoqueMinimo = 5 },
                new Produto { Nome = "Onion Rings", Descricao = "Anéis de cebola empanados", Preco = 16.00m, CategoriaId = 4, EstoqueAtual = 20, EstoqueMinimo = 5 },
                new Produto { Nome = "Bolinho de Bacalhau", Descricao = "6 bolinhos crocantes", Preco = 22.00m, CategoriaId = 4, EstoqueAtual = 15, EstoqueMinimo = 3 },

                // Petiscos Grelhados (ID 5)
                new Produto { Nome = "Picanha Grelhada", Descricao = "Picanha suculenta (400g)", Preco = 45.00m, CategoriaId = 5, EstoqueAtual = 8, EstoqueMinimo = 2 },
                new Produto { Nome = "Frango Grelhado", Descricao = "Peito de frango temperado (300g)", Preco = 25.00m, CategoriaId = 5, EstoqueAtual = 12, EstoqueMinimo = 3 },

                // Saladas (ID 6)
                new Produto { Nome = "Salada Caesar", Descricao = "Alface, croutons, parmesão e molho caesar", Preco = 22.00m, CategoriaId = 6, EstoqueAtual = 20, EstoqueMinimo = 3 },
                new Produto { Nome = "Salada de Frango", Descricao = "Mix de folhas com frango grelhado", Preco = 26.00m, CategoriaId = 6, EstoqueAtual = 15, EstoqueMinimo = 3 },

                // Sobremesas (ID 7)
                new Produto { Nome = "Pudim de Leite", Descricao = "Pudim caseiro cremoso", Preco = 12.00m, CategoriaId = 7, EstoqueAtual = 10, EstoqueMinimo = 2 },
                new Produto { Nome = "Brigadeiro Gourmet", Descricao = "4 brigadeiros especiais", Preco = 15.00m, CategoriaId = 7, EstoqueAtual = 20, EstoqueMinimo = 3 }
            };

            context.Produtos.AddRange(produtos);
            await context.SaveChangesAsync();

            // Add Admin User
            var adminUser = new Usuario
            {
                Nome = "Administrador",
                Email = "admin@quiosquebeach.com",
                SenhaHash = authService.HashSenha("admin123"),
                Perfil = "Admin",
                DataCriacao = DateTime.Now
            };

            context.Usuarios.Add(adminUser);
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Banco de dados inicializado com sucesso!");
            Console.WriteLine("📧 Admin: admin@quiosquebeach.com");
            Console.WriteLine("🔑 Senha: admin123");
        }
    }
}
