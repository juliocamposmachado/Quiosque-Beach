// Configurações da API
const API_BASE = window.location.hostname === 'localhost' ? '/api' : 'https://quiosque-beach-api.onrender.com/api';

// Inicializar página de login
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já está logado
    const token = localStorage.getItem('token');
    if (token) {
        // Redirecionar para a página principal se já estiver logado
        window.location.href = '/';
        return;
    }

    // Verificar se há parâmetros de retorno do Google OAuth
    verificarRetornoGoogle();

    // Configurar event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registroForm').addEventListener('submit', handleRegistro);
});

// Verificar retorno do Google OAuth
function verificarRetornoGoogle() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');

    if (token && user) {
        try {
            const userData = JSON.parse(decodeURIComponent(user));
            
            // Salvar token e dados do usuário
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Mostrar mensagem de sucesso
            mostrarAlerta('Login realizado com sucesso!', 'success');
            
            // Redirecionar para a página principal após 2 segundos
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao processar dados do Google:', error);
            mostrarAlerta('Erro ao processar login do Google', 'error');
        }
    }
}

// Login tradicional
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!email || !senha) {
        mostrarAlerta('Por favor, preencha todos os campos', 'error');
        return;
    }

    // Mostrar estado de loading
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // Salvar token e dados do usuário
            localStorage.setItem('token', data.Token);
            localStorage.setItem('user', JSON.stringify(data.Usuario));
            
            mostrarAlerta('Login realizado com sucesso!', 'success');
            
            // Redirecionar para a página principal
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
            
        } else {
            mostrarAlerta(data.message || 'Erro ao fazer login', 'error');
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        mostrarAlerta('Erro de conexão. Tente novamente.', 'error');
    } finally {
        // Remover estado de loading
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
}

// Login com Google
function loginComGoogle() {
    // Redirecionar para o endpoint de autenticação Google
    const returnUrl = window.location.origin;
    window.location.href = `${API_BASE}/auth/google-login?returnUrl=${encodeURIComponent(returnUrl)}`;
}

// Registro de novo usuário
async function handleRegistro(event) {
    event.preventDefault();
    
    const nome = document.getElementById('regNome').value;
    const email = document.getElementById('regEmail').value;
    const senha = document.getElementById('regSenha').value;
    const perfil = document.getElementById('regPerfil').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!nome || !email || !senha) {
        mostrarAlerta('Por favor, preencha todos os campos', 'error');
        return;
    }

    if (senha.length < 6) {
        mostrarAlerta('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }

    // Mostrar estado de loading
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha, perfil })
        });

        const data = await response.json();

        if (response.ok) {
            // Salvar token e dados do usuário
            localStorage.setItem('token', data.Token);
            localStorage.setItem('user', JSON.stringify(data.Usuario));
            
            mostrarAlerta('Conta criada com sucesso!', 'success');
            
            // Fechar modal e redirecionar
            fecharRegistro();
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
            
        } else {
            mostrarAlerta(data.message || 'Erro ao criar conta', 'error');
        }
        
    } catch (error) {
        console.error('Erro no registro:', error);
        mostrarAlerta('Erro de conexão. Tente novamente.', 'error');
    } finally {
        // Remover estado de loading
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
}

// Mostrar modal de registro
function mostrarRegistro() {
    document.getElementById('registroModal').style.display = 'block';
    // Limpar campos
    document.getElementById('registroForm').reset();
}

// Fechar modal de registro
function fecharRegistro() {
    document.getElementById('registroModal').style.display = 'none';
}

// Fechar modal quando clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('registroModal');
    if (event.target === modal) {
        fecharRegistro();
    }
}

// Mostrar alertas
function mostrarAlerta(mensagem, tipo = 'error') {
    // Remover alertas existentes
    const alertasExistentes = document.querySelectorAll('.alert');
    alertasExistentes.forEach(alerta => alerta.remove());
    
    // Criar novo alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensagem;
    
    // Adicionar no topo do formulário
    const loginForm = document.querySelector('.login-form');
    loginForm.insertBefore(alerta, loginForm.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

// Utilities para autenticação (podem ser usadas em outras páginas)
const Auth = {
    // Verificar se está logado
    isLoggedIn() {
        const token = localStorage.getItem('token');
        return !!token;
    },
    
    // Obter dados do usuário
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Obter token
    getToken() {
        return localStorage.getItem('token');
    },
    
    // Fazer logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    },
    
    // Redirecionar para login se não estiver autenticado
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }
};

// Disponibilizar Auth globalmente
window.Auth = Auth;
