function randomNumericDataGenerator() {
    let data = [];

    function Main(value, inf, state) {
        this.value = value;
        this.inf = inf;
        this.state = state;

        this.sendTheData = function() {
            try {
                // Verifica se o valor é um número válido
                const numericValue = Number(this.value);
                const validNumericValue = !isNaN(numericValue) && this.value.trim() !== "" && (numericValue > 0 && numericValue <= 999999);
                if (!validNumericValue) {
                    throw new Error(`Valor inválido: ${this.value}. Consultar Setor Técnico`);
                }

                // Adiciona o valor ao array de dados
                data.push({
                    value: numericValue,
                    inf: this.inf,
                    state: this.state,
                    date: getCurrentDate() // Adiciona a data aqui
                });

            } catch (errorValue) {
                console.error(errorValue.message);
            }
        };

        function getCurrentDate() {
            try {
                const date = new Date();
                const day = date.getDate(); // getDate() para o dia do mês
                const month = date.getMonth() + 1; // getMonth() retorna 0-11, então adicionamos 1
                const year = date.getFullYear();
                return { day, month, year }; // Retorna um objeto com a data
            } catch (errorDate) {
                console.error("Erro ao obter a data:", errorDate.message);
                return null; // Retorna null em caso de erro
            }
        }
    }

    return {
        data,
        Main
    };
}

// Função para gerar um número aleatório entre 0 e 999999
function getRandomValue() {
    return Math.floor(Math.random() * 10000);
}

// Exemplo de uso
const generator = randomNumericDataGenerator();
function stateClassifier(randomValueForState){
    try{
        if(typeof randomValueForState === "number"){
            if(randomValueForState === 0){
                return null; //Valor igual a zero retorna null
            }else if(randomValueForState > 0 && randomValueForState <= 1000){
                return false; //Valores entre 1 e 1000 retornam false
            }else if(randomValueForState > 1000){
                return true;//Valores acima de 1000 retornam true
            }
        }else if(typeof randomValueForState === "string"){
            throw new Error(
                `Erro na geração de números aleatórios(${randomValueForState}).
                Consulte o SUPORTE TÉCNICO.`
            );
        }
    }catch(errorValue){
        console.log(errorValue.message);
    }
}


(function(){
    // Gera um valor aleatório
const randomValue = getRandomValue();

// Classifica o estado com base no valor aleatório gerado
const stateClassifierValue = stateClassifier(randomValue);

// Cria uma nova instância de Main com os dados gerados
const item1 = new generator.Main(
    randomValue.toString(), // Valor aleatório como string
    "ID: 19882",               // Informação adicional
    stateClassifierValue   // Estado classificado
);
item1.sendTheData(); // Adiciona os dados ao array

console.log(generator.data); // Mostra os dados adicionados
}())



//Exportando a função
module.exports = randomNumericDataGenerator;


