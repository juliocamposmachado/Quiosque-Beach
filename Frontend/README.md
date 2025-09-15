# Frontend Web - Sistema Quiosque de Praia

## Descrição
Frontend responsivo para o sistema de quiosque de praia, incluindo interface para clientes e área administrativa.

## Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap (responsividade)
- SignalR Client (para atualizações em tempo real)

## Estrutura do Projeto
```
Frontend/wwwroot/
├── admin/               # Área administrativa
│   ├── index.html      # Dashboard admin
│   ├── admin.css       # Estilos admin
│   └── admin.js        # JavaScript admin
├── css/                # Estilos globais
│   ├── styles.css      # Estilos principais
│   └── login.css       # Estilos de login
├── js/                 # JavaScript
│   ├── app.js          # Aplicação principal
│   └── login.js        # Lógica de login
├── index.html          # Página inicial
├── cardapio.html       # Cardápio para clientes
├── login.html          # Página de login
├── inicio.html         # Dashboard cliente
├── manifest.json       # Manifest PWA
└── vercel.json         # Configuração Vercel
```

## Funcionalidades

### Versão Cliente (Público)
- **Cardápio Digital**: Visualização de produtos com imagens e preços
- **Carrinho de Compras**: Adicionar/remover itens do carrinho
- **Finalização de Pedidos**: Interface para fazer pedidos
- **Status do Pedido**: Acompanhamento em tempo real do pedido
- **Design Responsivo**: Otimizado para dispositivos móveis

### Versão Administrativa (Admin)
- **Dashboard de Pedidos**: Visualização de todos os pedidos em tempo real
- **Separação Cozinha/Bar**: Organização automática dos itens
- **Gerenciamento de Status**: Marcar pedidos como prontos/entregues
- **Controle de Estoque**: Interface para gerenciar produtos
- **Relatórios**: Visualização de vendas e estatísticas

## Configuração

### 1. Pré-requisitos
- Servidor web (IIS, Apache, Nginx) ou servidor de desenvolvimento
- Backend da API rodando (veja Backend/README.md)

### 2. Configuração da API
Edite o arquivo `js/app.js` e configure a URL da API:
```javascript
const API_BASE_URL = 'https://localhost:7000/api'; // URL do backend
```

### 3. Executar o Frontend

#### Opção 1: Servidor de Desenvolvimento Python
```bash
cd Frontend/wwwroot
python -m http.server 8000
```
Acesse: http://localhost:8000

#### Opção 2: Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Abra a pasta `Frontend/wwwroot`
3. Clique com botão direito em `index.html` → "Open with Live Server"

#### Opção 3: Node.js (http-server)
```bash
npm install -g http-server
cd Frontend/wwwroot
http-server -p 8000
```

### 4. Deploy

#### Vercel
```bash
# Na pasta Frontend/
vercel --prod
```

#### Netlify
1. Faça upload da pasta `wwwroot` para o Netlify
2. Configure redirects se necessário

#### GitHub Pages
1. Coloque os arquivos da pasta `wwwroot` na branch gh-pages
2. Configure GitHub Pages para usar a branch

## Páginas Principais

### Cliente
- **/** - Página inicial com apresentação
- **/cardapio.html** - Cardápio completo
- **/inicio.html** - Dashboard do cliente
- **/login.html** - Autenticação

### Administrativo
- **/admin/** - Dashboard administrativo
- Requer autenticação de administrador

## Desenvolvimento

### Estrutura de Arquivos CSS
- `styles.css` - Estilos globais e componentes
- `login.css` - Estilos específicos de autenticação
- `admin.css` - Estilos da área administrativa

### Estrutura de Arquivos JavaScript
- `app.js` - Lógica principal, carrinho, pedidos
- `login.js` - Autenticação e gerenciamento de sessão
- `admin.js` - Funcionalidades administrativas

## Recursos PWA
O frontend inclui recursos de Progressive Web App:
- Manifest para instalação no dispositivo
- Service Worker (se configurado)
- Design responsivo otimizado para mobile

## Integração com Backend
- Comunicação via API REST
- WebSocket/SignalR para atualizações em tempo real
- Autenticação via JWT tokens

## Troubleshooting
1. **Erro de CORS**: Certifique-se que o backend está configurado para aceitar requisições do frontend
2. **API não encontrada**: Verifique se a URL da API em `app.js` está correta
3. **SignalR não conecta**: Confirme se o backend está rodando e acessível
