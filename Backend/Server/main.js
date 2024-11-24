const randomNumericDataGenerator = require('./insertDataIntoTheTree.js');
const { BinaryDataTree } = require('./dataTree.js');

// Cria a árvore binária
const binaryTree = new BinaryDataTree();

// Gera valores aleatórios e os insere na árvore
const generator = randomNumericDataGenerator();

// Gerar vários itens de dados
for (let i = 0; i < 5; i++) { // Ajuste o número de itens gerados conforme necessário
    const randomValue = Math.floor(Math.random() * 10000);
    const stateClassifierValue = (randomValue > 1000) ? true : randomValue > 0 ? false : null;

    const item = new generator.Main(
        randomValue.toString(),
        `ID: ${19880 + i}`, // Informação adicional única
        stateClassifierValue
    );

    item.sendTheData(); // Adiciona os dados ao array no gerador

    // Insere o dado na árvore binária
    binaryTree.insertData(generator.data[i]);
}

// Exibe os dados da árvore em ordem (Exemplo de teste)
console.log("Árvore binária criada com os seguintes nós:");
console.log(JSON.stringify(binaryTree, null, 2));
