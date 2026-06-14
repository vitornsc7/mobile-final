import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SeletorMesAno } from '../components/SeletorMesAno';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { formatarMoeda } from '../utils/currencyUtils';
import { obterMesReferenciaAtual } from '../utils/dateUtils';

export function TelaInicio({
  usuario,
  mesSelecionado,
  mesesCadastrados,
  totalDespesas,
  limiteAtual,
  aoSelecionarMes,
  aoIrParaDespesa,
  aoIrParaLimite,
}) {
  const possuiLimite = Boolean(limiteAtual);
  const valorLimite = Number(limiteAtual?.valor || 0);
  const mesFinalizado = mesSelecionado < obterMesReferenciaAtual();
  const economizou = possuiLimite && totalDespesas <= valorLimite;
  const progresso = possuiLimite ? Math.min(totalDespesas / valorLimite, 1) : 0;
  const saldoDisponivel = valorLimite - totalDespesas;

  const temQualquerFinanca = mesesCadastrados.length > 0;
  const mesTemFinancas = mesSelecionado && mesesCadastrados.includes(mesSelecionado);
  const progressoNaoEncontrado = Boolean(mesSelecionado) && !mesTemFinancas;

  let titulo = 'Nenhuma fiança registrada';
  let mensagem = 'Cadastre um limite e registre suas despesas para acompanhar sua evolução.';
  let resultado = '';
  let status = 'Comece agora';
  let estiloTopoBorda = estilos.bordaInfo;

  if (progressoNaoEncontrado) {
    titulo = 'Progresso não encontrado';
    mensagem = 'Nenhum limite ou despesa foi cadastrado para esse mês.';
    status = 'Sem dados';
  } else if (!temQualquerFinanca) {
    // estado inicial
  } else if (possuiLimite && economizou) {
    titulo = mesFinalizado ? 'Meta concluída' : 'Dentro do planejado';
    mensagem = 'Você está abaixo do limite definido para este mês.';
    resultado = mesFinalizado ? `+${formatarMoeda(saldoDisponivel)}` : formatarMoeda(Math.max(saldoDisponivel, 0));
    status = mesFinalizado ? 'Economia final' : 'Disponível';
    estiloTopoBorda = estilos.bordaSucesso;
  } else if (possuiLimite && !economizou) {
    titulo = mesFinalizado ? 'Meta não atingida' : 'Limite ultrapassado';
    mensagem = 'Você excedeu o limite definido. Revise os gastos recentes.';
    resultado = mesFinalizado
      ? `-${formatarMoeda(totalDespesas - valorLimite)}`
      : formatarMoeda(totalDespesas - valorLimite);
    status = mesFinalizado ? 'Excedido' : 'Acima do limite';
    estiloTopoBorda = estilos.bordaErro;
  }

  return (
    <View>
      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.rotuloBoas}>Olá,</Text>
          <Text style={estilos.nomeBoas}>{usuario?.nome ?? ''}</Text>
        </View>
      </View>

      <View style={estilos.blocoMes}>
        <Text style={estilos.rotuloCampo}>Período</Text>
        <SeletorMesAno valor={mesSelecionado} aoSelecionar={aoSelecionarMes} />
      </View>

      <View style={[estilos.cartaoStatus, estiloTopoBorda]}>
        <View style={estilos.linhaStatus}>
          <Text style={estilos.tagStatus}>{status}</Text>
          <Text style={estilos.textoPercentual}>
            {possuiLimite ? `${Math.round(progresso * 100)}% usado` : 'Sem limite'}
          </Text>
        </View>
        <Text style={estilos.tituloStatus}>{titulo}</Text>
        {Boolean(resultado) && <Text style={estilos.resultadoStatus}>{resultado}</Text>}
        <Text style={estilos.mensagemStatus}>{mensagem}</Text>

        {!temQualquerFinanca ? (
          <View style={estilos.acoesBoas}>
            <Pressable style={estilos.botaoPrimario} onPress={aoIrParaDespesa}>
              <Text style={estilos.textoBotaoPrimario}>Nova despesa</Text>
            </Pressable>
            <Pressable style={estilos.botaoSecundario} onPress={aoIrParaLimite}>
              <Text style={estilos.textoBotaoSecundario}>Novo limite</Text>
            </Pressable>
          </View>
        ) : (
          !possuiLimite && (
            <Pressable style={estilos.botaoCriarLimite} onPress={aoIrParaLimite}>
              <Text style={estilos.textoBotaoCriarLimite}>Criar limite</Text>
            </Pressable>
          )
        )}
      </View>

      <View style={estilos.grade}>
        <View style={estilos.metrica}>
          <Text style={estilos.rotuloMetrica}>Despesas</Text>
          <Text style={[estilos.valorMetrica, estilos.valorDespesa]}>{formatarMoeda(totalDespesas)}</Text>
        </View>
        <View style={estilos.metrica}>
          <Text style={estilos.rotuloMetrica}>Limite mensal</Text>
          <Text style={estilos.valorMetrica}>
            {possuiLimite ? formatarMoeda(valorLimite) : '-'}
          </Text>
        </View>
      </View>

      <View style={estilos.cartaoProgresso}>
        <View style={estilos.linhaProgresso}>
          <Text style={estilos.rotuloProgresso}>Orçamento utilizado</Text>
          <Text style={estilos.rotuloProgresso}>
            {possuiLimite
              ? `${formatarMoeda(totalDespesas)} / ${formatarMoeda(valorLimite)}`
              : formatarMoeda(totalDespesas)}
          </Text>
        </View>
        <View style={estilos.trilha}>
          <View
            style={[
              estilos.fill,
              !economizou && possuiLimite && estilos.fillErro,
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rotuloBoas: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 13,
    fontWeight: '600',
    color: CORES.cinzaEscuro,
    marginBottom: 2,
  },
  nomeBoas: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 28,
    fontWeight: '900',
    color: CORES.preto,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: CORES.preto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetra: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.acento,
    fontSize: 18,
    fontWeight: '900',
  },
  blocoMes: {
    marginBottom: 16,
  },
  rotuloCampo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  cartaoStatus: {
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderTopWidth: 4,
    borderRadius: 8,
    padding: 18,
    marginBottom: 10,
  },
  bordaInfo: { borderTopColor: CORES.preto },
  bordaSucesso: { borderTopColor: CORES.acento },
  bordaErro: { borderTopColor: CORES.vermelho },
  linhaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tagStatus: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: CORES.cinzaClaro,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  textoPercentual: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 12,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
  },
  tituloStatus: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 22,
    fontWeight: '900',
    color: CORES.preto,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  resultadoStatus: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 34,
    fontWeight: '900',
    color: CORES.preto,
    letterSpacing: -1,
    marginBottom: 6,
  },
  mensagemStatus: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 13,
    fontWeight: '500',
    color: CORES.cinzaEscuro,
    lineHeight: 18,
  },
  acoesBoas: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  botaoPrimario: {
    flex: 1,
    height: 46,
    backgroundColor: CORES.acento,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoPrimario: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.preto,
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  botaoSecundario: {
    flex: 1,
    height: 46,
    borderWidth: 1.5,
    borderColor: CORES.preto,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoSecundario: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.preto,
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  botaoCriarLimite: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: CORES.acento,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textoBotaoCriarLimite: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.preto,
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grade: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  metrica: {
    flex: 1,
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 8,
    padding: 14,
  },
  rotuloMetrica: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  valorMetrica: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 18,
    fontWeight: '900',
    color: CORES.preto,
  },
  valorDespesa: {
    color: CORES.vermelho,
  },
  cartaoProgresso: {
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 8,
    padding: 14,
  },
  linhaProgresso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rotuloProgresso: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  trilha: {
    height: 8,
    backgroundColor: CORES.cinzaClaro,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    backgroundColor: CORES.acento,
    borderRadius: 4,
  },
  fillErro: {
    backgroundColor: CORES.vermelho,
  },
});