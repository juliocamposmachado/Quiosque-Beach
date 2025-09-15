-- Script de Inicialização do Banco de Dados - Quiosque Beach
-- Execute este script para criar as tabelas e dados iniciais

-- Criar o banco (se necessário)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'QuiosqueBeachDB')
BEGIN
    CREATE DATABASE QuiosqueBeachDB;
END
GO

USE QuiosqueBeachDB;
GO

-- Tabela Usuarios
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Usuarios')
BEGIN
    CREATE TABLE Usuarios (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        SenhaHash NVARCHAR(MAX) NOT NULL,
        Perfil NVARCHAR(50) NOT NULL DEFAULT 'Admin',
        Ativo BIT NOT NULL DEFAULT 1,
        DataCriacao DATETIME2 NOT NULL DEFAULT GETDATE(),
        UltimoLogin DATETIME2 NULL
    );
END
GO

-- Tabela Categorias
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Categorias')
BEGIN
    CREATE TABLE Categorias (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Descricao NVARCHAR(500) NULL,
        Tipo NVARCHAR(50) NOT NULL, -- 'Bebida' ou 'Comida'
        Ativo BIT NOT NULL DEFAULT 1
    );
END
GO

-- Tabela Produtos
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Produtos')
BEGIN
    CREATE TABLE Produtos (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Descricao NVARCHAR(500) NULL,
        Preco DECIMAL(10,2) NOT NULL,
        ImagemUrl NVARCHAR(255) NULL,
        Ativo BIT NOT NULL DEFAULT 1,
        EstoqueAtual INT NOT NULL DEFAULT 0,
        EstoqueMinimo INT NOT NULL DEFAULT 0,
        CategoriaId INT NOT NULL,
        DataCriacao DATETIME2 NOT NULL DEFAULT GETDATE(),
        DataAtualizacao DATETIME2 NOT NULL DEFAULT GETDATE(),
        
        CONSTRAINT FK_Produtos_Categorias FOREIGN KEY (CategoriaId) 
            REFERENCES Categorias(Id) ON DELETE RESTRICT
    );
END
GO

-- Tabela Pedidos
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Pedidos')
BEGIN
    CREATE TABLE Pedidos (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        NumeroMesa NVARCHAR(50) NOT NULL,
        NomeCliente NVARCHAR(100) NULL,
        ValorTotal DECIMAL(10,2) NOT NULL,
        Status INT NOT NULL DEFAULT 0, -- 0=Pendente, 1=Confirmado, 2=EmPreparo, 3=Pronto, 4=Entregue, 5=Cancelado
        DataCriacao DATETIME2 NOT NULL DEFAULT GETDATE(),
        DataConfirmacao DATETIME2 NULL,
        DataEntrega DATETIME2 NULL,
        Observacoes NVARCHAR(500) NULL
    );
END
GO

-- Tabela ItensPedido
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ItensPedido')
BEGIN
    CREATE TABLE ItensPedido (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Quantidade INT NOT NULL,
        PrecoUnitario DECIMAL(10,2) NOT NULL,
        Subtotal DECIMAL(10,2) NOT NULL,
        Observacoes NVARCHAR(500) NULL,
        PedidoId INT NOT NULL,
        ProdutoId INT NOT NULL,
        
        CONSTRAINT FK_ItensPedido_Pedidos FOREIGN KEY (PedidoId) 
            REFERENCES Pedidos(Id) ON DELETE CASCADE,
        CONSTRAINT FK_ItensPedido_Produtos FOREIGN KEY (ProdutoId) 
            REFERENCES Produtos(Id) ON DELETE RESTRICT
    );
END
GO

-- Inserir dados iniciais
PRINT 'Inserindo dados iniciais...'

-- Categorias
IF NOT EXISTS (SELECT 1 FROM Categorias)
BEGIN
    INSERT INTO Categorias (Nome, Descricao, Tipo) VALUES
    ('Bebidas Geladas', 'Cervejas, refrigerantes e sucos gelados', 'Bebida'),
    ('Bebidas Quentes', 'Café, chá e chocolate quente', 'Bebida'),
    ('Drinks', 'Coquetéis e bebidas alcoólicas', 'Bebida'),
    ('Petiscos Fritos', 'Porções fritas e crocantes', 'Comida'),
    ('Petiscos Grelhados', 'Carnes e peixes grelhados', 'Comida'),
    ('Saladas', 'Saladas frescas e saudáveis', 'Comida'),
    ('Sobremesas', 'Doces e sobremesas especiais', 'Comida');
END
GO

