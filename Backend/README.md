# Backend - Sistema Quiosque de Praia

## Descrição
Backend em .NET 8 que fornece a API REST para o sistema de quiosque de praia, incluindo gerenciamento de pedidos, produtos e autenticação.

## Tecnologias Utilizadas
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- SignalR (para atualizações em tempo real)
- JWT Authentication

## Estrutura do Projeto
```
Backend/
├── Controllers/          # Controladores da API
├── Models/              # Modelos de dados
├── Data/                # Contexto do banco de dados
├── Services/            # Serviços de negócio
├── Hubs/                # SignalR hubs para tempo real
├── Program.cs           # Configuração da aplicação
├── appsettings.json     # Configurações
├── banco-completo.sql   # Script do banco
└── setup-database.sql   # Script de setup
```

## Configuração

### 1. Pré-requisitos
- .NET 8 SDK
- SQL Server (Local ou remoto)
- Visual Studio 2022 ou VS Code

### 2. Configuração do Banco de Dados
1. Execute o script `banco-completo.sql` no SQL Server
2. Atualize a connection string em `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=QuiosqueBeach;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

### 3. Executar o Backend
```bash
# Instalar dependências e executar
dotnet restore
dotnet run

# Ou em modo de desenvolvimento
dotnet watch run
```

A API estará disponível em: `https://localhost:7000` ou `http://localhost:5000`

## Endpoints Principais

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/{id}` - Produto específico
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/{id}` - Atualizar produto
- `DELETE /api/produtos/{id}` - Deletar produto

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `POST /api/pedidos` - Criar pedido
- `PUT /api/pedidos/{id}/status` - Atualizar status

### Categorias
- `GET /api/categorias` - Listar categorias

## Deploy
O backend pode ser implantado em:
- Azure App Service
- Render
- Docker
- IIS

Para deploy com Docker:
```bash
docker build -t quiosque-backend .
docker run -p 8080:8080 quiosque-backend
```

## Desenvolvimento
Para desenvolvimento local, certifique-se de que:
1. O SQL Server está rodando
2. O banco de dados foi criado
3. As configurações estão corretas em `appsettings.json`
