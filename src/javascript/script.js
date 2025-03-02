document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault(); // Evita recarregar a página
        adicionarPix();
    });
});

function adicionarPix() {
    const nomeCliente = document.getElementById("nomeCliente").value.trim();
    const valorPix = parseFloat(document.getElementById("valorPix").value);
    const dataAtual = new Date().toLocaleDateString("pt-br");
    
    if (nomeCliente === "" || isNaN(valorPix) || valorPix <= 0) {
        alert("Preencha os campos corretamente!");
        return;
    }
    
    const tabelaPix = document.getElementById("tabela-pix");
    const novaLinha = document.createElement("tr");
    
    novaLinha.innerHTML = `
        <td>${nomeCliente}</td>
        <td>R$ ${valorPix.toFixed(2)}</td>
        <td>${dataAtual}</td>
        <td><button class="btn-remover" onclick="removerLinha(this)">X</button></td>
    `;
    
    tabelaPix.appendChild(novaLinha);
    salvarDados();
    atualizarTotal();
    document.getElementById("nomeCliente").value = "";
    document.getElementById("valorPix").value = "";
}

function removerLinha(botao) {
    botao.parentElement.parentElement.remove();
    atualizarTotal();
}

function removerUtimaLinha() {
    const tabelaPix = document.getElementById('tabela-pix');
    if(tabelaPix.lastChild) {
        tabelaPix.removeChild(tabelaPix.lastChild);
        salvarDados();
        atualizarTotal();
    }
}

function atualizarTotal() {
    let total = 0;
    document.querySelectorAll("#tabela-pix tr").forEach(linha => {
        const valorTexto = linha.cells[1]?.innerText.replace("R$", "").trim();
        if (valorTexto) {
            total += parseFloat(valorTexto);
        }
    });
    document.getElementById("total-pix").innerText = `Total: R$ ${total.toFixed(2)}`;
}

function limparDados() {
    document.getElementById("tabela-pix").innerHTML = "";
    salvarDados();
    atualizarTotal();
}

function salvarDados() {
    const dados = [];
    document.querySelectorAll("#tabela-pix tr").forEach(linha => {
        const nome = linha.cells[0]?.innerText;
        const valor = linha.cells[1]?.innerText;
        const data = linha.cells[2]?.innerText;
        if(nome && valor && data) {
            dados.push({ nome, valor, data });
        }
    });
    localStorage.setItem("dadosPix", JSON.stringify(dados));
}

function carregarDados() {
    const dadosPix = JSON.parse(localStorage.getItem("dadosPix")) || [];
    const tabelaPix = document.getElementById("tabela-pix");
    tabelaPix.innerHTML = "";
    dadosPix.forEach(({ nome, valor, data }) => {
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
            <td>${nome}</td>
            <td>${valor}</td>
            <td>${data}</td>
            <td><button class="btn-remover" onclick="removerLinha(this)">X</button></td>
        `;
        tabelaPix.appendChild(novaLinha);
    });
    atualizarTotal();
}

//Função imprimir
function imprimirTabela() {
    try {
        let impressora = window.OBJ_Impressora;

        // Configura modelo de impressora (7 = MP-4200 TH)
        impressora.ConfiguraModeloImpressora(7);

        // Inicia a comunicação com a impressora via USB
        if (!impressora.IniciaPorta("USB")) {
            alert("Erro ao conectar com a impressora.");
            return;
        }

        // Cabeçalho
        impressora.ImprimeTexto("SISTEMA ANOTAÇÕES PIX\n", 2, 0, 0, 1, 0);
        impressora.ImprimeTexto("--------------------------------\n", 1, 0, 0, 0, 0);

        // Tabela de Anotações
        document.querySelectorAll("#tabela-pix tr").forEach(linha => {
            const data = linha.cells[2]?.innerText;
            const nome = linha.cells[0]?.innerText.padEnd(15, ' ');
            const valor = linha.cells[1]?.innerText.padStart(10, ' ');
            const textoLinha = `${data} ${nome} ${valor}\n`;
            impressora.ImprimeTexto(textoLinha, 1, 0, 0, 0, 0);
        });

        // Rodapé com o total
        impressora.ImprimeTexto("--------------------------------\n", 1, 0, 0, 0, 0);
        impressora.ImprimeTexto(document.getElementById("total-pix").innerText + "\n", 2, 0, 1, 1, 0);

        // Alimenta o papel e corta automaticamente
        impressora.AvancaPapel(5);
        impressora.CortaPapel(0);
        
        // Fecha a conexão com a impressora
        impressora.FechaPorta();
    } catch (e) {
        alert("Erro ao imprimir. Verifique a conexão com a impressora.");
    }
}


