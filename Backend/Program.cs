using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using QuiosqueBeach.Data;
using QuiosqueBeach.Services;
using QuiosqueBeach.Controllers;
using QuiosqueBeach.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Configurar Entity Framework
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (connectionString?.StartsWith("postgres") == true || Environment.GetEnvironmentVariable("DATABASE_URL") != null)
{
    // PostgreSQL para produção (Render/Railway)
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL") ?? connectionString;
    builder.Services.AddDbContext<QuiosqueContext>(options =>
        options.UseNpgsql(databaseUrl));
}
else
{
    // SQL Server para desenvolvimento local
    builder.Services.AddDbContext<QuiosqueContext>(options =>
        options.UseSqlServer(connectionString));
}

// Configurar JWT Authentication
var key = Encoding.ASCII.GetBytes(builder.Configuration["JwtKey"] ?? "QuiosqueBeachSecretKey2024!@#$%");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Google:ClientId"] 
            ?? Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? "";
        options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] 
            ?? Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET") ?? "";
        options.CallbackPath = "/signin-google";
        options.SaveTokens = true;
    });

// Registrar serviços
builder.Services.AddScoped<IAuthService, AuthService>();

// Configurar SignalR
builder.Services.AddSignalR();

// Configurar CORS
var frontendUrl = builder.Configuration["FrontendUrl"] ?? "http://localhost:5000";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                frontendUrl, 
                "http://localhost:3000", 
                "http://localhost:5000",
                "https://localhost:5001",
                "https://quiosque-beach.vercel.app",
                "https://quiosque-beach-api.onrender.com"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Configurar arquivos estáticos
app.UseStaticFiles();

// Configurar CORS
app.UseCors("AllowFrontend");

// Configurar Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Mapear controllers
app.MapControllers();

// Configurar SignalR Hub
app.MapHub<PedidoHub>("/pedidoHub");

// Configurar roteamento específico para arquivos estáticos
// O index.html será servido como página inicial com verificação de auth
// Não usar MapFallbackToFile para evitar interferir com as rotas da API

Console.WriteLine("🚀 Quiosque Beach iniciado!");
Console.WriteLine("📱 Cliente: http://localhost:5000");
Console.WriteLine("⚙️ Admin: http://localhost:5000/admin");
Console.WriteLine("👤 Login: admin@quiosquebeach.com / admin123");

// Configurar URL para produção (Render)
var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();
