# 🏖️ Sistema Quiosque de Praia

Sistema completo para gerenciamento de quiosque de praia com interface para clientes e área administrativa.

## 📁 Estrutura do Projeto

O projeto foi organizado em três componentes principais:

```
QuiosqueBeach/
├── Backend/              # API em .NET 8
│   ├── Controllers/      # Controladores da API
│   ├── Models/          # Modelos de dados
│   ├── Data/            # Entity Framework
│   ├── Services/        # Lógica de negócio
│   └── README.md        # Documentação do Backend
├── Frontend/            # Interface Web
│   └── wwwroot/         # Arquivos estáticos
│       ├── admin/       # Área administrativa
│       ├── css/         # Estilos CSS
│       ├── js/          # JavaScript
│       └── README.md    # Documentação do Frontend
├── Mobile/              # Aplicativo Android/iOS
│   ├── android/         # Projeto Android
│   ├── resources/       # Ícones e recursos
│   └── README.md        # Documentação Mobile
└── README.md            # Este arquivo
```

## 🎯 Funcionalidades

### 👥 Versão Cliente
- **Cardápio Digital**: Visualização de produtos com imagens e preços
- **Carrinho de Compras**: Sistema completo de pedidos
- **Status em Tempo Real**: Acompanhamento dos pedidos via SignalR
- **Interface Responsiva**: Otimizada para dispositivos móveis

### 🔧 Versão Administrativa
- **Dashboard de Pedidos**: Gerenciamento em tempo real
- **Separação Automática**: Cozinha vs. Bar
- **Controle de Estoque**: Gerenciamento de produtos
- **Relatórios**: Análise de vendas e estatísticas
- **Gerenciamento de Status**: Controle completo dos pedidos

## 🛠️ Tecnologias

### Backend
- **Framework**: .NET 8 / ASP.NET Core
- **Banco de Dados**: SQL Server
- **ORM**: Entity Framework Core
- **Tempo Real**: SignalR
- **Autenticação**: JWT

### Frontend
- **Core**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Bootstrap
- **Tempo Real**: SignalR Client
- **PWA**: Manifest e Service Worker

### Mobile
- **Framework**: Capacitor 6.x
- **Plataformas**: Android, iOS
- **Base**: PWA híbrida

## 🚀 Como Executar

### 1. Backend (API)
```bash
cd Backend/
dotnet restore
dotnet run
```
**Porta**: https://localhost:7000

### 2. Frontend (Web)
```bash
cd Frontend/wwwroot/
python -m http.server 8000
# ou usar Live Server no VS Code
```
**Porta**: http://localhost:8000

### 3. Mobile (Android)
```bash
cd Mobile/
npm install
npx cap sync android
npx cap open android
```

## 📋 Pré-requisitos

### Para Backend
- .NET 8 SDK
- SQL Server
- Visual Studio ou VS Code

### Para Frontend
- Servidor web qualquer
- Navegador moderno

### Para Mobile
- Node.js 16+
- Android Studio
- JDK 17
- Android SDK

## 🗃️ Banco de Dados

Execute os scripts SQL na seguinte ordem:
1. `Backend/banco-completo.sql` - Criação das tabelas
2. `Backend/setup-database.sql` - Dados iniciais

## 🔧 Configuração

### Backend
Configure a connection string em `Backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=QuiosqueBeach;Trusted_Connection=true;"
  }
}
```

### Frontend
Configure a URL da API em `Frontend/wwwroot/js/app.js`:
```javascript
const API_BASE_URL = 'https://localhost:7000/api';
```

### Mobile
Configure em `Mobile/capacitor.config.json`:
```json
{
  "webDir": "../Frontend/wwwroot",
  "server": {
    "url": "https://sua-api-url.com"
  }
}
```

## 🚀 Deploy

### Backend
- Azure App Service
- Render
- Docker
- IIS

### Frontend
- Vercel
- Netlify
- GitHub Pages
- Qualquer servidor web

### Mobile
- Google Play Store
- App Store (iOS)
- Distribuição direta (APK)

## 📚 Documentação Detalhada

Cada componente possui documentação específica:

- **[Backend/README.md](Backend/README.md)** - API, endpoints, configuração
- **[Frontend/README.md](Frontend/README.md)** - Interface web, páginas, deploy
- **[Mobile/README.md](Mobile/README.md)** - App móvel, build, distribuição

## 🔑 Credenciais Padrão

### Administrador
- **Email**: admin@quiosque.com
- **Senha**: Admin123!

### Cliente Teste  
- **Email**: cliente@teste.com
- **Senha**: Teste123!

## 🆘 Troubleshooting

### Problemas Comuns
1. **CORS**: Configure o backend para aceitar requisições do frontend
2. **Banco não conecta**: Verifique a connection string
3. **SignalR não funciona**: Confirme se o backend está acessível
4. **Mobile não instala**: Verifique as permissões de instalação

### Suporte
- Consulte os READMEs específicos de cada componente
- Verifique os logs de cada aplicação
- Confirme se todas as dependências estão instaladas

## 📝 Próximos Passos

1. **Configurar cada componente** seguindo os READMEs específicos
2. **Testar a integração** entre frontend e backend
3. **Personalizar o design** conforme necessidades
4. **Configurar o deploy** em produção
5. **Testar o aplicativo mobile** em dispositivos reais

---

**Desenvolvido para atender as necessidades de quiosques de praia modernos** 🌊
