const express = require('express');
const app = express();
const PORT = 3000;

// Habilitando o middleware para processar JSON
app.use(express.json());

// Rota para gerar árvore
app.post('/generate-tree', (req, res) => {
    console.log('Processo de geração da árvore iniciado...');
    // Aqui você pode adicionar a lógica para gerar a árvore binária

    // Exemplo de resposta JSON simulada
    res.json({ message: 'Árvore criada com sucesso', treeId: 123 });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
