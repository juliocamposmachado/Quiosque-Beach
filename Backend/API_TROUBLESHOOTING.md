# 🔧 Troubleshooting - API Quiosque Beach

## 🚨 Status Atual
- **Service ID:** `srv-d33khp3uibrs73anOp40`
- **URL:** `https://quiosque-beach-api.onrender.com`
- **Último Teste:** Erro 500 (Cold Start ou Configuração)

---

## 🔍 Possíveis Causas do Erro 500

### 1. **Cold Start (Mais Provável)**
- **Problema:** Render Free Tier "hiberna" após 15min de inatividade
- **Solução:** Aguarde 30-60 segundos, a API inicializará automaticamente
- **Sintoma:** Primeira requisição falha, próximas funcionam

### 2. **Variáveis de Ambiente**
- **Problema:** Variáveis não configuradas no Render
- **Verificar:**
  - `DATABASE_URL` (PostgreSQL)
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `JWT_KEY`

### 3. **Database Connection**
- **Problema:** Banco PostgreSQL não disponível ou connection string incorreta
- **Verificar:** Dashboard do Render → Database → Connection

### 4. **Build Error**
- **Problema:** Falha na compilação .NET
- **Verificar:** Render Dashboard → Logs → Build Logs

---

## ✅ Como Verificar

### **1. Health Check:**
```bash
# Aguarde alguns segundos e tente novamente
curl https://quiosque-beach-api.onrender.com/api/health
```

### **2. Produtos Endpoint:**
```bash
curl https://quiosque-beach-api.onrender.com/api/produtos
```

### **3. Via PowerShell:**
```powershell
# Teste básico
Invoke-WebRequest -Uri "https://quiosque-beach-api.onrender.com" -Method GET

# Teste com retry (para cold start)
for ($i=1; $i -le 3; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "https://quiosque-beach-api.onrender.com/api/health" -Method GET -ErrorAction Stop
        Write-Output "✅ API funcionando - Status: $($response.StatusCode)"
        break
    } catch {
        Write-Output "❌ Tentativa $i falhou - Aguardando cold start..."
        Start-Sleep -Seconds 20
    }
}
```

---

## 🔧 Soluções

### **Se for Cold Start:**
- ✅ **Normal** - Aguarde 30-60 segundos
- ✅ A partir da 2ª requisição funcionará normalmente
- ✅ Considere upgrade para plan pago se necessário

### **Se for Configuração:**
1. **Acesse Render Dashboard**
2. **Vá em Environment Variables**
3. **Adicione as variáveis necessárias:**
   ```
   DATABASE_URL=postgresql://...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   JWT_KEY=QuiosqueBeachSecretKey2024!@#$%
   ```

### **Se for Build Error:**
1. **Verifique os logs no Render**
2. **Confirme que o Program.cs está correto**
3. **Verifique as dependências no .csproj**

---

## 🎯 Endpoints Para Testar

### **Públicos (sem autenticação):**
- `GET /api/health` - Health check
- `GET /api/produtos` - Lista produtos
- `GET /api/categorias` - Lista categorias

### **Autenticação:**
- `GET /api/auth/google-login` - Inicia login Google
- `POST /api/auth/login` - Login tradicional
- `POST /api/auth/register` - Registro

### **Protegidos (precisam de token):**
- `POST /api/pedidos` - Criar pedido
- `GET /api/pedidos` - Listar pedidos

---

## 📊 Monitoramento Contínuo

### **Script de Monitoramento (PowerShell):**
```powershell
# Salvar como monitor-api.ps1
while ($true) {
    try {
        $response = Invoke-WebRequest -Uri "https://quiosque-beach-api.onrender.com/api/health" -Method GET -TimeoutSec 30
        Write-Output "$(Get-Date) - ✅ API OK - Status: $($response.StatusCode)"
    } catch {
        Write-Output "$(Get-Date) - ❌ API DOWN - Error: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds 300  # Verifica a cada 5 minutos
}
```

---

## 🚀 Próximos Passos

1. **Aguardar Cold Start** (30-60 segundos)
2. **Testar novamente** os endpoints
3. **Se ainda não funcionar:**
   - Verificar logs no Render Dashboard
   - Conferir variáveis de ambiente
   - Verificar connection string do database
4. **Considerar upgrade** para plan pago se necessário

---

## 📞 Suporte

### **Render Support:**
- Dashboard → Help → Support
- Documentação: https://render.com/docs

### **Logs Detalhados:**
- Render Dashboard → seu-service → Logs
- Filtrar por Error/Warning

---

**💡 Dica:** O Render Free Tier é perfeito para desenvolvimento, mas pode ter cold starts. Para produção, considere o plan pago para melhor performance.
