// -----------------------------------------------------------------------------
// 1. DEFINIÇÃO DE ESTADOS E TIPOS (Simulando Enums)
// -----------------------------------------------------------------------------

const CorSinal = {
    VERMELHO: "VERMELHO",
    AMARELO: "AMARELO",
    VERDE: "VERDE"
};

const Direcao = {
    NORTE: "NORTE",
    SUL: "SUL",
    LESTE: "LESTE",
    OESTE: "OESTE"
};

// -----------------------------------------------------------------------------
// 2. COMPONENTES BÁSICOS (Luzes e Sensores)
// -----------------------------------------------------------------------------

class SensorTraffico {
    /**
     * Simula um sensor de indução no chão.
     * @param {number} intensidadeBase - Fluxo médio esperado.
     */
    constructor(intensidadeBase = 5) {
        this.intensidadeBase = intensidadeBase;
    }

    detectarFluxo() {
        // Simula variação no tráfego (0 até 2x a base)
        return Math.floor(Math.random() * (this.intensidadeBase * 2 + 1));
    }
}

class LuzSemaforo {
    /**
     * Encapsula o estado de uma única sinaleira.
     * @param {string} nome - Identificador da luz.
     */
    constructor(nome) {
        this.nome = nome;
        this.estadoAtual = CorSinal.VERMELHO;
        this.tempoNoEstado = 0;
    }

    alterarEstado(novoEstado) {
        // Validação de segurança básica
        if (this.estadoAtual === CorSinal.AMARELO && novoEstado === CorSinal.VERDE) {
            throw new Error("Não pode ir de Amarelo para Verde diretamente!");
        }
        
        this.estadoAtual = novoEstado;
        this.tempoNoEstado = 0;
    }

    tick() {
        this.tempoNoEstado++;
    }

    toString() {
        return `[${this.nome}: ${this.estadoAtual}]`;
    }
}

// -----------------------------------------------------------------------------
// 3. O CÉREBRO DO SISTEMA (Controlador)
// -----------------------------------------------------------------------------

class ControladorInterseccao {
    constructor() {
        // Inicializa Luzes de Carros
        this.luzesCarros = {
            [Direcao.NORTE]: new LuzSemaforo("CARRO-NORTE"),
            [Direcao.SUL]: new LuzSemaforo("CARRO-SUL"),
            [Direcao.LESTE]: new LuzSemaforo("CARRO-LESTE"),
            [Direcao.OESTE]: new LuzSemaforo("CARRO-OESTE"),
        };
        
        // Inicializa Luzes de Pedestres
        this.luzesPedestres = {
            [Direcao.NORTE]: new LuzSemaforo("PED-NORTE"),
            [Direcao.SUL]: new LuzSemaforo("PED-SUL"),
            [Direcao.LESTE]: new LuzSemaforo("PED-LESTE"),
            [Direcao.OESTE]: new LuzSemaforo("PED-OESTE"),
        };

        // Sensores para cada via
        this.sensores = {
            [Direcao.NORTE]: new SensorTraffico(5),
            [Direcao.SUL]: new SensorTraffico(5),
            [Direcao.LESTE]: new SensorTraffico(8), // Via mais movimentada
            [Direcao.OESTE]: new SensorTraffico(8),
        };

        this.tickAtual = 0;
        this.faseAtual = 0; // 0: N/S Verde, 1: N/S Amarelo, 2: L/O Verde, 3: L/O Amarelo
        
        // Tempos base (em ticks)
        this.tempoVerdeBase = 100;
        this.tempoAmarelo = 30;
    }

    verificarSeguranca() {
        const norteSulVerde = this.luzesCarros[Direcao.NORTE].estadoAtual === CorSinal.VERDE;
        const lesteOesteVerde = this.luzesCarros[Direcao.LESTE].estadoAtual === CorSinal.VERDE;

        if (norteSulVerde && lesteOesteVerde) {
            throw new Error("CRÍTICO: Colisão detectada! Ambas as vias verdes.");
        }
    }

    calcularTempoVerdeInteligente(direcaoPrincipal) {
        const fluxo = this.sensores[direcaoPrincipal].detectarFluxo();
        // Quanto mais carros, mais tempo de verde (máximo +10 ticks)
        const ajuste = Math.min(fluxo, 10); 
        return this.tempoVerdeBase + ajuste;
    }

