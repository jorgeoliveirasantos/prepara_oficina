const fs = require('fs');
// =============================================================================
// 1. CONFIGURAÇÕES E REGRAS DE NEGÓCIO (FICTÍCIAS)
// =============================================================================

const REGRAS_ANALISE = {
    // Pontuação por tipo de célula
    PONTO_POR_TIPO: {
        'A': 0,   // Benigno
        'B': 5,   // Suspeito
        'C': 10   // Altamente Suspeito
    },
    // Pontuação por características
    PONTO_POR_TAMANHO: {
        LIMITE: 15,
        PONTOS: 5
    },
    PONTO_POR_BORDA: {
        IRREGULAR: 8,
        REGULAR: 0
    },
    PONTO_POR_NUCLEO: {
        MULTIPLO: 7,
        UNICO: 0
    },
    // Limiares de diagnóstico
    LIMIARES: {
        BENIGNO: 10,
        SUSPEITO: 25,
        MALIGNO: 40
    },
    // Fator de risco por idade (fictício)
    IDADE_RISCO: 50
};

// =============================================================================
// 2. CLASSES DO DOMÍNIO (Modelagem de Dados)
// =============================================================================

class Celula {
    constructor(tipo, tamanho, borda, nucleo) {
        this.tipo = tipo.toUpperCase();
        this.tamanho = tamanho;
        this.borda = borda.toLowerCase();
        this.nucleo = nucleo.toLowerCase();
    }

    validar() {
        if (!['A', 'B', 'C'].includes(this.tipo)) {
            throw new Error(`Tipo de célula inválido: ${this.tipo}`);
        }
        if (this.tamanho <= 0) {
            throw new Error(`Tamanho inválido: ${this.tamanho}`);
        }
        if (!['regular', 'irregular'].includes(this.borda)) {
            throw new Error(`Borda inválida: ${this.borda}`);
        }
        if (!['unico', 'multiplo'].includes(this.nucleo)) {
            throw new Error(`Núcleo inválido: ${this.nucleo}`);
        }
        return true;
    }

    calcularPontuacao() {
        let pontos = REGRAS_ANALISE.PONTO_POR_TIPO[this.tipo] || 0;

        if (this.tamanho > REGRAS_ANALISE.PONTO_POR_TAMANHO.LIMITE) {
            pontos += REGRAS_ANALISE.PONTO_POR_TAMANHO.PONTOS;
        }

        pontos += this.borda === 'irregular'
            ? REGRAS_ANALISE.PONTO_POR_BORDA.IRREGULAR
            : REGRAS_ANALISE.PONTO_POR_BORDA.REGULAR;

        pontos += this.nucleo === 'multiplo'
            ? REGRAS_ANALISE.PONTO_POR_NUCLEO.MULTIPLO
            : REGRAS_ANALISE.PONTO_POR_NUCLEO.UNICO;

        return pontos;
    }
}

class RelatorioMedico {
    constructor(id, paciente, idade, celulasRaw) {
        this.id = id;
        this.paciente = paciente;
        this.idade = idade;
        this.celulas = [];
        this.pontuacaoTotal = 0;
        this.diagnostico = '';
        this.erros = [];

        // Processa células com tratamento de erro individual
        if (Array.isArray(celulasRaw)) {
            celulasRaw.forEach((c, index) => {
                try {
                    const celula = new Celula(c.tipo, c.tamanho, c.borda, c.nucleo);
                    celula.validar();
                    this.celulas.push(celula);
                } catch (error) {
                    this.erros.push(`Célula ${index + 1}: ${error.message}`);
                }
            });
        }
    }

    validarDadosPaciente() {
        if (!this.id || typeof this.id !== 'string') {
            this.erros.push('ID do paciente inválido');
            return false;
        }
        if (!this.paciente || typeof this.paciente !== 'string') {
            this.erros.push('Nome do paciente inválido');
            return false;
        }
        if (typeof this.idade !== 'number' || this.idade <= 0 || this.idade > 120) {
            this.erros.push(`Idade inválida: ${this.idade}`);
            return false;
        }
        return true;
    }

    analisar() {
        if (!this.validarDadosPaciente()) {
            this.diagnostico = 'ERRO_VALIDACAO';
            return;
        }

        if (this.celulas.length === 0) {
            this.diagnostico = 'SEM_DADOS';
            return;
        }

        // Soma pontuação de todas as células
        this.celulas.forEach(celula => {
            this.pontuacaoTotal += celula.calcularPontuacao();
        });

        // Aplica fator de risco por idade
        if (this.idade > REGRAS_ANALISE.IDADE_RISCO) {
            this.pontuacaoTotal += 5; // Bônus de risco
        }

        // Classifica baseado nos limiares
        if (this.pontuacaoTotal >= REGRAS_ANALISE.LIMIARES.MALIGNO) {
            this.diagnostico = 'MALIGNO';
        } else if (this.pontuacaoTotal >= REGRAS_ANALISE.LIMIARES.SUSPEITO) {
            this.diagnostico = 'SUSPEITO';
        } else if (this.pontuacaoTotal >= REGRAS_ANALISE.LIMIARES.BENIGNO) {
            this.diagnostico = 'ATENCAO';
        } else {
            this.diagnostico = 'BENIGNO';
        }
    }

