@echo off
echo ========================================
echo    QUIOSQUE BEACH - APK BUILD SCRIPT
echo ========================================
echo.

echo Verificando pre-requisitos...

REM Verificar se Java esta instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java nao encontrado!
    echo.
    echo Por favor, instale JDK 11+ em: https://adoptium.net/
    echo Depois configure JAVA_HOME no PATH
    pause
    exit /b 1
)

echo ✅ Java encontrado!

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
)

echo ✅ Dependencias OK!

REM Sincronizar assets
echo.
echo Sincronizando assets com projeto Android...
npx cap sync android

if %errorlevel% neq 0 (
    echo ❌ Erro na sincronizacao
    pause
    exit /b 1
)

echo ✅ Sincronizacao completa!

REM Build do APK
echo.
echo Gerando APK...
cd android
call gradlew.bat assembleDebug

if %errorlevel% neq 0 (
    echo ❌ Erro no build
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo ✅ APK GERADO COM SUCESSO!
echo ========================================
echo.
echo Local do APK:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Voce pode instalar este arquivo no seu celular!
echo.
pause
