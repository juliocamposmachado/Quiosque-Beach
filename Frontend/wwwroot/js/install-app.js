// install-app.js - Lógica para instalação do aplicativo

let deferredPrompt;
let currentDevice = 'unknown';

// Inicializar página de instalação
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está autenticado
    if (!Auth.requireAuth()) {
        return;
    }
    
    // Carregar informações do usuário
    loadUserInfo();
    
    // Detectar dispositivo
    detectDevice();
    
    // Configurar PWA
    setupPWAInstall();
    
    // Marcar como visitou página de instalação
    markInstallPageVisited();
});

// Carregar informações do usuário
function loadUserInfo() {
    const user = Auth.getUser();
    if (user) {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');
        const defaultAvatar = document.getElementById('defaultAvatar');
        
        if (userName) userName.textContent = user.nome || user.name || 'Usuário';
        if (userEmail) userEmail.textContent = user.email || 'email@exemplo.com';
        
        // Se tem foto do Google
        if (user.foto || user.picture) {
            userAvatar.src = user.foto || user.picture;
            userAvatar.style.display = 'block';
            defaultAvatar.style.display = 'none';
        }
    }
}

// Detectar dispositivo do usuário
function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Detectar Android
    if (/android/i.test(userAgent)) {
        currentDevice = 'android';
        showInstallOption('androidInstall');
    }
    // Detectar iOS
    else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        currentDevice = 'ios';
        showInstallOption('iosInstall');
    }
    // Desktop
    else {
        currentDevice = 'desktop';
        showInstallOption('desktopInstall');
    }
    
    console.log('Dispositivo detectado:', currentDevice);
}

// Mostrar opção de instalação específica
function showInstallOption(optionId) {
    // Esconder todas as opções
    const options = document.querySelectorAll('.install-option');
    options.forEach(option => option.style.display = 'none');
    
    // Mostrar opção específica
    const targetOption = document.getElementById(optionId);
    if (targetOption) {
        targetOption.style.display = 'block';
    }
}

// Configurar instalação PWA
function setupPWAInstall() {
    // Listener para o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir que o mini-infobar apareça automaticamente
        e.preventDefault();
        // Salvar o evento para usar mais tarde
        deferredPrompt = e;
        
        // Mostrar indicador de que PWA está disponível
        const pwaButtons = document.querySelectorAll('[onclick*="installPWA"]');
        pwaButtons.forEach(btn => {
            btn.classList.add('pwa-available');
            btn.innerHTML = '<i class="fas fa-download"></i> Instalar Aplicativo (Disponível)';
        });
        
        console.log('PWA install prompt disponível');
    });
    
    // Listener para quando o app é instalado
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA foi instalado');
        showSuccessMessage('Aplicativo instalado com sucesso!');
        
        // Redirecionar após instalação
        setTimeout(() => {
            window.location.href = 'cardapio.html';
        }, 2000);
    });
}

// Baixar APK para Android
function downloadApk() {
    try {
        // URL do APK (você pode configurar isso)
        const apkUrl = getApkDownloadUrl();
        
        if (!apkUrl) {
            showErrorMessage('APK não disponível no momento. Tente instalar via navegador.');
            return;
        }
        
        // Criar link temporário para download
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = 'quiosque-beach.apk';
        link.target = '_blank';
        
        // Adicionar ao DOM e clicar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Mostrar instruções
        showInstructions('android');
        
        // Marcar download
        localStorage.setItem('apkDownloaded', 'true');
        
        showSuccessMessage('Download iniciado! Verifique suas notificações.');
        
    } catch (error) {
        console.error('Erro ao baixar APK:', error);
        showErrorMessage('Erro ao iniciar download. Tente novamente.');
    }
}

