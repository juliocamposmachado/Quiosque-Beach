// Estado da aplicação
let produtos = [];
let cart = [];
let mesaInfo = {};
let pedidoAtual = null;
let connection = null;

// URLs da API
const API_BASE = '/api';

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarSignalR();
});

// SignalR
function inicializarSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("/pedidoHub")
        .build();

    connection.start().then(function () {
        console.log('SignalR conectado');
        
        // Escutar atualizações de status
        connection.on("StatusPedidoAtualizado", function (data) {
            if (pedidoAtual && pedidoAtual.id === data.pedidoId) {
                atualizarStatusPedido(data.status);
            }
        });
    }).catch(function (err) {
        console.error('Erro ao conectar SignalR:', err);
    });
}

// Mesa
function confirmarMesa() {
    const numeroMesa = document.getElementById('numeroMesa').value.trim();
    const nomeCliente = document.getElementById('nomeCliente').value.trim();
    
    if (!numeroMesa) {
        alert('Por favor, informe o número da mesa');
        return;
    }
    
    mesaInfo = {
        numero: numeroMesa,
        nome: nomeCliente || null
    };
    
    // Esconder formulário e mostrar cardápio
    document.getElementById('mesaForm').style.display = 'none';
    document.getElementById('cardapio').style.display = 'block';
    
    carregarProdutos();
}

// Carregar produtos
async function carregarProdutos() {
    try {
        const response = await fetch(`${API_BASE}/produtos`);
        produtos = await response.json();
        
        exibirProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        document.getElementById('produtosGrid').innerHTML = 
            '<div class="loading">Erro ao carregar produtos</div>';
    }
}

// Exibir produtos
function exibirProdutos(produtosList) {
    const grid = document.getElementById('produtosGrid');
    
    if (produtosList.length === 0) {
        grid.innerHTML = '<div class="loading">Nenhum produto encontrado</div>';
        return;
    }
    
    grid.innerHTML = produtosList.map(produto => `
        <div class="produto-card">
            <div class="produto-img">
                ${produto.imagemUrl ? 
                    `<img src="${produto.imagemUrl}" alt="${produto.nome}" style="width:100%;height:100%;object-fit:cover;">` :
                    getIconeProduto(produto.categoria.tipo)
                }
            </div>
            <div class="produto-info">
                <div class="produto-nome">${produto.nome}</div>
                <div class="produto-descricao">${produto.descricao || ''}</div>
                <div class="produto-footer">
                    <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                    <button class="add-btn" onclick="adicionarAoCarrinho(${produto.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Ícone do produto
function getIconeProduto(tipo) {
    return tipo === 'Bebida' ? 
        '<i class="fas fa-glass-cheers"></i>' : 
        '<i class="fas fa-hamburger"></i>';
}

// Filtrar produtos
function filtrarProdutos(filtro) {
    // Atualizar botões ativos
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let produtosFiltrados = produtos;
    
    if (filtro !== 'todos') {
        produtosFiltrados = produtos.filter(p => p.categoria.tipo === filtro);
    }
    
    exibirProdutos(produtosFiltrados);
}

// Carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;
    
    const itemExistente = cart.find(item => item.produto.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        cart.push({
            produto: produto,
            quantidade: 1
        });
    }
    
    atualizarCarrinho();
    
    // Feedback visual
    const btn = event.target.closest('.add-btn');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 200);
}

function atualizarCarrinho() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Atualizar contador
    const totalItens = cart.reduce((sum, item) => sum + item.quantidade, 0);
    cartCount.textContent = totalItens;
    
    // Atualizar itens
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Carrinho vazio</div>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-nome">${item.produto.nome}</div>
                    <div class="item-preco">R$ ${item.produto.preco.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="alterarQuantidade(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-display">${item.quantidade}</span>
                    <button class="qty-btn" onclick="alterarQuantidade(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Atualizar total
    const total = cart.reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
}

function alterarQuantidade(index, delta) {
    const item = cart[index];
    item.quantidade += delta;
    
    if (item.quantidade <= 0) {
        cart.splice(index, 1);
    }
    
    atualizarCarrinho();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
}

// Finalizar pedido
async function finalizarPedido() {
    if (cart.length === 0) {
        alert('Adicione itens ao carrinho primeiro');
        return;
    }
    
    const pedido = {
        numeroMesa: mesaInfo.numero,
        nomeCliente: mesaInfo.nome,
        observacoes: null,
        itens: cart.map(item => ({
            produtoId: item.produto.id,
            quantidade: item.quantidade,
            observacoes: null
        }))
    };
    
    try {
        const response = await fetch(`${API_BASE}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });
        
        if (response.ok) {
            const pedidoCriado = await response.json();
            pedidoAtual = pedidoCriado;
            
            // Limpar carrinho
            cart = [];
            atualizarCarrinho();
            toggleCart();
            
            // Mostrar modal de status
            mostrarStatusPedido(pedidoCriado);
            
            alert('Pedido realizado com sucesso!');
        } else {
            throw new Error('Erro ao criar pedido');
        }
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        alert('Erro ao finalizar pedido. Tente novamente.');
    }
}

// Modal de status
function mostrarStatusPedido(pedido) {
    document.getElementById('pedidoNumero').textContent = pedido.id;
    document.getElementById('pedidoMesa').textContent = pedido.numeroMesa;
    document.getElementById('pedidoStatus').textContent = getStatusTexto(pedido.status);
    
    atualizarTimelinePedido(pedido.status);
    
    document.getElementById('statusModal').classList.add('active');
}

function atualizarStatusPedido(status) {
    document.getElementById('pedidoStatus').textContent = getStatusTexto(status);
    atualizarTimelinePedido(status);
}

function atualizarTimelinePedido(status) {
    const statusOrder = ['Pendente', 'Confirmado', 'EmPreparo', 'Pronto', 'Entregue'];
    const currentIndex = statusOrder.indexOf(getStatusEnum(status));
    
    statusOrder.forEach((s, index) => {
        const element = document.getElementById(`timeline-${s.toLowerCase()}`);
        if (element) {
            element.classList.remove('active', 'completed');
            
            if (index < currentIndex) {
                element.classList.add('completed');
            } else if (index === currentIndex) {
                element.classList.add('active');
            }
        }
    });
}

function getStatusTexto(status) {
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

function getStatusEnum(status) {
    const enumMap = {
        0: 'Pendente',
        1: 'Confirmado',
        2: 'EmPreparo',
        3: 'Pronto',
        4: 'Entregue',
        5: 'Cancelado'
    };
    return enumMap[status] || 'Pendente';
}

function fecharModal() {
    document.getElementById('statusModal').classList.remove('active');
}

// Fechar modal clicando fora
document.getElementById('statusModal').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModal();
    }
});
