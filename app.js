const form = document.getElementById("formTransacao");
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const tipoInput = document.getElementById("tipo");
const tabelaBody = document.getElementById("tabelaTransacoes");
const vazio = document.getElementById("vazio");
const receitasTotalEl = document.getElementById("receitasTotal");
const despesasTotalEl = document.getElementById("despesasTotal");
const saldoTotalEl = document.getElementById("saldoTotal");

let transacoes = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const descricao = descricaoInput.value.trim();
  const valor = parseFloat(valorInput.value);
  const tipo = tipoInput.value;

  if (!descricao || isNaN(valor) || valor <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const transacao = {
    id: Date.now(),
    descricao,
    valor,
    tipo,
  };

  transacoes.unshift(transacao);
  salvar();
  renderizar();

  descricaoInput.value = "";
  valorInput.value = "";
  tipoInput.value = "receita";
  descricaoInput.focus();
});

function excluir(id) {
  if (!confirm("Tem certeza que deseja excluir esta transação?")) return;
  transacoes = transacoes.filter((t) => t.id !== id);
  salvar();
  renderizar();
}

function formatarValor(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function renderizar() {
  tabelaBody.innerHTML = "";

  if (transacoes.length === 0) {
    vazio.style.display = "block";
  } else {
    vazio.style.display = "none";

    transacoes.forEach((t) => {
      const tr = document.createElement("tr");

      const tipoClasse = t.tipo === "receita" ? "tipo-receita" : "tipo-despesa";
      const tipoTexto = t.tipo === "receita" ? "Receita" : "Despesa";

      tr.innerHTML = `
        <td>${t.descricao}</td>
        <td><span class="${tipoClasse}">${tipoTexto}</span></td>
        <td>${formatarValor(t.valor)}</td>
        <td><button class="btn-excluir" onclick="excluir(${t.id})">Excluir</button></td>
      `;

      tabelaBody.appendChild(tr);
    });
  }

  atualizarResumo();
}

function atualizarResumo() {
  const receitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);
  const despesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);
  const saldo = receitas - despesas;

  receitasTotalEl.textContent = formatarValor(receitas);
  despesasTotalEl.textContent = formatarValor(despesas);
  saldoTotalEl.textContent = formatarValor(saldo);

  if (saldo >= 0) {
    saldoTotalEl.style.color = "#16a34a";
  } else {
    saldoTotalEl.style.color = "#dc2626";
  }
}

function salvar() {
  try {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  } catch (e) {
    console.warn("Não foi possível salvar no localStorage:", e);
  }
}

function carregar() {
  try {
    const dados = localStorage.getItem("transacoes");
    if (dados) {
      transacoes = JSON.parse(dados);
    }
  } catch (e) {
    console.warn("Não foi possível carregar do localStorage:", e);
  }
}

carregar();
renderizar();
