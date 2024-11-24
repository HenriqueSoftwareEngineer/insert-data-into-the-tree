const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { createObjectCsvWriter } = require('csv-writer');
const { BinaryDataTree } = require('./dataTree.js');
const randomNumericDataGenerator = require('./insertDataIntoTheTree.js');

// Configuração do servidor
const app = express();
const PORT = 8000;

// Middleware para JSON
app.use(bodyParser.json());


//Definindo o caminho do diretório de downloads
const downloadsDir = path.join(__dirname, 'download');

//Verifica se o diretório existe
if(!fs.existsSync(downloadsDir)){
    //Se não existir, cria o diretório
    fs.mkdirSync(downloadsDir,{recursive:true});
    console.log(`Diretório de download criado com sucesso!`, downloadsDir);
}else{
    console.log(`Diretório de donwloads já existe!`, downloadsDir)
}



// Banco de dados SQLite
const db = new sqlite3.Database('./trees.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        
        // Criação da tabela 'trees' se ela não existir
        db.run(`
          CREATE TABLE IF NOT EXISTS trees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT
          )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela:', err.message);
            } else {
                console.log('Tabela "trees" criada ou já existe.');
            }
        });
    }
});

// Rota raiz
app.get('/', (req, res) => {
    res.send('Servidor funcionando! Use /generate-tree para gerar árvores ou /export-tree/:id para exportar.');
});

// Rota para gerar árvores e salvar no banco de dados
app.post('/generate-tree', (req, res) => {
    const generator = randomNumericDataGenerator();
    const binaryTree = new BinaryDataTree();

    // Gerar 5 itens aleatórios e inserir na árvore
    for (let i = 0; i < 5; i++) {
        const randomValue = Math.floor(Math.random() * 10000);
        const stateClassifierValue = randomValue > 1000 ? true : randomValue > 0 ? false : null;

        const item = new generator.Main(
            randomValue.toString(),
            `ID: ${19880 + i}`,
            stateClassifierValue
        );
        item.sendTheData();
        binaryTree.insertData(generator.data[i]);
    }

    const treeData = JSON.stringify(binaryTree);
    db.run('INSERT INTO trees (data) VALUES (?)', [treeData], function (err) {
        if (err) {
            return res.status(500).send({ error: 'Erro ao salvar a árvore no banco de dados', details: err.message });
        }
        res.status(201).send({ message: 'Árvore salva com sucesso!', treeId: this.lastID });
    });
});

// Rota para exportar árvores para CSV
app.get('/export-tree/:id', (req, res) => {
    const treeId = req.params.id;

    // Busca a árvore pelo ID no banco de dados
    db.get('SELECT data FROM trees WHERE id = ?', [treeId], (err, row) => {
        if (err) {
            return res.status(500).send({ error: 'Erro ao buscar a árvore', details: err.message });
        }
        if (!row) {
            return res.status(404).send({ error: 'Árvore não encontrada' });
        }

        const treeData = JSON.parse(row.data);
        const csvWriter = createObjectCsvWriter({
            path: path.join(downloadsDir, `tree_${treeId}.csv`),  // Salva no diretório 'downloads'
            header: [
                { id: 'value', title: 'Value' },
                { id: 'inf', title: 'Info' },
                { id: 'state', title: 'State' },
            ],
        });
        

        const rows = [];
        const traverseTree = (node) => {
            if (!node) return;
            rows.push({ value: node.value, inf: node.inf, state: node.state });
            traverseTree(node.leftSon);
            traverseTree(node.rightSon);
        };
        traverseTree(treeData.root);

        // Escreve os dados no arquivo CSV e envia como download
        csvWriter
            .writeRecords(rows)
            .then(() => res.download(`tree_${treeId}.csv`))
            .catch((err) => res.status(500).send({ error: 'Erro ao exportar para CSV', details: err.message }));
    });
});

// Middleware de erros genéricos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
