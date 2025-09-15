-- ===============================================
-- SCRIPT COMPLETO - QUIOSQUE BEACH DATABASE
-- ===============================================

-- 1. REMOVER BANCO SE EXISTIR
USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'QuiosqueBeachDB')
BEGIN
    ALTER DATABASE QuiosqueBeachDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE QuiosqueBeachDB;
    PRINT '✓ Banco antigo removido';
END
GO

-- 2. CRIAR NOVO BANCO
CREATE DATABASE QuiosqueBeachDB;
GO

PRINT '✓ Novo banco criado';

-- 3. USAR O BANCO
USE QuiosqueBeachDB;
GO

-- 4. CRIAR TABELA CATEGORIAS
CREATE TABLE Categorias (
    Id int IDENTITY(1,1) PRIMARY KEY,
    Nome nvarchar(100) NOT NULL,
    Descricao nvarchar(500),
    Tipo nvarchar(50) NOT NULL,
    Ativo bit NOT NULL DEFAULT 1
);

PRINT '✓ Tabela Categorias criada';

-- 5. CRIAR TABELA PRODUTOS
CREATE TABLE Produtos (
    Id int IDENTITY(1,1) PRIMARY KEY,
    Nome nvarchar(100) NOT NULL,
    Descricao nvarchar(500),
    Preco decimal(10,2) NOT NULL,
    CategoriaId int NOT NULL,
    ImagemUrl nvarchar(255),
    EstoqueAtual int DEFAULT 0,
    EstoqueMinimo int DEFAULT 0,
    Ativo bit NOT NULL DEFAULT 1,
    DataCriacao datetime2 DEFAULT GETDATE(),
    DataAtualizacao datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Produtos_Categorias FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id)
);

PRINT '✓ Tabela Produtos criada';

-- 6. CRIAR TABELA USUARIOS
CREATE TABLE Usuarios (
    Id int IDENTITY(1,1) PRIMARY KEY,
    Nome nvarchar(100) NOT NULL,
    Email nvarchar(150) NOT NULL UNIQUE,
    SenhaHash nvarchar(255) NOT NULL,
    Perfil nvarchar(50) NOT NULL,
    Ativo bit NOT NULL DEFAULT 1,
    DataCriacao datetime2 DEFAULT GETDATE()
);

PRINT '✓ Tabela Usuarios criada';

-- 7. CRIAR TABELA PEDIDOS
CREATE TABLE Pedidos (
    Id int IDENTITY(1,1) PRIMARY KEY,
    NumeroMesa int NOT NULL,
    NomeCliente nvarchar(100),
    ValorTotal decimal(10,2) NOT NULL DEFAULT 0,
    Status nvarchar(50) NOT NULL DEFAULT 'Pendente',
    Observacoes nvarchar(500),
    DataPedido datetime2 DEFAULT GETDATE(),
    DataAtualizacao datetime2 DEFAULT GETDATE()
);

PRINT '✓ Tabela Pedidos criada';

-- 8. CRIAR TABELA ITENS PEDIDO
CREATE TABLE ItensPedido (
    Id int IDENTITY(1,1) PRIMARY KEY,
    PedidoId int NOT NULL,
    ProdutoId int NOT NULL,
    Quantidade int NOT NULL,
    PrecoUnitario decimal(10,2) NOT NULL,
    Subtotal decimal(10,2) NOT NULL,
    Observacoes nvarchar(500),
    CONSTRAINT FK_ItensPedido_Pedidos FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id) ON DELETE CASCADE,
    CONSTRAINT FK_ItensPedido_Produtos FOREIGN KEY (ProdutoId) REFERENCES Produtos(Id)
);

PRINT '✓ Tabela ItensPedido criada';

-- 9. INSERIR CATEGORIAS
INSERT INTO Categorias (Nome, Descricao, Tipo) VALUES
('Bebidas Geladas', 'Sucos, refrigerantes e águas geladas', 'Bebida'),
('Bebidas Quentes', 'Cafés, chás e chocolate quente', 'Bebida'),
('Lanches', 'Sanduíches, hambúrguers e salgados', 'Comida'),
('Sobremesas', 'Doces, sorvetes e frutas', 'Comida'),
('Petiscos Grelhados', 'Petiscos preparados na grelha', 'Comida'),
('Sobremesas', 'Açaí, sorvetes e doces gelados', 'Comida');

PRINT '✓ 6 categorias inseridas';

-- 10. INSERIR PRODUTOS
-- Bebidas Geladas (ID 1)
INSERT INTO Produtos (Nome, Descricao, Preco, CategoriaId, ImagemUrl, EstoqueAtual, EstoqueMinimo) VALUES
('Água Mineral 500ml', 'Água mineral natural gelada', 3.50, 1, '/images/agua.jpg', 50, 10),
('Coca-Cola 350ml', 'Refrigerante de cola gelado', 5.00, 1, '/images/coca.jpg', 30, 5),
('Guaraná Antarctica 350ml', 'Refrigerante de guaraná gelado', 5.00, 1, '/images/guarana.jpg', 25, 5),
('Suco de Laranja Natural', 'Suco natural de laranja gelado', 8.00, 1, '/images/suco-laranja.jpg', 20, 3),
('Água de Coco Gelada', 'Água de coco natural e refrescante', 6.00, 1, '/images/agua-coco.jpg', 15, 3);

