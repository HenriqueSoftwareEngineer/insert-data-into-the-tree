//Classe que cria o nó
class Node {
    constructor(value, inf, state) {
        this.value = value; // Valor numérico principal
        this.inf = inf;     // Informação adicional
        this.state = state; // Estado classificado
        this.leftSon = null;
        this.rightSon = null;
    }
}

//Classe que cria a árvore binária
class BinaryDataTree {
    constructor() {
        this.root = null;
    }

    // Método para inserir dados na árvore
    insertData(data) {
        const { value, inf, state } = data;
        const newNode = new Node(value, inf, state);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this._insertData(this.root, newNode);
        }
    }

    _insertData(node, newNode) {
        if (newNode.value < node.value) {
            if (node.leftSon === null) {
                node.leftSon = newNode;
            } else {
                this._insertData(node.leftSon, newNode);
            }
        } else {
            if (node.rightSon === null) {
                node.rightSon = newNode;
            } else {
                this._insertData(node.rightSon, newNode);
            }
        }
    }

    // Função que faz uma busca em largura
    bfs(root) {
        let queue = [root];
        while (queue.length > 0) {
            let node = queue.shift();
            if (!node.leftSon && !node.rightSon) {
                return node; // Nó folha encontrado
            }
            if (node.leftSon) queue.push(node.leftSon);
            if (node.rightSon) queue.push(node.rightSon);
        }
    }

    // Função que faz uma busca em profundidade
    dfs(node) {
        if (!node) return 0;
        if (!node.leftSon && !node.rightSon) return node.value; // Nó folha.
        return this.dfs(node.leftSon) + this.dfs(node.rightSon);
    }
}


module.exports = { BinaryDataTree };
