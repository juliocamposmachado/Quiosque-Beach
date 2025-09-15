# Mobile App - Sistema Quiosque de Praia

## Descrição
Aplicativo móvel híbrido para o sistema de quiosque de praia, desenvolvido com Capacitor para Android e iOS.

## Tecnologias Utilizadas
- Capacitor 6.x
- HTML5/CSS3/JavaScript
- Android SDK
- Gradle
- PWA (Progressive Web App)

## Estrutura do Projeto
```
Mobile/
├── android/                 # Projeto Android nativo
│   ├── app/                # Código da aplicação
│   ├── build.gradle        # Configurações Gradle
│   └── settings.gradle     # Settings do projeto
├── resources/              # Recursos do app
│   ├── icon.png           # Ícone principal
│   ├── icon-*.png         # Ícones em vários tamanhos
│   └── generate-icon.*    # Scripts para gerar ícones
├── capacitor.config.json   # Configuração do Capacitor
├── package.json           # Dependências Node.js
├── build-apk.bat         # Script para build do APK
└── README.md             # Este arquivo
```

## Pré-requisitos

### Para Desenvolvimento Android
- Node.js (versão 16 ou superior)
- Java Development Kit (JDK 17)
- Android Studio
- Android SDK (API 33 ou superior)
- Gradle

### Verificar Requisitos
```bash
# Verificar Node.js
node --version

# Verificar Java
java -version

# Verificar Android SDK
adb --version
```

## Configuração do Ambiente

### 1. Instalar Capacitor CLI
```bash
npm install -g @capacitor/cli
```

### 2. Instalar Dependências
```bash
cd Mobile/
npm install
```

### 3. Configurar Android Studio
1. Instale o Android Studio
2. Configure o Android SDK
3. Crie um AVD (Android Virtual Device) para testes
4. Configure as variáveis de ambiente:
   - ANDROID_HOME
   - JAVA_HOME

## Build e Execução

### 1. Preparar o Projeto
```bash
# Sincronizar com o projeto Android
npx cap sync android

# Ou usar o script fornecido
./build-apk.bat prepare
```

### 2. Executar em Modo de Desenvolvimento
```bash
# Abrir no Android Studio
npx cap open android

# Ou executar diretamente
npx cap run android
```

### 3. Gerar APK de Produção
```bash
# Usando o script automático
./build-apk.bat

# Ou manualmente
npx cap build android
cd android
./gradlew assembleRelease
```

O APK será gerado em: `android/app/build/outputs/apk/release/`

## Configurações Importantes

### Capacitor Configuration (capacitor.config.json)
```json
{
  "appId": "com.quiosquebeach.app",
  "appName": "Quiosque Beach",
  "webDir": "../Frontend/wwwroot",
  "bundledWebRuntime": false,
  "server": {
    "url": "https://sua-api.com"
  }
}
```

### Ícones e Recursos
- Ícone principal: `resources/icon.png` (1024x1024px)
- Ícones gerados automaticamente para diferentes densidades
- Para regerar ícones: execute `generate-icon.ps1`

## Funcionalidades Mobile

### Recursos Nativos Disponíveis
- **Camera**: Para tirar fotos dos produtos
- **Push Notifications**: Notificações de pedidos
- **Storage**: Armazenamento local de dados
- **Network**: Detecção de conectividade
- **Device Info**: Informações do dispositivo

### Plugins Capacitor Incluídos
- `@capacitor/android`
- `@capacitor/core`
- `@capacitor/camera` (se necessário)
- `@capacitor/push-notifications` (se necessário)

## Deploy e Distribuição

### Google Play Store
1. Gere um APK assinado
2. Configure a conta do Google Play Console
3. Faça upload do APK
4. Configure metadados e imagens
5. Publique o app

### Distribuição Interna (APK)
1. Use o script `build-apk.bat` para gerar o APK
2. Distribua o arquivo APK diretamente
3. Usuários precisam habilitar "Fontes desconhecidas"

## Scripts Disponíveis

### build-apk.bat
Script automatizado para:
- Preparar o projeto
- Sincronizar arquivos
- Gerar APK de release
- Copiar APK para diretório de saída

```bash
# Executar o script completo
./build-apk.bat

# Apenas preparar (sem build)
./build-apk.bat prepare
```

## Desenvolvimento

### Estrutura de Desenvolvimento
1. **Frontend**: Desenvolva no diretório `../Frontend/wwwroot/`
2. **Mobile**: Configure capacitor e recursos nativos aqui
3. **Sync**: Use `npx cap sync` para sincronizar mudanças

### Debug no Dispositivo
```bash
# Conectar dispositivo via USB
adb devices

# Executar no dispositivo
npx cap run android --target=device_id
```

### Debug no Emulador
```bash
# Listar emuladores
emulator -list-avds

# Executar no emulador
npx cap run android --target=emulator_name
```

## Troubleshooting

### Problemas Comuns
1. **Gradle build failed**: Verifique versões do JDK e Android SDK
2. **Capacitor sync failed**: Certifique-se que o webDir existe
3. **APK não instala**: Verifique assinatura e permissões
4. **App não conecta à API**: Verifique URL no capacitor.config.json

### Logs e Debug
```bash
# Ver logs do dispositivo
adb logcat

# Ver logs específicos do app
adb logcat | grep "QuiosqueBeach"
```

## Atualizações
Para atualizar o app:
1. Modifique o frontend
2. Execute `npx cap sync android`
3. Gere novo APK
4. Distribua a atualização

## Versioning
- Versão do app: definida em `android/app/build.gradle`
- Versão do código: incrementada automaticamente
- Seguir padrão semântico: MAJOR.MINOR.PATCH