-- Bebidas Quentes (ID 2)
INSERT INTO Produtos (Nome, Descricao, Preco, CategoriaId, ImagemUrl, EstoqueAtual, EstoqueMinimo) VALUES
('Café Expresso', 'Café expresso tradicional', 4.00, 2, '/images/cafe.jpg', 100, 20),
('Cappuccino', 'Café com leite vaporizado e canela', 7.00, 2, '/images/cappuccino.jpg', 50, 10),
('Chocolate Quente', 'Chocolate quente cremoso', 8.00, 2, '/images/chocolate.jpg', 30, 5);

-- Lanches (ID 3)
INSERT INTO Produtos (Nome, Descricao, Preco, CategoriaId, ImagemUrl, EstoqueAtual, EstoqueMinimo) VALUES
('Sanduíche Natural', 'Pão integral com peito de peru e salada', 12.00, 3, '/images/sanduiche.jpg', 20, 5),
('Hambúrguer Artesanal', 'Hambúrguer 180g com queijo e bacon', 18.00, 3, '/images/hamburguer.jpg', 15, 3),
('Coxinha de Frango', 'Coxinha tradicional de frango', 5.50, 3, '/images/coxinha.jpg', 25, 8),
('Pão de Açúcar', 'Pão doce tradicional da casa', 4.50, 3, '/images/pao-acucar.jpg', 20, 5);

-- Sobremesas (ID 4)
INSERT INTO Produtos (Nome, Descricao, Preco, CategoriaId, ImagemUrl, EstoqueAtual, EstoqueMinimo) VALUES
('Açaí 300ml', 'Açaí cremoso com granola', 12.00, 4, '/images/acai.jpg', 30, 5),
('Sorvete 2 Bolas', 'Sorvete artesanal - 2 bolas', 8.00, 4, '/images/sorvete.jpg', 40, 10),
('Salada de Frutas', 'Mix de frutas frescas da estação', 10.00, 4, '/images/salada-frutas.jpg', 15, 3),
('Brownie com Sorvete', 'Brownie quente com sorvete de baunilha', 14.00, 4, '/images/brownie.jpg', 12, 3);

-- Petiscos Grelhados (ID 5)
INSERT INTO Produtos (Nome, Descricao, Preco, CategoriaId, ImagemUrl, EstoqueAtual, EstoqueMinimo) VALUES
('Pastel de Queijo', 'Pastel frito recheado com queijo', 8.00, 5, '/images/pastel-queijo.jpg', 25, 5),
('Picanha Grelhada', 'Picanha suculenta (400g)', 45.00, 5, '/images/picanha.jpg', 8, 2),
('Frango Grelhado', 'Peito de frango temperado (300g)', 25.00, 5, '/images/frango.jpg', 12, 3),
('Espetinho de Carne', '3 espetinhos de carne', 24.00, 5, '/images/espetinho.jpg', 20, 4);

-- Sobremesas (ID 6)
INSERT INTO Produtos (Nome, Descricao, Preco, CategoriaId, ImagemUrl, EstoqueAtual, EstoqueMinimo) VALUES
('Pudim de Leite', 'Pudim caseiro cremoso', 12.00, 6, '/images/pudim.jpg', 10, 2),
('Brigadeiro Gourmet', '4 brigadeiros especiais', 15.00, 6, '/images/brigadeiro.jpg', 20, 3),
('Sorvete Açaí', 'Açaí com granola e frutas', 16.00, 6, '/images/acai-sorvete.jpg', 15, 3);

PRINT '✓ 22 produtos inseridos';

-- 11. INSERIR USUÁRIO ADMIN
-- Senha: admin123 (hash BCrypt)
INSERT INTO Usuarios (Nome, Email, SenhaHash, Perfil) VALUES
('Administrador', 'admin@quiosquebeach.com', '$2a$11$8K1p/a0pxBeoHc0/cHHMeO.5UHd.2tDNxF7/7ZNAJ1NU.1LYC4p1m', 'Admin');

PRINT '✓ Usuário admin criado';

-- 12. VERIFICAR CRIAÇÃO
PRINT '===========================================';
PRINT '📊 RESUMO DA CRIAÇÃO:';
SELECT 'Categorias' as Tabela, COUNT(*) as Total FROM Categorias
UNION ALL
SELECT 'Produtos' as Tabela, COUNT(*) as Total FROM Produtos
UNION ALL
SELECT 'Usuarios' as Tabela, COUNT(*) as Total FROM Usuarios;

PRINT '===========================================';
PRINT '🎉 BANCO CRIADO COM SUCESSO!';
PRINT '📱 Cliente: http://localhost:5001';
PRINT '⚙️ Admin: http://localhost:5001/admin.html';
PRINT '👤 Login: admin@quiosquebeach.com / admin123';
PRINT '===========================================';
