// Estado da aplicação admin
let currentUser = null;
let authToken = null;
let connection = null;
let currentSection = 'dashboard';

// URLs da API
const API_BASE = '/api';

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuth();
});

// Event Listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', login);
    
    // Menu navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            navigateToSection(section);
        });
    });
    
    // Filters
    document.getElementById('statusFilter')?.addEventListener('change', loadOrders);
    document.getElementById('dateFilter')?.addEventListener('change', loadOrders);
    
    // Product form
    document.getElementById('productForm')?.addEventListener('submit', saveProduct);
}

// Auth functions
async function login(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha: password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = data.usuario;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showAdminPanel();
            initializeSignalR();
            loadDashboard();
        } else {
            const error = await response.json();
            alert(error.message || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao conectar com o servidor');
    }
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showAdminPanel();
        initializeSignalR();
        loadDashboard();
    }
}

function showAdminPanel() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('adminContent').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.nome;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    location.reload();
}

// SignalR
function initializeSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("/pedidoHub")
        .build();

    connection.start().then(function () {
        console.log('SignalR conectado (Admin)');
        
        connection.on("NovoPedido", function (pedido) {
            showNotification('Novo pedido recebido!');
            updateNotificationCount();
            if (currentSection === 'dashboard') {
                loadDashboard();
            }
            loadOrders();
            loadKitchenOrders();
            loadBarOrders();
        });
        
        connection.on("StatusPedidoAtualizado", function (data) {
            updateOrderStatus(data.pedidoId, data.status);
        });
    }).catch(function (err) {
        console.error('Erro ao conectar SignalR:', err);
    });
}

// Navigation
function navigateToSection(section) {
    // Update menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        pedidos: 'Todos os Pedidos',
        cozinha: 'Cozinha',
        bar: 'Bar',
        produtos: 'Produtos',
        relatorios: 'Relatórios'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    currentSection = section;
    
    // Load section data
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'pedidos':
            loadOrders();
            break;
        case 'cozinha':
            loadKitchenOrders();
            break;
        case 'bar':
            loadBarOrders();
            break;
        case 'produtos':
            loadProducts();
            break;
        case 'relatorios':
            loadReports();
            break;
    }
}

// API functions
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        }
    };
    
    return fetch(url, { ...defaultOptions, ...options });
}

// Dashboard
async function loadDashboard() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const pedidosResponse = await apiRequest(`${API_BASE}/pedidos?data=${hoje}`);
        const pedidos = await pedidosResponse.json();
        
        updateDashboardStats(pedidos);
        updateRecentOrders(pedidos.slice(0, 10));
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

function updateDashboardStats(pedidos) {
    const total = pedidos.length;
    const pendentes = pedidos.filter(p => p.status < 3).length;
    const entregues = pedidos.filter(p => p.status === 4).length;
    const vendaHoje = pedidos.reduce((sum, p) => sum + p.valorTotal, 0);
    
    document.getElementById('totalPedidos').textContent = total;
    document.getElementById('pedidosPendentes').textContent = pendentes;
    document.getElementById('pedidosEntregues').textContent = entregues;
    document.getElementById('vendaHoje').textContent = `R$ ${vendaHoje.toFixed(2).replace('.', ',')}`;
    
    // Update notification count
    document.getElementById('notificationCount').textContent = pendentes;
}

function updateRecentOrders(pedidos) {
    const container = document.getElementById('recentOrdersList');
    
    if (pedidos.length === 0) {
        container.innerHTML = '<p>Nenhum pedido recente</p>';
        return;
    }
    
    container.innerHTML = pedidos.map(pedido => `
        <div class="recent-order">
            <div class="order-info">
                <strong>Pedido #${pedido.id}</strong> - Mesa ${pedido.numeroMesa}
                <br>
                <small>${formatDateTime(pedido.dataCriacao)} - ${getStatusText(pedido.status)}</small>
            </div>
            <div class="order-value">
                R$ ${pedido.valorTotal.toFixed(2).replace('.', ',')}
            </div>
        </div>
    `).join('');
}

// Orders
async function loadOrders() {
    try {
        const statusFilter = document.getElementById('statusFilter')?.value;
        const dateFilter = document.getElementById('dateFilter')?.value;
        
        let url = `${API_BASE}/pedidos`;
        const params = new URLSearchParams();
        
        if (statusFilter) params.append('status', statusFilter);
        if (dateFilter) params.append('data', dateFilter);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await apiRequest(url);
        const pedidos = await response.json();
        
        updateOrdersTable(pedidos);
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
    }
}

