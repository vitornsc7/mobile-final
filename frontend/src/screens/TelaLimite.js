import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Campo } from '../components/Campo';
import { SeletorMesAno } from '../components/SeletorMesAno';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { formatarMoeda } from '../utils/currencyUtils';
import { formatarMesReferencia } from '../utils/dateUtils';

export function TelaLimite({
  mesSelecionado,
  limites,
  formularioLimite,
  mensagemErro,
  limiteEmEdicao,
  aoAlterarFormulario,
  aoSalvar,
  aoEditar,
  aoExcluir,
  aoSelecionarMesConsulta,
  aoCancelarEdicao,
}) {
  return (
    <View style={estilos.tela}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.eyebrow}>Planejamento</Text>
        <Text style={estilos.titulo}>Limites</Text>
        <Text style={estilos.subtitulo}>Defina o teto mensal e acompanhe seu histórico.</Text>
      </View>

      <View style={estilos.card}>
        <View style={estilos.cabecalhoCard}>
          <Text style={estilos.tituloCard}>{limiteEmEdicao ? 'Editar limite' : 'Novo limite'}</Text>
          {limiteEmEdicao && <Text style={estilos.badge}>Editando</Text>}
        </View>

        <Campo
          rotulo="Valor"
          valor={formularioLimite.valor}
          aoAlterarTexto={(v) => aoAlterarFormulario('valor', v)}
          dica="Ex: 1200.00"
          tipoTeclado="numeric"
        />

        {Boolean(mensagemErro) && <Text style={estilos.mensagemErro}>{mensagemErro}</Text>}

        <View style={estilos.campo}>
          <Text style={estilos.rotuloCampo}>Mês de referência</Text>
          <SeletorMesAno
            valor={formularioLimite.mesReferencia}
            aoSelecionar={(v) => aoAlterarFormulario('mesReferencia', v)}
          />
        </View>

        <Pressable style={estilos.botaoPrimario} onPress={aoSalvar}>
          <Text style={estilos.textoBotaoPrimario}>
            {limiteEmEdicao ? 'Atualizar limite' : 'Salvar limite'}
          </Text>
        </Pressable>
        {limiteEmEdicao && (
          <Pressable style={estilos.botaoTexto} onPress={aoCancelarEdicao}>
            <Text style={estilos.textoBotaoTexto}>Cancelar edição</Text>
          </Pressable>
        )}
      </View>

      <View style={estilos.cabecalhoHistorico}>
        <Text style={estilos.tituloSecao}>Histórico</Text>
        <Text style={estilos.subtituloSecao}>{limites.length} limites</Text>
      </View>

      <View style={estilos.filtroMes}>
        <SeletorMesAno valor={mesSelecionado} aoSelecionar={aoSelecionarMesConsulta} />
      </View>

      {limites.length === 0 ? (
        <View style={estilos.vazio}>
          <Text style={estilos.vazioTitulo}>Nenhum limite encontrado</Text>
          <Text style={estilos.vazioTexto}>Defina um orçamento mensal para visualizar o acompanhamento.</Text>
        </View>
      ) : (
        limites.map((limite) => (
          <View key={limite.id} style={estilos.item}>
            <View style={estilos.icone}>
              <Text style={estilos.iconeTexto}>R$</Text>
            </View>
            <View style={estilos.itemConteudo}>
              <Text style={estilos.itemTitulo}>{formatarMesReferencia(limite.mesReferencia, true)}</Text>
              <Text style={estilos.itemSubtitulo}>Orçamento mensal</Text>
              <View style={estilos.acoes}>
                <Pressable style={estilos.botaoAcao} onPress={() => aoEditar(limite)}>
                  <Text style={estilos.textoBotaoAcao}>Editar</Text>
                </Pressable>
                <Pressable style={[estilos.botaoAcao, estilos.botaoExcluir]} onPress={() => aoExcluir(limite)}>
                  <Text style={[estilos.textoBotaoAcao, estilos.textoExcluir]}>Excluir</Text>
                </Pressable>
              </View>
            </View>
            <Text style={estilos.itemValor}>{formatarMoeda(limite.valor)}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { paddingVertical: 8 },
  cabecalho: { marginBottom: 20 },
  eyebrow: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  titulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 36,
    fontWeight: '900',
    color: CORES.preto,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 13,
    fontWeight: '500',
    color: CORES.cinzaEscuro,
    lineHeight: 18,
  },
  card: {
    backgroundColor: CORES.branco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 16,
    marginTop: 16,
    marginBottom: 28,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tituloCard: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 16,
    fontWeight: '900',
    color: CORES.preto,
  },
  badge: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.verdeEscuro,
    backgroundColor: CORES.verdeClaro,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  campo: { marginBottom: 16 },
  rotuloCampo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  mensagemErro: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 13,
    fontWeight: '600',
    color: CORES.vermelhoEscuro,
    backgroundColor: CORES.vermelhoClaro,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: CORES.vermelho,
    marginBottom: 12,
  },
  botaoPrimario: {
    height: 52,
    backgroundColor: CORES.acento,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotaoPrimario: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.preto,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  botaoTexto: { alignItems: 'center', paddingVertical: 12 },
  textoBotaoTexto: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.cinzaEscuro,
    fontWeight: '700',
    fontSize: 13,
  },
  cabecalhoHistorico: {
    marginBottom: 12,
  },
  tituloSecao: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 22,
    fontWeight: '900',
    color: CORES.preto,
    letterSpacing: -0.3,
  },
  subtituloSecao: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 12,
    fontWeight: '600',
    color: CORES.cinzaEscuro,
    marginTop: 2,
  },
  filtroMes: { marginBottom: 12 },
  vazio: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  vazioTitulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 15,
    fontWeight: '900',
    color: CORES.preto,
  },
  vazioTexto: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 13,
    color: CORES.cinzaEscuro,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  item: {
    marginTop: 8,
    backgroundColor: CORES.branco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  icone: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: CORES.acentoSuave,
    borderWidth: 1,
    borderColor: CORES.acento,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTexto: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.verdeEscuro,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  itemConteudo: { flex: 1 },
  itemTitulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 15,
    fontWeight: '800',
    color: CORES.preto,
  },
  itemSubtitulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 12,
    fontWeight: '600',
    color: CORES.cinzaEscuro,
    marginTop: 2,
  },
  acoes: { flexDirection: 'row', gap: 6, marginTop: 10 },
  botaoAcao: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  botaoExcluir: {
    borderColor: CORES.vermelhoClaro,
    backgroundColor: CORES.vermelhoClaro,
  },
  textoBotaoAcao: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.texto,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  textoExcluir: { color: CORES.vermelho },
  itemValor: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 15,
    fontWeight: '900',
    color: CORES.preto,
  },
});