-- Produtos - Bebidas
IF NOT EXISTS (SELECT 1 FROM Produtos)
BEGIN
    -- Bebidas Geladas
    INSERT INTO Produtos (Nome, Descricao, Preco, CategoriaId, EstoqueAtual, EstoqueMinimo) VALUES
    ('Cerveja Original 600ml', 'Cerveja gelada long neck', 8.50, 1, 50, 10),
    ('Cerveja Skol 350ml', 'Cerveja gelada lata', 5.00, 1, 100, 20),
    ('Coca-Cola 350ml', 'Refrigerante gelado', 4.50, 1, 80, 15),
    ('Guaraná Antarctica 350ml', 'Guaraná gelado', 4.50, 1, 60, 15),
    ('Suco de Laranja Natural', 'Suco natural da fruta', 6.00, 1, 30, 5),
    ('Água Mineral 500ml', 'Água mineral gelada', 3.00, 1, 100, 20),
    
    -- Bebidas Quentes
    ('Café Expresso', 'Café forte e aromático', 4.00, 2, 999, 0),
    ('Cappuccino', 'Café com leite e canela', 7.00, 2, 999, 0),
    ('Chocolate Quente', 'Chocolate cremoso', 8.00, 2, 999, 0),
    
    -- Drinks
    ('Caipirinha', 'Cachaça com limão e açúcar', 12.00, 3, 999, 0),
    ('Mojito', 'Rum com hortelã e limão', 15.00, 3, 999, 0),
    ('Piña Colada', 'Rum com coco e abacaxi', 18.00, 3, 999, 0);
    
    -- Petiscos Fritos
    INSERT INTO Produtos (Nome, Descricao, Preco, CategoriaId, EstoqueAtual, EstoqueMinimo) VALUES
    ('Batata Frita Simples', 'Batata frita crocante (500g)', 15.00, 4, 30, 5),
    ('Batata Frita com Queijo', 'Batata frita com queijo derretido', 18.00, 4, 25, 5),
    ('Onion Rings', 'Anéis de cebola empanados', 16.00, 4, 20, 5),
    ('Bolinho de Bacalhau', '6 bolinhos crocantes', 22.00, 4, 15, 3),
    ('Camarão Empanado', '10 camarões empanados', 28.00, 4, 10, 2),
    ('Pastéis Variados', '4 pastéis sortidos', 20.00, 4, 25, 5),
    
    -- Petiscos Grelhados
    ('Picanha Grelhada', 'Picanha suculenta (400g)', 45.00, 5, 8, 2),
    ('Frango Grelhado', 'Peito de frango temperado (300g)', 25.00, 5, 12, 3),
    ('Linguiça Toscana', 'Linguiça artesanal grelhada', 18.00, 5, 15, 3),
    ('Peixe Grelhado', 'Peixe do dia grelhado (350g)', 35.00, 5, 6, 1),
    ('Espetinho de Carne', '3 espetinhos de carne', 24.00, 5, 20, 4),
    
    -- Saladas
    ('Salada Caesar', 'Alface, croutons, parmesão e molho caesar', 22.00, 6, 20, 3),
    ('Salada de Frango', 'Mix de folhas com frango grelhado', 26.00, 6, 15, 3),
    ('Salada Tropical', 'Frutas da estação com iogurte', 18.00, 6, 12, 2),
    ('Salada Mediterrânea', 'Tomate, azeitona, queijo e manjericão', 20.00, 6, 18, 3),
    
    -- Sobremesas
    ('Pudim de Leite', 'Pudim caseiro cremoso', 12.00, 7, 10, 2),
    ('Brigadeiro Gourmet', '4 brigadeiros especiais', 15.00, 7, 20, 3),
    ('Sorvete Açaí', 'Açaí com granola e frutas', 16.00, 7, 15, 3),
    ('Torta de Limão', 'Fatia de torta cremosa', 14.00, 7, 8, 2);
END
GO

-- Usuário administrador padrão
IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Email = 'admin@quiosquebeach.com')
BEGIN
    -- Senha padrão: "admin123" (hash SHA256)
    INSERT INTO Usuarios (Nome, Email, SenhaHash, Perfil) VALUES
    ('Administrador', 'admin@quiosquebeach.com', 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=', 'Admin');
    
    PRINT 'Usuário administrador criado:'
    PRINT 'Email: admin@quiosquebeach.com'
    PRINT 'Senha: admin123'
END
GO

-- Criar alguns pedidos de exemplo (opcional)
IF NOT EXISTS (SELECT 1 FROM Pedidos)
BEGIN
    -- Pedido exemplo 1
    INSERT INTO Pedidos (NumeroMesa, NomeCliente, ValorTotal, Status, DataCriacao) VALUES
    ('5', 'João Silva', 45.50, 1, DATEADD(MINUTE, -30, GETDATE()));
    
    DECLARE @PedidoId INT = SCOPE_IDENTITY();
    
    INSERT INTO ItensPedido (PedidoId, ProdutoId, Quantidade, PrecoUnitario, Subtotal) VALUES
    (@PedidoId, 1, 2, 8.50, 17.00),  -- 2 Cervejas Original
    (@PedidoId, 15, 1, 15.00, 15.00), -- 1 Batata Frita Simples
    (@PedidoId, 10, 1, 12.00, 12.00); -- 1 Caipirinha
    
    -- Pedido exemplo 2
    INSERT INTO Pedidos (NumeroMesa, NomeCliente, ValorTotal, Status, DataCriacao) VALUES
    ('8', 'Maria Santos', 32.00, 2, DATEADD(MINUTE, -15, GETDATE()));
    
    SET @PedidoId = SCOPE_IDENTITY();
    
    INSERT INTO ItensPedido (PedidoId, ProdutoId, Quantidade, PrecoUnitario, Subtotal) VALUES
    (@PedidoId, 3, 2, 4.50, 9.00),   -- 2 Coca-Cola
    (@PedidoId, 21, 1, 22.00, 22.00); -- 1 Salada Caesar
END
GO

PRINT 'Setup do banco de dados concluído!'
PRINT 'Banco: QuiosqueBeachDB'
PRINT 'Tabelas criadas: Usuarios, Categorias, Produtos, Pedidos, ItensPedido'
PRINT 'Dados iniciais inseridos com sucesso!'
GO
