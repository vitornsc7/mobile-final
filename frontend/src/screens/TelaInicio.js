import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from '../components/ChevronDown';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { formatarMoeda } from '../utils/currencyUtils';
import { gerarMesesDisponiveis, obterMesReferenciaAtual } from '../utils/dateUtils';

export function TelaInicio({
  mesSelecionado,
  mesesCadastrados,
  seletorMesAberto,
  totalDespesas,
  limiteAtual,
  aoAbrirSeletorMes,
  aoFecharSeletorMes,
  aoSelecionarMes,
  aoIrParaDespesa,
  aoIrParaLimite,
}) {
  const mesesDisponiveis = gerarMesesDisponiveis();
  const mesSelecionadoRotulo = mesesDisponiveis.find((mes) => mes.valor === mesSelecionado)?.rotulo || mesSelecionado;
  const aoAlternarSeletorMes = seletorMesAberto ? aoFecharSeletorMes : aoAbrirSeletorMes;
  const possuiLimite = Boolean(limiteAtual);
  const valorLimite = Number(limiteAtual?.valor || 0);
  const mesFinalizado = mesSelecionado < obterMesReferenciaAtual();
  const economizou = possuiLimite && totalDespesas <= valorLimite;
  const progresso = possuiLimite ? Math.min(totalDespesas / valorLimite, 1) : 0;

  const temQualquerFinanca = mesesCadastrados.length > 0;
  const mesTemFinancas = mesSelecionado && mesesCadastrados.includes(mesSelecionado);
  const progressoNaoEncontrado = Boolean(mesSelecionado) && !mesTemFinancas;

  let titulo = 'Nenhuma finança registrada!';
  let mensagem = 'Cadastre um limite e registre suas despesas!';
  let resultado = '';
  let estiloTom = estilos.feedbackInformativo;

  if (progressoNaoEncontrado) {
    titulo = 'Progresso não encontrado';
    mensagem = 'Nenhum limite ou despesa foi cadastrado para esse mês.';
  } else if (!temQualquerFinanca) {
    // permanece como 'Nenhuma finança registrada!'
  } else if (possuiLimite && economizou) {
    titulo = mesFinalizado ? 'Parabéns, você economizou' : 'Continue assim!';
    mensagem = `Você está dentro do limite estabelecido!`;
    resultado = mesFinalizado ? `+${formatarMoeda(valorLimite - totalDespesas)}` : '';
    estiloTom = estilos.feedbackSucesso;
  } else if (possuiLimite && !economizou) {
    titulo = mesFinalizado ? 'Objetivo não atingido!' : 'Atenção!';
    mensagem = `Você excedeu o limite`;
    resultado = mesFinalizado ? `-${formatarMoeda(totalDespesas - valorLimite)}` : '';
    estiloTom = estilos.feedbackErro;
  }

  return (
    <View>
      <Text style={estilos.saudacao}>Olá, João 👋</Text>
      <Text style={estilos.textoAjuda}>É bom te ver por aqui!</Text>

      {mesesDisponiveis.length > 0 && (
        <View>
          <View style={estilos.buscaMes}>
            <Pressable
              style={[estilos.entradaSelecao, seletorMesAberto && estilos.entradaSelecaoAberta]}
              onPress={aoAlternarSeletorMes}
            >
              <Text style={mesSelecionado ? estilos.textoSelectMes : estilos.textoSelectMesVazio}>
                {mesSelecionadoRotulo || 'Selecione o mês desejado'}
              </Text>
            </Pressable>
            <Pressable style={estilos.botaoChevron} onPress={aoAlternarSeletorMes}>
              <ChevronDown style={estilos.textoChevron} />
            </Pressable>
          </View>

          {seletorMesAberto && (
            <View style={estilos.dropdownContainer}>
              <ScrollView
                style={estilos.dropdownScroll}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                {mesesDisponiveis.map((mes) => (
                  <Pressable
                    key={mes.valor}
                    style={[estilos.opcaoMes, mes.valor === mesSelecionado && estilos.opcaoMesAtiva]}
                    onPress={() => aoSelecionarMes(mes.valor)}
                  >
                    <Text style={[estilos.textoOpcaoMes, mes.valor === mesSelecionado && estilos.textoOpcaoMesAtiva]}>
                      {mes.rotulo}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      <View style={[estilos.cartaoFeedback, !temQualquerFinanca && estilos.cartaoFeedbackVazio, estiloTom]}>
        <Text style={estilos.rostoFeedback}>{possuiLimite ? (economizou ? '🙂' : '😢') : '😴'}</Text>
        <Text style={estilos.tituloFeedback}>{titulo}</Text>
        {Boolean(resultado) && <Text style={estilos.resultadoFeedback}>{resultado}</Text>}
        <Text style={estilos.textoFeedback}>{mensagem}</Text>

        {!temQualquerFinanca ? (
          <View style={estilos.acoesComecarRegistros}>
            <Pressable style={estilos.botaoComecarPrimario} onPress={aoIrParaDespesa}>
              <Text style={estilos.textoBotaoComecarPrimario}>Nova despesa</Text>
            </Pressable>
            <Pressable style={estilos.botaoComecarSecundario} onPress={aoIrParaLimite}>
              <Text style={estilos.textoBotaoComecarSecundario}>Novo limite</Text>
            </Pressable>
          </View>
        ) : (
          !possuiLimite && (
            <Pressable style={estilos.botaoFeedback} onPress={aoIrParaLimite}>
              <Text style={estilos.textoBotaoFeedback}>Começar</Text>
            </Pressable>
          )
        )}
      </View>

      <View style={estilos.cabecalhoProgresso}>
        <Text style={estilos.rotuloProgresso}>Progresso</Text>
        <Text style={estilos.rotuloProgresso}>
          {possuiLimite ? `${formatarMoeda(totalDespesas)} / ${formatarMoeda(valorLimite)}` : formatarMoeda(totalDespesas)}
        </Text>
      </View>
      <View style={estilos.trilhaProgresso}>
        <View style={[estilos.preenchimentoProgresso, { width: `${possuiLimite ? progresso * 100 : 0}%` }]} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  saudacao: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 26,
    fontWeight: '900',
    color: CORES.texto,
  },
  textoAjuda: {
    fontFamily: FONTE_PRINCIPAL,
    marginTop: 6,
    color: CORES.textoSuave,
    fontSize: 14,
  },
  buscaMes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 42,
    marginBottom: 0,
    position: 'relative',
  },
  entradaSelecao: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingRight: 42,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  entradaSelecaoAberta: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textoSelectMes: {
    color: CORES.texto,
    fontSize: 16,
  },
  textoSelectMesVazio: {
    color: CORES.textoSuave,
    fontSize: 16,
  },
  botaoChevron: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  textoChevron: {
    color: CORES.texto,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 24,
  },
  fundoModalSelect: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalSelect: {
    backgroundColor: CORES.branco,
    borderRadius: 12,
    padding: 18,
  },
  tituloModalSelect: {
    color: CORES.texto,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  opcaoMes: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    marginTop: 8,
  },
  opcaoMesAtiva: {
    backgroundColor: CORES.verdeCard,
  },
  textoOpcaoMes: {
    color: CORES.texto,
    fontWeight: '800',
  },
  textoOpcaoMesAtiva: {
    color: CORES.branco,
  },
  dropdownContainer: {
    marginTop: -1,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.branco,
    maxHeight: 220,
    overflow: 'hidden',
  },
  dropdownScroll: {
    padding: 8,
  },
  cartaoFeedback: {
    minHeight: 190,
    marginTop: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cartaoFeedbackVazio: {
    marginTop: 24,
  },
  feedbackSucesso: {
    backgroundColor: CORES.verdeCard,
  },
  feedbackErro: {
    backgroundColor: '#f3b3bd',
  },
  feedbackInformativo: {
    backgroundColor: CORES.verdeCard,
  },
  rostoFeedback: {
    fontSize: 56,
    fontWeight: '900',
    color: CORES.texto,
    textAlign: 'center',
    lineHeight: 70,
  },
  tituloFeedback: {
    fontFamily: FONTE_PRINCIPAL,
    marginTop: 8,
    color: CORES.texto,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  resultadoFeedback: {
    fontFamily: FONTE_PRINCIPAL,
    marginTop: 4,
    color: CORES.texto,
    fontSize: 24,
    fontWeight: '900',
  },
  textoFeedback: {
    fontFamily: FONTE_PRINCIPAL,
    marginTop: 8,
    color: CORES.texto,
    textAlign: 'center',
    fontWeight: '700',
  },
  acoesComecarRegistros: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 18,
  },
  botaoComecarPrimario: {
    flex: 1,
    backgroundColor: CORES.branco,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoBotaoComecarPrimario: {
    color: CORES.verde,
    fontWeight: '900',
  },
  botaoComecarSecundario: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.branco,
  },
  textoBotaoComecarSecundario: {
    color: CORES.branco,
    fontWeight: '900',
  },
  botaoFeedback: {
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: CORES.roxo,
    paddingHorizontal: 34,
    paddingVertical: 11,
  },
  textoBotaoFeedback: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.branco,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  cabecalhoProgresso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  rotuloProgresso: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.texto,
    fontSize: 12,
  },
  trilhaProgresso: {
    height: 32,
    marginTop: 6,
    backgroundColor: '#d9d9d9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  preenchimentoProgresso: {
    height: '100%',
    backgroundColor: CORES.verdeCard,
    borderRadius: 12,
  },
});
