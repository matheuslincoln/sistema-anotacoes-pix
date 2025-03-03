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
    window.print();
}


