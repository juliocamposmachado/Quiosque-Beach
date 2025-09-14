# Quiosque Beach - Sistema de Pedidos para Quiosque

Sistema completo para gerenciamento de pedidos em quiosques de praia, desenvolvido em C# .NET com frontend responsivo.

## ✨ Funcionalidades

### 👥 Versão Cliente
- **Cardápio Digital**: Interface responsiva com produtos organizados por categoria
- **Carrinho de Compras**: Adicionar/remover itens com facilidade
- **Pedidos em Tempo Real**: Acompanhamento do status do pedido em tempo real
- **Interface Móvel**: Otimizado para smartphones e tablets

### 🔧 Versão Administrativa
- **Dashboard**: Visão geral das vendas e pedidos
- **Gerenciamento de Pedidos**: Controle completo do fluxo de pedidos
- **Separação Automática**: Pedidos divididos automaticamente entre cozinha e bar
- **Controle de Estoque**: Gestão de produtos e estoque
- **Relatórios**: Relatórios de vendas e produtos mais vendidos
- **Sistema de Autenticação**: Acesso seguro para administradores

### 🚀 Tecnologias
- **Backend**: C# .NET 8.0 Web API
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Banco de Dados**: SQL Server / SQL Server LocalDB
- **Tempo Real**: SignalR para notificações em tempo real
- **Autenticação**: JWT (JSON Web Tokens)
- **Design**: Responsivo e moderno

## 📋 Pré-requisitos

- .NET 8.0 SDK ou superior
- SQL Server 2019+ ou SQL Server LocalDB
- Navegador web moderno

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd QuiosqueBeach
```

### 2. Configurar o banco de dados

#### Opção A: Usando SQL Server LocalDB (Recomendado para desenvolvimento)
- O projeto já está configurado para usar LocalDB
- A string de conexão padrão: `Server=(localdb)\\mssqllocaldb;Database=QuiosqueBeachDB;Trusted_Connection=true;MultipleActiveResultSets=true`

#### Opção B: Usando SQL Server completo
1. Edite o arquivo `appsettings.json`
2. Altere a string de conexão `DefaultConnection` para apontar para seu servidor SQL Server

### 3. Executar o script de banco de dados
```sql
-- Execute o arquivo setup-database.sql no SQL Server Management Studio
-- ou use o comando sqlcmd:
sqlcmd -S (localdb)\mssqllocaldb -i setup-database.sql
```

### 4. Restaurar pacotes e executar
```bash
# Restaurar dependências
dotnet restore

# Executar a aplicação
dotnet run
```

### 5. Acessar o sistema
- **Cliente**: http://localhost:5000 ou https://localhost:5001
- **Admin**: http://localhost:5000/admin ou https://localhost:5001/admin

## 👤 Login Administrativo

**Credenciais padrão:**
- Email: `admin@quiosquebeach.com`
- Senha: `admin123`

> ⚠️ **Importante**: Altere essas credenciais após a primeira instalação!

## 🔧 Configuração

### Variáveis de Ambiente (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "sua-string-de-conexao"
  },
  "JwtKey": "sua-chave-secreta-jwt-aqui"
}
```

### Configurações de Produção
- Configure HTTPS adequadamente
- Use uma chave JWT segura e exclusiva
- Configure o banco de dados de produção
- Considere usar Azure SQL Database ou similar

## 📱 Como Usar

### Para Clientes:
1. Acesse o site pelo smartphone/tablet
2. Informe o número da mesa
3. Navegue pelo cardápio usando os filtros
4. Adicione itens ao carrinho
5. Finalize o pedido
6. Acompanhe o status em tempo real

### Para Administradores:
1. Acesse `/admin`
2. Faça login com suas credenciais
3. Use o dashboard para visão geral
4. Gerencie pedidos nas seções Cozinha e Bar
5. Adicione/edite produtos na seção Produtos
6. Consulte relatórios para análises

## 🎯 Fluxo dos Pedidos

