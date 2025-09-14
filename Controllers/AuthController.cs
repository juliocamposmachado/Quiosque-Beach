using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;
using QuiosqueBeach.Data;
using QuiosqueBeach.Models;
using QuiosqueBeach.Services;

namespace QuiosqueBeach.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly QuiosqueContext _context;
        private readonly IAuthService _authService;

        public AuthController(QuiosqueContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Ativo);

            if (usuario == null || !_authService.VerificarSenha(request.Senha, usuario.SenhaHash))
            {
                return Unauthorized(new { message = "Email ou senha inválidos" });
            }

            usuario.UltimoLogin = DateTime.Now;
            await _context.SaveChangesAsync();

            var token = _authService.GerarToken(usuario);

            return Ok(new
            {
                Token = token,
                Usuario = new
                {
                    usuario.Id,
                    usuario.Nome,
                    usuario.Email,
                    usuario.Perfil
                }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Verificar se o email já existe
            if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email já cadastrado" });
            }

            var usuario = new Usuario
            {
                Nome = request.Nome,
                Email = request.Email,
                SenhaHash = _authService.HashSenha(request.Senha),
                Perfil = request.Perfil ?? "Admin",
                DataCriacao = DateTime.Now
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var token = _authService.GerarToken(usuario);

            return Ok(new
            {
                Token = token,
                Usuario = new
                {
                    usuario.Id,
                    usuario.Nome,
                    usuario.Email,
                    usuario.Perfil
                }
            });
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin(string returnUrl = "/")
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleCallback", "Auth", new { returnUrl })
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback(string returnUrl = "/")
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Erro na autenticação com Google" });
            }

            var claims = result.Principal.Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var googleId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email não encontrado na conta Google" });
            }

            // Buscar ou criar usuário
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            
            if (usuario == null)
            {
                // Criar novo usuário
                usuario = new Usuario
                {
                    Nome = name ?? email,
                    Email = email,
                    SenhaHash = _authService.HashSenha(Guid.NewGuid().ToString()), // Senha aleatória
                    Perfil = "Cliente",
                    GoogleId = googleId,
                    DataCriacao = DateTime.Now
                };
                
                _context.Usuarios.Add(usuario);
            }
            else
            {
                // Atualizar informações do Google se necessário
                if (string.IsNullOrEmpty(usuario.GoogleId))
                {
                    usuario.GoogleId = googleId;
                }
                usuario.UltimoLogin = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            var token = _authService.GerarToken(usuario);

            // Para PWA/SPA, redirecionar com token na query string
            var redirectUrl = $"{returnUrl}?token={token}&user={Uri.EscapeDataString(System.Text.Json.JsonSerializer.Serialize(new { usuario.Id, usuario.Nome, usuario.Email, usuario.Perfil }))}";
            
            return Redirect(redirectUrl);
        }

        [HttpPost("google-mobile")]
        public async Task<IActionResult> GoogleMobileLogin([FromBody] GoogleMobileRequest request)
        {
            // Para uso em apps móveis - recebe token do Google diretamente
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { message = "Email é obrigatório" });
            }

            // Buscar ou criar usuário
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (usuario == null)
            {
                usuario = new Usuario
                {
                    Nome = request.Name ?? request.Email,
                    Email = request.Email,
                    SenhaHash = _authService.HashSenha(Guid.NewGuid().ToString()),
                    Perfil = "Cliente",
                    GoogleId = request.GoogleId,
                    DataCriacao = DateTime.Now
                };
                
                _context.Usuarios.Add(usuario);
            }
            else
            {
                if (string.IsNullOrEmpty(usuario.GoogleId))
                {
                    usuario.GoogleId = request.GoogleId;
                }
                usuario.UltimoLogin = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            var token = _authService.GerarToken(usuario);

            return Ok(new
            {
                Token = token,
                Usuario = new
                {
                    usuario.Id,
                    usuario.Nome,
                    usuario.Email,
                    usuario.Perfil
                }
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string? Perfil { get; set; }
    }

    public class GoogleMobileRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? GoogleId { get; set; }
        public string? IdToken { get; set; }
    }
}
