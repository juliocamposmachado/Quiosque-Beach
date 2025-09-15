# 🌐 Configuração do Render - Quiosque Beach

## ℹ️ Informações do Deploy

### **API Backend (Render)**
- **Service ID:** `srv-d33khp3uibrs73anOp40`
- **URL da API:** `https://quiosque-beach-api.onrender.com`
- **GitHub Repo:** `juliocamposmachado/Quiosque-Beach`
- **Branch:** `main`
- **Status:** ✅ **Ativo**

### **Frontend (Vercel)**
- **URL:** `https://quiosque-beach.vercel.app`
- **GitHub Repo:** `juliocamposmachado/Quiosque-Beach`
- **Branch:** `main`
- **Status:** ✅ **Ativo**

---

## 🔗 Endpoints da API

### **Base URL:** `https://quiosque-beach-api.onrender.com/api`

#### **Autenticação:**
- `POST /auth/login` - Login tradicional
- `POST /auth/register` - Registro de usuário
- `GET /auth/google-login` - Login com Google
- `GET /signin-google` - Callback do Google OAuth

#### **Produtos:**
- `GET /produtos` - Listar todos os produtos
- `POST /produtos` - Criar novo produto (Admin)
- `PUT /produtos/{id}` - Atualizar produto (Admin)
- `DELETE /produtos/{id}` - Excluir produto (Admin)

#### **Pedidos:**
- `GET /pedidos` - Listar pedidos
- `POST /pedidos` - Criar novo pedido
- `PUT /pedidos/{id}` - Atualizar pedido
- `GET /pedidos/{id}` - Buscar pedido específico

#### **Categorias:**
- `GET /categorias` - Listar categorias
- `POST /categorias` - Criar categoria (Admin)

#### **SignalR:**
- `WS /pedidoHub` - Hub para atualizações em tempo real

---

## 🛠️ Configurações Atuais

### **JavaScript (Automático):**
```javascript
const API_BASE = window.location.hostname === 'localhost' 
  ? '/api' 
  : 'https://quiosque-beach-api.onrender.com/api';
```

### **SignalR (Automático):**
```javascript
const signalRUrl = window.location.hostname === 'localhost' 
  ? '/pedidoHub' 
  : 'https://quiosque-beach-api.onrender.com/pedidoHub';
```

---

## 🔧 Variáveis de Ambiente (Render)

### **Backend (API):**
- `DATABASE_URL` - Connection string do PostgreSQL
- `GOOGLE_CLIENT_ID` - ID do cliente Google OAuth
- `GOOGLE_CLIENT_SECRET` - Secret do cliente Google OAuth
- `JWT_KEY` - Chave para tokens JWT
- `PORT` - Porta do servidor (automática)

### **CORS Configurado:**
- `http://localhost:3000`
- `http://localhost:5000`
- `https://localhost:5001`
- `https://quiosque-beach.vercel.app`
- `https://quiosque-beach-api.onrender.com`

---

## 📊 Status dos Serviços

### **✅ Backend (Render)**
- **Região:** US East
- **Plano:** Free Tier
- **Auto Deploy:** Ativado
- **Health Check:** `/api/health`
- **Cold Start:** ~30 segundos (normal no free tier)

### **✅ Frontend (Vercel)**
- **Região:** Global CDN
- **Plano:** Hobby (Free)
- **Auto Deploy:** Ativado
- **Custom Domain:** Disponível

---

## 🚀 Deploy Automático

### **Workflow:**
1. **Push para GitHub** → Trigger automático
2. **Render Build** → API backend
3. **Vercel Build** → Frontend
4. **DNS Update** → Propagação automática

### **Build Commands:**
```bash
# Render (Backend)
dotnet build --configuration Release
dotnet publish --configuration Release --output ./publish

# Vercel (Frontend)
# Usa arquivos estáticos da pasta wwwroot/
```

---

## 🔍 Monitoramento

### **Health Checks:**
- **API:** `GET https://quiosque-beach-api.onrender.com/api/health`
- **Frontend:** `GET https://quiosque-beach.vercel.app`

### **Logs:**
- **Render:** Dashboard → Service → Logs
- **Vercel:** Dashboard → Project → Functions → Logs

---

## 🛡️ Segurança

### **HTTPS:** ✅ Ativado em ambos os serviços
### **CORS:** ✅ Configurado para domínios permitidos
### **JWT:** ✅ Tokens seguros com chave secreta
### **OAuth:** ✅ Google OAuth configurado

---

## 📱 Mobile (APK)

### **PWA:** ✅ Funcional
- Manifest configurado
- Service Workers (futuro)
- Instalável via navegador

### **APK Nativo:** ✅ Configurado (90%)
- Capacitor instalado
- Projeto Android gerado
- Precisa apenas do build final

---

**🎉 Todos os serviços estão operacionais e conectados!**
