import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from '../components/ChevronDown';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { formatarMoeda } from '../utils/currencyUtils';
import { formatarMesReferencia, obterMesReferenciaAtual } from '../utils/dateUtils';

export function TelaInicio({
  usuario,
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
  const mesesDisponiveis = mesesCadastrados.map((valor) => ({
    valor,
    rotulo: formatarMesReferencia(valor, true),
  }));
  const mesSelecionadoRotulo = mesesDisponiveis.find((mes) => mes.valor === mesSelecionado)?.rotulo || mesSelecionado;
  const aoAlternarSeletorMes = seletorMesAberto ? aoFecharSeletorMes : aoAbrirSeletorMes;
  const possuiLimite = Boolean(limiteAtual);
  const valorLimite = Number(limiteAtual?.valor || 0);
  const mesFinalizado = mesSelecionado < obterMesReferenciaAtual();
  const economizou = possuiLimite && totalDespesas <= valorLimite;
  const progresso = possuiLimite ? Math.min(totalDespesas / valorLimite, 1) : 0;
  const saldoDisponivel = valorLimite - totalDespesas;

  const temQualquerFinanca = mesesCadastrados.length > 0;
  const mesTemFinancas = mesSelecionado && mesesCadastrados.includes(mesSelecionado);
  const progressoNaoEncontrado = Boolean(mesSelecionado) && !mesTemFinancas;

  let titulo = 'Nenhuma finança registrada';
  let mensagem = 'Cadastre um limite e registre suas despesas para acompanhar sua evolução.';
  let resultado = '';
  let status = 'Comece agora';
  let estiloTom = estilos.feedbackInformativo;

  if (progressoNaoEncontrado) {
    titulo = 'Progresso não encontrado';
    mensagem = 'Nenhum limite ou despesa foi cadastrado para esse mês.';
    status = 'Sem dados';
  } else if (!temQualquerFinanca) {
    // Mantem o estado inicial.
  } else if (possuiLimite && economizou) {
    titulo = mesFinalizado ? 'Meta concluída' : 'Dentro do planejado';
    mensagem = 'Você está abaixo do limite definido para este mês.';
    resultado = mesFinalizado ? `+${formatarMoeda(saldoDisponivel)}` : formatarMoeda(Math.max(saldoDisponivel, 0));
    status = mesFinalizado ? 'Economia final' : 'Disponível';
    estiloTom = estilos.feedbackSucesso;
  } else if (possuiLimite && !economizou) {
    titulo = mesFinalizado ? 'Meta não atingida' : 'Limite ultrapassado';
    mensagem = 'Você excedeu o limite definido. Revise os gastos recentes.';
    resultado = mesFinalizado ? `-${formatarMoeda(totalDespesas - valorLimite)}` : formatarMoeda(totalDespesas - valorLimite);
    status = mesFinalizado ? 'Excedido' : 'Acima do limite';
    estiloTom = estilos.feedbackErro;
  }

  return (
    <View>
      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.saudacao}>Olá, {usuario?.nome ?? ''}</Text>
          <Text style={estilos.textoAjuda}>Seu painel financeiro em tempo real.</Text>
        </View>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarTexto}>{usuario?.nome?.charAt(0)?.toUpperCase() ?? '?'}</Text>
        </View>
      </View>

      {mesesDisponiveis.length > 0 && (
        <View style={estilos.blocoMes}>
          <Text style={estilos.rotuloCampo}>Período de análise</Text>
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
              <ScrollView style={estilos.dropdownScroll} showsVerticalScrollIndicator={false}>
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

      <View style={[estilos.cartaoFeedback, estiloTom]}>
        <View style={estilos.linhaStatus}>
          <Text style={estilos.badgeStatus}>{status}</Text>
          <Text style={estilos.percentual}>{possuiLimite ? `${Math.round(progresso * 100)}% usado` : 'Sem limite'}</Text>
        </View>
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
              <Text style={estilos.textoBotaoFeedback}>Criar limite</Text>
            </Pressable>
          )
        )}
      </View>

      <View style={estilos.gradeMetricas}>
        <View style={estilos.metricaCard}>
          <Text style={estilos.rotuloMetrica}>Despesas</Text>
          <Text style={[estilos.valorMetrica, estilos.valorDespesa]}>{formatarMoeda(totalDespesas)}</Text>
        </View>
        <View style={estilos.metricaCard}>
          <Text style={estilos.rotuloMetrica}>Limite mensal</Text>
          <Text style={estilos.valorMetrica}>{possuiLimite ? formatarMoeda(valorLimite) : 'Não definido'}</Text>
        </View>
      </View>

      <View style={estilos.progressoCard}>
        <View style={estilos.cabecalhoProgresso}>
          <Text style={estilos.rotuloProgresso}>Uso do orçamento</Text>
          <Text style={estilos.rotuloProgresso}>
            {possuiLimite ? `${formatarMoeda(totalDespesas)} / ${formatarMoeda(valorLimite)}` : formatarMoeda(totalDespesas)}
          </Text>
        </View>
        <View style={estilos.trilhaProgresso}>
          <View
            style={[
              estilos.preenchimentoProgresso,
              !economizou && possuiLimite && estilos.preenchimentoProgressoErro,
              { width: `${possuiLimite ? progresso * 100 : 0}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  saudacao: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 28,
    fontWeight: '900',
    color: CORES.texto,
  },
  textoAjuda: {
    fontFamily: FONTE_PRINCIPAL,
    marginTop: 6,
    color: CORES.textoSuave,
    fontSize: 14,
    fontWeight: '600',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: CORES.azul,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CORES.azul,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  avatarTexto: {
    color: CORES.branco,
    fontWeight: '900',
    fontSize: 18,
  },
  blocoMes: {
    marginTop: 28,
  },
  rotuloCampo: {
    color: CORES.cinzaEscuro,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  buscaMes: {
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
  },
  entradaSelecao: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingRight: 44,
    backgroundColor: CORES.superficie,
    justifyContent: 'center',
  },
  entradaSelecaoAberta: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textoSelectMes: {
    color: CORES.texto,
    fontSize: 15,
    fontWeight: '800',
  },
  textoSelectMesVazio: {
    color: CORES.textoSuave,
    fontSize: 15,
    fontWeight: '700',
  },
  botaoChevron: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  textoChevron: {
    color: CORES.texto,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 22,
  },
  opcaoMes: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: CORES.cinzaClaro,
    marginTop: 8,
  },
  opcaoMesAtiva: {
    backgroundColor: CORES.azul,
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
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.superficie,
    maxHeight: 220,
    overflow: 'hidden',
  },
  dropdownScroll: {
    padding: 8,
  },
  cartaoFeedback: {
    minHeight: 210,
    marginTop: 18,
    borderRadius: 26,
    padding: 22,
    overflow: 'hidden',
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 26,
    elevation: 8,
  },
  feedbackSucesso: {
    backgroundColor: CORES.mentaClaro,
  },
  feedbackErro: {
    backgroundColor: CORES.vermelhoClaro,
  },
  feedbackInformativo: {
    backgroundColor: CORES.roxoClaro,
  },
  linhaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  badgeStatus: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    color: CORES.roxoEscuro,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 12,
    fontWeight: '900',
  },
  percentual: {
    color: CORES.textoSuave,
    fontSize: 12,
    fontWeight: '800',
  },
  tituloFeedback: {
    fontFamily: FONTE_PRINCIPAL,
    marginTop: 26,
    color: CORES.texto,
    fontSize: 24,
    fontWeight: '900',
  },
  resultadoFeedback: {
    fontFamily: FONTE_PRINCIPAL,
    marginTop: 6,
    color: CORES.texto,
    fontSize: 34,
    fontWeight: '900',
  },
  textoFeedback: {
    fontFamily: FONTE_PRINCIPAL,
    marginTop: 10,
    color: CORES.textoSuave,
    fontWeight: '700',
    lineHeight: 20,
  },
  acoesComecarRegistros: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 22,
  },
  botaoComecarPrimario: {
    flex: 1,
    backgroundColor: CORES.roxo,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
  },
  textoBotaoComecarPrimario: {
    color: CORES.branco,
    fontWeight: '900',
  },
  botaoComecarSecundario: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.46)',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(111, 75, 216, 0.18)',
  },
  textoBotaoComecarSecundario: {
    color: CORES.roxoEscuro,
    fontWeight: '900',
  },
  botaoFeedback: {
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: CORES.roxo,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  textoBotaoFeedback: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.branco,
    fontWeight: '900',
  },
  gradeMetricas: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  metricaCard: {
    flex: 1,
    backgroundColor: CORES.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 16,
    overflow: 'hidden',
  },
  rotuloMetrica: {
    color: CORES.textoSuave,
    fontSize: 12,
    fontWeight: '800',
  },
  valorMetrica: {
    marginTop: 8,
    color: CORES.texto,
    fontSize: 17,
    fontWeight: '900',
  },
  valorDespesa: {
    color: CORES.vermelho,
  },
  progressoCard: {
    marginTop: 16,
    backgroundColor: CORES.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 16,
  },
  cabecalhoProgresso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rotuloProgresso: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.texto,
    fontSize: 12,
    fontWeight: '800',
  },
  trilhaProgresso: {
    height: 12,
    marginTop: 12,
    backgroundColor: CORES.azulClaro,
    borderRadius: 999,
    overflow: 'hidden',
  },
  preenchimentoProgresso: {
    height: '100%',
    backgroundColor: CORES.verdeCard,
    borderRadius: 999,
  },
  preenchimentoProgressoErro: {
    backgroundColor: CORES.vermelho,
  },
});
