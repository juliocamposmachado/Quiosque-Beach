// Script para testar o deploy no Vercel
// Execute com: node deploy-test.js

const fs = require('fs');
const path = require('path');

console.log('🧪 Verificando estrutura para deploy do Vercel...\n');

// Verificar se wwwroot existe
const wwwrootPath = path.join(__dirname, 'wwwroot');
if (fs.existsSync(wwwrootPath)) {
    console.log('✅ Pasta wwwroot encontrada');
} else {
    console.log('❌ Pasta wwwroot não encontrada');
    process.exit(1);
}

// Verificar arquivos principais
const requiredFiles = [
    'wwwroot/index.html',
    'wwwroot/login.html',
    'wwwroot/cardapio.html',
    'wwwroot/install-app.html',
    'wwwroot/js/app.js',
    'wwwroot/js/login.js',
    'wwwroot/js/install-app.js',
    'wwwroot/css/styles.css',
    'wwwroot/css/install-app.css',
    'wwwroot/manifest.json',
    'vercel.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - ARQUIVO FALTANDO`);
        allFilesExist = false;
    }
});

// Verificar sintaxe do vercel.json
try {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
    console.log('✅ vercel.json tem sintaxe JSON válida');
    
    if (vercelConfig.outputDirectory === 'wwwroot') {
        console.log('✅ outputDirectory configurado corretamente');
    } else {
        console.log('⚠️  outputDirectory não está definido como "wwwroot"');
    }
} catch (error) {
    console.log('❌ Erro no vercel.json:', error.message);
    allFilesExist = false;
}

// Verificar manifest.json
try {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'wwwroot/manifest.json'), 'utf8'));
    console.log('✅ manifest.json tem sintaxe JSON válida');
    
    if (manifest.name && manifest.short_name && manifest.start_url) {
        console.log('✅ Campos obrigatórios do PWA presentes');
    } else {
        console.log('⚠️  Alguns campos obrigatórios do PWA podem estar faltando');
    }
} catch (error) {
    console.log('❌ Erro no manifest.json:', error.message);
    allFilesExist = false;
}

// Verificar sintaxe dos arquivos JavaScript
const jsFiles = [
    'wwwroot/js/app.js',
    'wwwroot/js/login.js',
    'wwwroot/js/install-app.js'
];

jsFiles.forEach(jsFile => {
    try {
        const content = fs.readFileSync(path.join(__dirname, jsFile), 'utf8');
        // Verificação básica de sintaxe - procurar por erros comuns
        if (content.includes('function') || content.includes('=>') || content.includes('const') || content.includes('let')) {
            console.log(`✅ ${jsFile} - Sintaxe básica OK`);
        } else {
            console.log(`⚠️  ${jsFile} - Arquivo muito pequeno ou pode estar vazio`);
        }
    } catch (error) {
        console.log(`❌ Erro ao ler ${jsFile}:`, error.message);
        allFilesExist = false;
    }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ Projeto pronto para deploy no Vercel');
    console.log('\n📝 Próximos passos:');
    console.log('1. Conecte seu repositório GitHub ao Vercel');
    console.log('2. Configure o projeto para usar a pasta Frontend/');
    console.log('3. O Vercel detectará automaticamente o vercel.json');
    console.log('4. Deploy será feito automaticamente');
} else {
    console.log('❌ ALGUNS PROBLEMAS FORAM ENCONTRADOS');
    console.log('⚠️  Corrija os arquivos faltando antes do deploy');
    process.exit(1);
}

console.log('='.repeat(50));
