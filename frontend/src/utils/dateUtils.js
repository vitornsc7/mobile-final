export function obterMesReferenciaAtual() {
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  return `${ano}-${mes}`;
}

export function formatarMesReferencia(mesReferencia, exibirAno = true) {
  const nomesMeses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const [ano, mes] = mesReferencia.split('-');
  const indiceMes = Number(mes) - 1;

  if (!ano || indiceMes < 0 || indiceMes > 11) {
    return mesReferencia;
  }

  return exibirAno ? `${nomesMeses[indiceMes]}/${ano}` : nomesMeses[indiceMes];
}

export function gerarMesesDisponiveis() {
  const dataInicial = new Date();
  const anoAtual = dataInicial.getFullYear();
  const mesAtual = dataInicial.getMonth();
  const quantidadeMeses = 12 - mesAtual;

  return Array.from({ length: quantidadeMeses }, (_, indice) => {
    const data = new Date(anoAtual, mesAtual + indice, 1);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const valor = `${ano}-${mes}`;

    return {
      valor,
      rotulo: formatarMesReferencia(valor, false),
    };
  });
}

export function mesReferenciaAnterior(mesReferencia) {
  return mesReferencia < obterMesReferenciaAtual();
}

export function validarMesReferencia(mesReferencia) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(mesReferencia);
}