    atualizarLogica() {
        this.tickAtual++;
        
        const tempoVerdeDinamico = this.calcularTempoVerdeInteligente(Direcao.NORTE);

        // Máquina de Estados Simplificada
        if (this.faseAtual === 0) { // N/S Verde
            if (this.luzesCarros[Direcao.NORTE].tempoNoEstado >= tempoVerdeDinamico) {
                this.mudarParaAmareloNS();
                this.faseAtual = 1;
            }
        } 
        else if (this.faseAtual === 1) { // N/S Amarelo
            if (this.luzesCarros[Direcao.NORTE].tempoNoEstado >= this.tempoAmarelo) {
                this.mudarParaVerdeLO();
                this.faseAtual = 2;
            }
        } 
        else if (this.faseAtual === 2) { // L/O Verde
            if (this.luzesCarros[Direcao.LESTE].tempoNoEstado >= this.tempoVerdeBase) {
                this.mudarParaAmareloLO();
                this.faseAtual = 3;
            }
        } 
        else if (this.faseAtual === 3) { // L/O Amarelo
            if (this.luzesCarros[Direcao.LESTE].tempoNoEstado >= this.tempoAmarelo) {
                this.mudarParaVerdeNS();
                this.faseAtual = 0;
            }
        }

        // Atualiza ticks internos de todas as luzes
        const todasLuzes = [
            ...Object.values(this.luzesCarros), 
            ...Object.values(this.luzesPedestres)
        ];
        todasLuzes.forEach(luz => luz.tick());

        this.verificarSeguranca();
    }

    // Métodos de Transição
    mudarParaVerdeNS() {
        [Direcao.NORTE, Direcao.SUL].forEach(d => {
            this.luzesCarros[d].alterarEstado(CorSinal.VERDE);
            this.luzesPedestres[d].alterarEstado(CorSinal.VERMELHO);
        });
        [Direcao.LESTE, Direcao.OESTE].forEach(d => {
            this.luzesCarros[d].alterarEstado(CorSinal.VERMELHO);
            this.luzesPedestres[d].alterarEstado(CorSinal.VERDE);
        });
    }

    mudarParaAmareloNS() {
        [Direcao.NORTE, Direcao.SUL].forEach(d => {
            this.luzesCarros[d].alterarEstado(CorSinal.AMARELO);
        });
    }

    mudarParaVerdeLO() {
        [Direcao.LESTE, Direcao.OESTE].forEach(d => {
            this.luzesCarros[d].alterarEstado(CorSinal.VERDE);
            this.luzesPedestres[d].alterarEstado(CorSinal.VERMELHO);
        });
        [Direcao.NORTE, Direcao.SUL].forEach(d => {
            this.luzesCarros[d].alterarEstado(CorSinal.VERMELHO);
            this.luzesPedestres[d].alterarEstado(CorSinal.VERDE);
        });
    }

    mudarParaAmareloLO() {
        [Direcao.LESTE, Direcao.OESTE].forEach(d => {
            this.luzesCarros[d].alterarEstado(CorSinal.AMARELO);
        });
    }

    renderizar() {
        // Limpa o console para criar efeito de animação (opcional, remova se quiser histórico)
        // console.clear(); 
        
        console.log("\n" + "=".repeat(30));
        console.log(`TEMPO: ${this.tickAtual}`);
        console.log(`CARRO N/S: ${this.luzesCarros[Direcao.NORTE]}`);
        console.log(`CARRO L/O: ${this.luzesCarros[Direcao.LESTE]}`);
        console.log(`PED N/S:   ${this.luzesPedestres[Direcao.NORTE]}`);
        console.log(`PED L/O:   ${this.luzesPedestres[Direcao.LESTE]}`);
        console.log("=".repeat(30));
    }
}

// -----------------------------------------------------------------------------
// 4. LOOP PRINCIPAL (Simulação Assíncrona)
// -----------------------------------------------------------------------------

async function main() {
    const controlador = new ControladorInterseccao();
    
    console.log("INICIANDO SIMULAÇÃO DE SEMÁFORO INTELIGENTE (JS)");
    console.log("Pressione Ctrl+C para parar\n");
    
    try {
        while (true) {
            controlador.atualizarLogica();
            controlador.renderizar();
            
            // Aguarda 1 segundo (1000ms) entre cada tick
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        if (error.message.includes("CRÍTICO")) {
            console.error(`\nERRO CRÍTICO NO SISTEMA: ${error.message}`);
        } else if (error.code !== 'ERR_SCRIPT_EXECUTION_TERMINATED') {
            // Ignora erro de interrupção padrão do Node ao dar Ctrl+C
            console.error(`\nErro inesperado: ${error.message}`);
        }
    }
}

// Executa o programa
main();