// Obter URL de download do APK
function getApkDownloadUrl() {
    // Aqui você pode configurar a URL do seu APK
    // Por exemplo, de um servidor ou GitHub releases
    
    // Exemplo de URL do GitHub releases:
    // return 'https://github.com/seu-usuario/seu-repo/releases/latest/download/quiosque-beach.apk';
    
    // Exemplo de servidor próprio:
    const baseUrl = window.location.origin;
    return `${baseUrl}/downloads/quiosque-beach.apk`;
    
    // Por enquanto, retornar null para mostrar opção de PWA
    // return null;
}

// Instalar PWA
async function installPWA() {
    if (!deferredPrompt) {
        // Se não há prompt disponível, tentar outras opções
        if (currentDevice === 'ios') {
            showInstructions('ios');
            return;
        } else {
            showErrorMessage('Instalação não disponível. Adicione esta página aos favoritos para acesso rápido.');
            return;
        }
    }
    
    try {
        // Mostrar o prompt de instalação
        const result = await deferredPrompt.prompt();
        
        console.log('PWA install prompt result:', result);
        
        // Aguardar a escolha do usuário
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
            console.log('Usuário aceitou instalar o PWA');
            showSuccessMessage('Instalando aplicativo...');
        } else {
            console.log('Usuário rejeitou instalar o PWA');
            showInfoMessage('Você pode instalar mais tarde quando quiser.');
        }
        
        // Limpar o prompt
        deferredPrompt = null;
        
    } catch (error) {
        console.error('Erro ao instalar PWA:', error);
        showErrorMessage('Erro durante a instalação. Tente novamente.');
    }
}

// Continuar sem instalar
function continuarSemInstalar() {
    // Marcar que o usuário escolheu não instalar
    localStorage.setItem('skipInstall', 'true');
    
    // Redirecionar para o cardápio
    window.location.href = 'cardapio.html';
}

// Mostrar instruções detalhadas
function showInstructions(device) {
    const modal = document.getElementById('instructionsModal');
    const content = document.getElementById(`${device}Instructions`);
    
    if (modal && content) {
        // Mostrar apenas o conteúdo relevante
        const allContents = document.querySelectorAll('.instructions-content');
        allContents.forEach(c => c.style.display = 'none');
        content.style.display = 'block';
        
        modal.style.display = 'block';
    }
}

// Fechar instruções
function closeInstructions() {
    const modal = document.getElementById('instructionsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Marcar que visitou a página de instalação
function markInstallPageVisited() {
    localStorage.setItem('installPageVisited', 'true');
    localStorage.setItem('installPageVisitDate', new Date().toISOString());
}

// Verificar se deve mostrar página de instalação
function shouldShowInstallPage() {
    const visited = localStorage.getItem('installPageVisited');
    const skipped = localStorage.getItem('skipInstall');
    const isInstalled = localStorage.getItem('appInstalled');
    
    // Não mostrar se já visitou, pulou ou já instalou
    return !visited && !skipped && !isInstalled;
}

// Mostrar mensagens
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showInfoMessage(message) {
    showMessage(message, 'info');
}

function showMessage(message, type) {
    // Remover mensagens existentes
    const existingMessages = document.querySelectorAll('.install-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Criar nova mensagem
    const messageEl = document.createElement('div');
    messageEl.className = `install-message install-message-${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${getIconForType(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getColorForType(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    
    // Adicionar ao body
    document.body.appendChild(messageEl);
    
    // Remover após 5 segundos
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

function getIconForType(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getColorForType(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };
    return colors[type] || '#6c757d';
}

// Adicionar estilos para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .install-message i {
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

// Fechar modal quando clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('instructionsModal');
    if (event.target === modal) {
        closeInstructions();
    }
}

// Utilitário para verificar se é PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

// Verificar se já está instalado como PWA
if (isPWA()) {
    localStorage.setItem('appInstalled', 'true');
}

// Exportar funções para uso global
window.InstallApp = {
    downloadApk,
    installPWA,
    continuarSemInstalar,
    showInstructions,
    closeInstructions,
    shouldShowInstallPage
};
