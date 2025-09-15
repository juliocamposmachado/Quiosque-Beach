# Downloads

Esta pasta é destinada a hospedar o arquivo APK do aplicativo móvel.

## Como colocar o APK aqui:

1. Execute o build do aplicativo Android na pasta `Mobile/`:
```bash
cd Mobile/
npm run build:android
# ou 
./build-apk.bat
```

2. Copie o APK gerado para esta pasta:
```bash
cp Mobile/android/app/build/outputs/apk/release/app-release.apk Frontend/wwwroot/downloads/quiosque-beach.apk
```

3. O aplicativo estará disponível para download em:
`https://seu-dominio.com/downloads/quiosque-beach.apk`

## Configuração

Certifique-se de que o servidor web está configurado para servir arquivos `.apk` com o MIME type correto:
- `application/vnd.android.package-archive`