    gerarRelatorioTexto() {
        const linha = '='.repeat(60);
        let saida = `\n${linha}\n`;
        saida += `RELATÓRIO DE ANÁLISE - ${this.id}\n`;
        saida += `${linha}\n`;
        saida += `Paciente: ${this.paciente}\n`;
        saida += `Idade: ${this.idade} anos\n`;
        saida += `Células analisadas: ${this.celulas.length}\n`;

        if (this.erros.length > 0) {
            saida += `\n⚠️  ERROS ENCONTRADOS:\n`;
            this.erros.forEach(e => saida += `   - ${e}\n`);
        }

        saida += `\n📊 PONTUAÇÃO TOTAL: ${this.pontuacaoTotal}\n`;
        saida += `🏥 DIAGNÓSTICO: ${this.diagnostico}\n`;

        // Detalhamento por célula
        if (this.celulas.length > 0) {
            saida += `\n🔬 DETALHAMENTO DAS CÉLULAS:\n`;
            this.celulas.forEach((c, i) => {
                saida += `   Célula ${i + 1}: Tipo ${c.tipo} | `;
                saida += `Tamanho ${c.tamanho} | `;
                saida += `Borda ${c.borda} | `;
                saida += `Núcleo ${c.nucleo} | `;
                saida += `Pontos: ${c.calcularPontuacao()}\n`;
            });
        }

        saida += `${linha}\n`;
        saida += `⚠️  AVISO: ESTE É UM SISTEMA FICTÍCIO PARA FINS EDUCACIONAIS.\n`;
        saida += `NÃO UTILIZAR PARA DIAGNÓSTICO MÉDICO REAL.\n`;
        saida += `${linha}\n`;

        return saida;
    }
}

// =============================================================================
// 3. ENGINE DE PROCESSAMENTO (Padrão Strategy/Processor)
// =============================================================================

class AnalisadorEngine {
    constructor(arquivoDados) {
        this.arquivoDados = arquivoDados;
        this.relatorios = [];
        this.estatisticas = {
            total: 0,
            benigno: 0,
            atencao: 0,
            suspeito: 0,
            maligno: 0,
            erro: 0
        };
    }

    carregarDados() {
        try {
            const conteudo = fs.readFileSync(this.arquivoDados, 'utf-8');
            const dados = JSON.parse(conteudo);

            if (!Array.isArray(dados)) {
                throw new Error('O arquivo JSON deve conter um array de pacientes');
            }

            return dados;
        } catch (error) {
            console.error(`❌ Erro ao carregar dados: ${error.message}`);
            return [];
        }
    }

    processarTodos() {
        const dados = this.carregarDados();

        console.log(`\n🔄 Processando ${dados.length} relatório(s)...\n`);

        dados.forEach(dado => {
            const relatorio = new RelatorioMedico(
                dado.id,
                dado.paciente,
                dado.idade,
                dado.celulas
            );

            relatorio.analisar();
            this.relatorios.push(relatorio);

            // Atualiza estatísticas
            this.estatisticas.total++;
            const diag = relatorio.diagnostico.toLowerCase();

            if (diag.includes('benigno')) this.estatisticas.benigno++;
            else if (diag.includes('atencao')) this.estatisticas.atencao++;
            else if (diag.includes('suspeito')) this.estatisticas.suspeito++;
            else if (diag.includes('maligno')) this.estatisticas.maligno++;
            else this.estatisticas.erro++;
        });
    }

    gerarRelatorioConsolidado() {
        const linha = '='.repeat(60);
        let saida = `\n${linha}\n`;
        saida += `📈 RELATÓRIO CONSOLIDADO DO SISTEMA\n`;
        saida += `${linha}\n`;
        saida += `Total de Pacientes: ${this.estatisticas.total}\n\n`;

        saida += `Distribuição de Diagnósticos:\n`;
        saida += `  ✅ Benigno:    ${this.estatisticas.benigno}\n`;
        saida += `  ⚠️  Atenção:    ${this.estatisticas.atencao}\n`;
        saida += `  🟡 Suspeito:   ${this.estatisticas.suspeito}\n`;
        saida += `  🔴 Maligno:    ${this.estatisticas.maligno}\n`;
        saida += `  ❌ Erros:      ${this.estatisticas.erro}\n\n`;

        // Cálculo de prevalência
        if (this.estatisticas.total > 0) {
            const taxaMaligno = ((this.estatisticas.maligno / this.estatisticas.total) * 100).toFixed(2);
            saida += `Taxa de Malignidade Detectada: ${taxaMaligno}%\n`;
        }

        saida += `${linha}\n`;
        return saida;
    }

    exportarResultados(arquivoSaida) {
        const resultados = this.relatorios.map(r => ({
            id: r.id,
            paciente: r.paciente,
            diagnostico: r.diagnostico,
            pontuacao: r.pontuacaoTotal,
            celulasAnalisadas: r.celulas.length,
            erros: r.erros.length
        }));

        try {
            fs.writeFileSync(arquivoSaida, JSON.stringify(resultados, null, 2));
            console.log(`\n💾 Resultados exportados para: ${arquivoSaida}`);
        } catch (error) {
            console.error(`❌ Erro ao exportar: ${error.message}`);
        }
    }
}

// =============================================================================
// 4. LOOP PRINCIPAL (Console)
// =============================================================================

function main() {
    console.clear();

    const ASCII_ART = `
    ╔═══════════════════════════════════════════════════════════╗
    ║          SISTEMA DE ANÁLISE DE RELATÓRIOS MÉDICOS         ║
    ║                    (DADOS FICTÍCIOS)                      ║
    ╚═══════════════════════════════════════════════════════════╝
    `;

    console.log(ASCII_ART);

    const engine = new AnalisadorEngine('dados.json');
    engine.processarTodos();

    // Imprime relatório individual de cada paciente
    engine.relatorios.forEach(relatorio => {
        console.log(relatorio.gerarRelatorioTexto());
    });

    // Imprime consolidado
    console.log(engine.gerarRelatorioConsolidado());

    // Exporta resultados para auditoria
    engine.exportarResultados('resultados_analise.json');

    console.log('\n✅ Processamento concluído com sucesso!\n');
}

// Executa o programa
main();