function updateOrdersTable(pedidos) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum pedido encontrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = pedidos.map(pedido => `
        <tr>
            <td>${pedido.id}</td>
            <td>${pedido.numeroMesa}</td>
            <td>${pedido.nomeCliente || '-'}</td>
            <td>R$ ${pedido.valorTotal.toFixed(2).replace('.', ',')}</td>
            <td><span class="status-badge status-${getStatusClass(pedido.status)}">${getStatusText(pedido.status)}</span></td>
            <td>${formatDateTime(pedido.dataCriacao)}</td>
            <td>
                <button class="btn-sm btn-primary" onclick="viewOrder(${pedido.id})">Ver</button>
                ${pedido.status < 4 ? `
                    <button class="btn-sm btn-success" onclick="updateOrderStatus(${pedido.id}, ${pedido.status + 1})">
                        ${getNextStatusText(pedido.status)}
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Kitchen Orders
async function loadKitchenOrders() {
    try {
        const response = await apiRequest(`${API_BASE}/pedidos/cozinha`);
        const pedidos = await response.json();
        
        updateKitchenOrders(pedidos);
    } catch (error) {
        console.error('Erro ao carregar pedidos da cozinha:', error);
    }
}

function updateKitchenOrders(pedidos) {
    const container = document.getElementById('kitchenOrders');
    
    if (pedidos.length === 0) {
        container.innerHTML = '<p>Nenhum pedido na cozinha</p>';
        return;
    }
    
    container.innerHTML = pedidos.map(pedido => `
        <div class="order-card ${isOrderUrgent(pedido.dataCriacao) ? 'urgent' : ''}">
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">Pedido #${pedido.id}</div>
                    <div class="order-meta">Mesa ${pedido.numeroMesa} ${pedido.nomeCliente ? '- ' + pedido.nomeCliente : ''}</div>
                </div>
                <div class="order-time">${getTimeAgo(pedido.dataCriacao)}</div>
            </div>
            
            <div class="order-items">
                ${pedido.itens.map(item => `
                    <div class="order-item">
                        <span class="item-name">${item.nome}</span>
                        <span class="item-qty">${item.quantidade}</span>
                    </div>
                `).join('')}
            </div>
            
            ${pedido.observacoes ? `<div class="order-notes"><strong>Obs:</strong> ${pedido.observacoes}</div>` : ''}
            
            <div class="order-actions">
                <button class="btn-sm btn-success" onclick="updateOrderStatus(${pedido.id}, ${getNextStatus(pedido.status)})">
                    ${getNextStatusText(pedido.status)}
                </button>
            </div>
        </div>
    `).join('');
}

// Bar Orders  
async function loadBarOrders() {
    try {
        const response = await apiRequest(`${API_BASE}/pedidos/bar`);
        const pedidos = await response.json();
        
        updateBarOrders(pedidos);
    } catch (error) {
        console.error('Erro ao carregar pedidos do bar:', error);
    }
}

function updateBarOrders(pedidos) {
    const container = document.getElementById('barOrders');
    
    if (pedidos.length === 0) {
        container.innerHTML = '<p>Nenhum pedido no bar</p>';
        return;
    }
    
    container.innerHTML = pedidos.map(pedido => `
        <div class="order-card ${isOrderUrgent(pedido.dataCriacao) ? 'urgent' : ''}">
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">Pedido #${pedido.id}</div>
                    <div class="order-meta">Mesa ${pedido.numeroMesa} ${pedido.nomeCliente ? '- ' + pedido.nomeCliente : ''}</div>
                </div>
                <div class="order-time">${getTimeAgo(pedido.dataCriacao)}</div>
            </div>
            
            <div class="order-items">
                ${pedido.itens.map(item => `
                    <div class="order-item">
                        <span class="item-name">${item.nome}</span>
                        <span class="item-qty">${item.quantidade}</span>
                    </div>
                `).join('')}
            </div>
            
            ${pedido.observacoes ? `<div class="order-notes"><strong>Obs:</strong> ${pedido.observacoes}</div>` : ''}
            
            <div class="order-actions">
                <button class="btn-sm btn-success" onclick="updateOrderStatus(${pedido.id}, ${getNextStatus(pedido.status)})">
                    ${getNextStatusText(pedido.status)}
                </button>
            </div>
        </div>
    `).join('');
}

// Products
async function loadProducts() {
    try {
        const response = await apiRequest(`${API_BASE}/produtos`);
        const produtos = await response.json();
        
        updateProductsGrid(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function updateProductsGrid(produtos) {
    const container = document.getElementById('productsGrid');
    
    if (produtos.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado</p>';
        return;
    }
    
    container.innerHTML = produtos.map(produto => `
        <div class="product-card">
            <div class="product-image">
                ${produto.imagemUrl ? 
                    `<img src="${produto.imagemUrl}" alt="${produto.nome}" style="width:100%;height:100%;object-fit:cover;">` :
                    getProductIcon(produto.categoria.tipo)
                }
            </div>
            <div class="product-info">
                <div class="product-name">${produto.nome}</div>
                <div class="product-description">${produto.descricao || ''}</div>
                <div class="product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                <div class="product-stock">Estoque: ${produto.estoqueAtual}</div>
                <div class="product-actions">
                    <button class="btn-sm btn-primary" onclick="editProduct(${produto.id})">Editar</button>
                    <button class="btn-sm btn-danger" onclick="deleteProduct(${produto.id})">Excluir</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Order functions
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await apiRequest(`${API_BASE}/pedidos/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify(newStatus)
        });
        
        if (response.ok) {
            // Refresh current view
            switch(currentSection) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'pedidos':
                    loadOrders();
                    break;
                case 'cozinha':
                    loadKitchenOrders();
                    break;
                case 'bar':
                    loadBarOrders();
                    break;
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
    }
}

async function viewOrder(orderId) {
    try {
        const response = await apiRequest(`${API_BASE}/pedidos/${orderId}`);
        const pedido = await response.json();
        
        document.getElementById('modalOrderId').textContent = pedido.id;
        
        const orderDetails = `
            <div class="order-details">
                <div class="detail-group">
                    <h4>Informações do Pedido</h4>
                    <p><strong>Mesa:</strong> ${pedido.numeroMesa}</p>
                    <p><strong>Cliente:</strong> ${pedido.nomeCliente || 'Não informado'}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${getStatusClass(pedido.status)}">${getStatusText(pedido.status)}</span></p>
                    <p><strong>Data:</strong> ${formatDateTime(pedido.dataCriacao)}</p>
                    <p><strong>Total:</strong> R$ ${pedido.valorTotal.toFixed(2).replace('.', ',')}</p>
                    ${pedido.observacoes ? `<p><strong>Observações:</strong> ${pedido.observacoes}</p>` : ''}
                </div>
                
                <div class="detail-group">
                    <h4>Itens do Pedido</h4>
                    <div class="order-items-detail">
                        ${pedido.itens.map(item => `
                            <div class="item-detail">
                                <span class="item-name">${item.produto.nome}</span>
                                <span class="item-qty">${item.quantidade}x</span>
                                <span class="item-price">R$ ${item.subtotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('orderDetails').innerHTML = orderDetails;
        document.getElementById('orderModal').classList.add('active');
    } catch (error) {
        console.error('Erro ao carregar pedido:', error);
    }
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// Product functions
function showProductModal(productId = null) {
    if (productId) {
        // Edit mode - load product data
        // Implementation would load and populate form
        document.getElementById('productModalTitle').textContent = 'Editar Produto';
    } else {
        // Add mode - clear form
        document.getElementById('productForm').reset();
        document.getElementById('productModalTitle').textContent = 'Adicionar Produto';
    }
    
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

async function saveProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = {
        nome: formData.get('productName'),
        descricao: formData.get('productDescription'),
        preco: parseFloat(formData.get('productPrice')),
        categoriaId: parseInt(formData.get('productCategory')),
        estoqueAtual: parseInt(formData.get('productStock')) || 0
    };
    
    try {
        const response = await apiRequest(`${API_BASE}/produtos`, {
            method: 'POST',
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            closeProductModal();
            loadProducts();
        }
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
    }
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        0: 'Pendente',
        1: 'Confirmado', 
        2: 'Em Preparo',
        3: 'Pronto',
        4: 'Entregue',
        5: 'Cancelado'
    };
    return statusMap[status] || 'Desconhecido';
}

function getStatusClass(status) {
    const classMap = {
        0: 'pendente',
        1: 'confirmado',
        2: 'preparo', 
        3: 'pronto',
        4: 'entregue',
        5: 'cancelado'
    };
    return classMap[status] || 'pendente';
}

function getNextStatus(status) {
    return status < 4 ? status + 1 : status;
}

function getNextStatusText(status) {
    const nextTexts = {
        0: 'Confirmar',
        1: 'Iniciar Preparo',
        2: 'Marcar Pronto',
        3: 'Entregar'
    };
    return nextTexts[status] || '';
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
        return `${diffMinutes}min`;
    } else {
        const diffHours = Math.floor(diffMinutes / 60);
        return `${diffHours}h ${diffMinutes % 60}min`;
    }
}

function isOrderUrgent(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    return diffMinutes > 30;
}

function getProductIcon(tipo) {
    return tipo === 'Bebida' ? 
        '<i class="fas fa-glass-cheers"></i>' : 
        '<i class="fas fa-hamburger"></i>';
}

function showNotification(message) {
    // Simple notification - could be enhanced with toast library
    alert(message);
}

function updateNotificationCount() {
    // Update notification count based on pending orders
    loadDashboard();
}

// Load functions stubs
function loadReports() {
    console.log('Loading reports...');
}

function generateSalesReport() {
    console.log('Generating sales report...');
}