1. **Pendente**: Cliente fez o pedido
2. **Confirmado**: Pedido foi aceito
3. **Em Preparo**: Cozinha/Bar iniciou o preparo
4. **Pronto**: Pedido está pronto para entrega
5. **Entregue**: Pedido foi entregue ao cliente

## 🔄 Notificações em Tempo Real

O sistema usa SignalR para:
- Notificar novos pedidos para administradores
- Atualizar status dos pedidos para clientes
- Sincronizar informações entre cozinha e bar

## 📊 Relatórios

- Vendas por período
- Produtos mais vendidos
- Análise de performance
- Controle de estoque

## 🛡️ Segurança

- Autenticação JWT para área administrativa
- Validação de dados no backend
- Proteção contra SQL Injection
- Hash seguro de senhas (SHA256)

## 🎨 Personalização

### Cores e Visual
Edite as variáveis CSS em `/wwwroot/css/styles.css`:
```css
:root {
    --primary-color: #0077BE;
    --secondary-color: #FFD700;
    /* ... outras cores */
}
```

### Logo e Branding
- Substitua ícones e logos nos arquivos HTML
- Personalize textos e mensagens
- Ajuste esquema de cores conforme sua marca

## 📦 Estrutura do Projeto

```
QuiosqueBeach/
├── Controllers/          # Controllers da API
├── Models/              # Modelos de dados
├── Data/                # Context do Entity Framework
├── Services/            # Serviços de negócio
├── wwwroot/            # Arquivos estáticos
│   ├── css/            # Estilos CSS
│   ├── js/             # JavaScript
│   ├── images/         # Imagens
│   └── admin/          # Painel administrativo
├── Properties/         # Configurações do projeto
├── setup-database.sql  # Script de criação do BD
└── README.md          # Este arquivo
```

## 🚀 Deploy em Produção

### IIS (Windows Server)
1. Publique a aplicação: `dotnet publish -c Release`
2. Configure o IIS com ASP.NET Core Module
3. Aponte para a pasta de publicação
4. Configure SSL/TLS

### Azure App Service
1. Configure connection string no Azure
2. Use Azure SQL Database
3. Configure variáveis de ambiente
4. Publique via Visual Studio ou Azure DevOps

### Docker
```dockerfile
# Exemplo de Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "QuiosqueBeach.dll"]
```

## 🔧 Troubleshooting

### Problemas Comuns:

1. **Erro de conexão com BD**
   - Verifique se o SQL Server está rodando
   - Confirme a string de conexão
   - Execute o script setup-database.sql

2. **SignalR não funciona**
   - Verifique se o firewall não está bloqueando
   - Confirme se JavaScript está habilitado
   - Check console do navegador para erros

3. **Produtos não aparecem**
   - Confirme se os dados foram inseridos
   - Verifique se produtos estão marcados como ativos
   - Check API endpoints no DevTools

4. **Login não funciona**
   - Verifique se o usuário admin foi criado
   - Confirme a chave JWT no appsettings.json
   - Check se email/senha estão corretos

## 📈 Próximas Funcionalidades

- [ ] Integração com sistemas de pagamento
- [ ] App mobile nativo
- [ ] Sistema de delivery
- [ ] Programa de fidelidade
- [ ] Analytics avançados
- [ ] Multi-idioma
- [ ] Integração com impressoras térmicas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## 🚀 Deploy em Produção (Render + Vercel)

### Configuração de Variáveis de Ambiente:

#### Backend (Render):
- DATABASE_URL: Connection string PostgreSQL
- GOOGLE_CLIENT_ID: Client ID do Google OAuth
- GOOGLE_CLIENT_SECRET: Client Secret do Google OAuth  
- JwtKey: Chave secreta JWT
- ASPNETCORE_ENVIRONMENT: Production

#### Frontend (Vercel):
- NEXT_PUBLIC_API_URL: URL da API backend

### URLs de Produção:
- Frontend: https://quiosque-beach.vercel.app
- Backend: https://quiosque-beach-api.onrender.com
- OAuth Callback: /signin-google

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação
- Check os logs da aplicação

---

**Desenvolvido para facilitar a gestão de quiosques e melhorar a experiência dos clientes! 🏖️**
