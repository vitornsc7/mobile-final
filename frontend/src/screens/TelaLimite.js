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
    <View style={estilos.telaFormulario}>
      <View style={estilos.cabecalhoTela}>
        <Text style={estilos.eyebrow}>Planejamento</Text>
        <Text style={estilos.tituloTela}>Limites</Text>
        <Text style={estilos.subtituloTela}>Defina o teto mensal e acompanhe seu histórico.</Text>
      </View>

      <View style={estilos.cardFormulario}>
        <View style={estilos.cabecalhoCard}>
          <Text style={estilos.tituloCard}>{limiteEmEdicao ? 'Editar limite' : 'Novo limite'}</Text>
          {limiteEmEdicao && <Text style={estilos.badgeEdicao}>Editando</Text>}
        </View>

        <Campo
          rotulo="Valor"
          valor={formularioLimite.valor}
          aoAlterarTexto={(valor) => aoAlterarFormulario('valor', valor)}
          dica="Ex: 1200.00"
          tipoTeclado="numeric"
        />

        {Boolean(mensagemErro) && <Text style={estilos.mensagemErro}>{mensagemErro}</Text>}

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Mês de referência</Text>
          <SeletorMesAno
            valor={formularioLimite.mesReferencia}
            aoSelecionar={(v) => aoAlterarFormulario('mesReferencia', v)}
          />
        </View>

        <Pressable style={estilos.botaoPrincipal} onPress={aoSalvar}>
          <Text style={estilos.textoBotaoPrincipal}>{limiteEmEdicao ? 'Atualizar limite' : 'Salvar limite'}</Text>
        </Pressable>
        {limiteEmEdicao && (
          <Pressable style={estilos.botaoTexto} onPress={aoCancelarEdicao}>
            <Text style={estilos.rotuloBotaoTexto}>Cancelar edição</Text>
          </Pressable>
        )}
      </View>

      <View style={estilos.cabecalhoHistorico}>
        <View>
          <Text style={estilos.tituloSecao}>Histórico</Text>
          <Text style={estilos.subtituloSecao}>{limites.length} limites no período</Text>
        </View>
      </View>

      <SeletorMesAno valor={mesSelecionado} aoSelecionar={aoSelecionarMesConsulta} />

      {limites.length === 0 ? (
        <View style={estilos.estadoVazio}>
          <Text style={estilos.estadoVazioTitulo}>Nenhum limite encontrado</Text>
          <Text style={estilos.estadoVazioTexto}>Defina um orçamento mensal para visualizar o acompanhamento.</Text>
        </View>
      ) : (
        limites.map((limite) => (
          <View key={limite.id} style={estilos.linhaHistorico}>
            <View style={estilos.iconeLimite}>
              <Text style={estilos.iconeLimiteTexto}>R$</Text>
            </View>
            <View style={estilos.principalHistorico}>
              <Text style={estilos.tituloHistorico}>{formatarMesReferencia(limite.mesReferencia, true)}</Text>
              <Text style={estilos.subtituloHistorico}>Orçamento mensal</Text>
              <View style={estilos.acoesHistorico}>
                <Pressable style={estilos.botaoAcao} onPress={() => aoEditar(limite)}>
                  <Text style={estilos.textoBotaoAcao}>Editar</Text>
                </Pressable>
                <Pressable style={[estilos.botaoAcao, estilos.botaoExcluir]} onPress={() => aoExcluir(limite)}>
                  <Text style={[estilos.textoBotaoAcao, estilos.textoBotaoExcluir]}>Excluir</Text>
                </Pressable>
              </View>
            </View>
            <Text style={estilos.valorHistorico}>{formatarMoeda(limite.valor)}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  telaFormulario: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  cabecalhoTela: {
    marginBottom: 22,
  },
  eyebrow: {
    color: CORES.verde,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  tituloTela: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.texto,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  subtituloTela: {
    color: CORES.textoSuave,
    marginTop: 6,
    fontWeight: '600',
  },
  cardFormulario: {
    backgroundColor: CORES.superficie,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 18,
    overflow: 'hidden',
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tituloCard: {
    color: CORES.texto,
    fontSize: 18,
    fontWeight: '900',
  },
  badgeEdicao: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: CORES.verdeClaro,
    color: CORES.verdeEscuro,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '900',
  },
  campo: {
    marginBottom: 16,
  },
  rotulo: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.cinzaEscuro,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  mensagemErro: {
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: CORES.vermelhoClaro,
    color: CORES.vermelhoEscuro,
    fontWeight: '800',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  entradaSelectMes: {
    height: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: CORES.superficieSuave,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entradaSelectMesAberta: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textoSelectMes: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.texto,
    fontWeight: '800',
  },
  textoSelectMesVazio: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.textoSuave,
    fontWeight: '700',
  },
  chevronSelectMes: {
    color: CORES.texto,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 22,
  },
  dropdownContainer: {
    marginTop: -1,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.superficie,
    maxHeight: 180,
    overflow: 'hidden',
  },
  dropdownHistoricoContainer: {
    marginTop: -1,
    marginBottom: 12,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.superficie,
    maxHeight: 180,
    overflow: 'hidden',
  },
  dropdownScroll: {
    padding: 8,
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
  botaoPrincipal: {
    height: 54,
    borderRadius: 18,
    backgroundColor: CORES.verde,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: CORES.verde,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  textoBotaoPrincipal: {
    color: CORES.branco,
    fontSize: 15,
    fontWeight: '900',
  },
  botaoTexto: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  rotuloBotaoTexto: {
    color: CORES.roxo,
    fontWeight: '900',
  },
  cabecalhoHistorico: {
    marginTop: 28,
    marginBottom: 14,
  },
  tituloSecao: {
    color: CORES.texto,
    fontSize: 22,
    fontWeight: '900',
  },
  subtituloSecao: {
    color: CORES.textoSuave,
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  entradaSelectMesConsulta: {
    height: 50,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: CORES.superficie,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estadoVazio: {
    marginTop: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.superficie,
    padding: 20,
    alignItems: 'center',
  },
  estadoVazioTitulo: {
    color: CORES.texto,
    fontWeight: '900',
    fontSize: 16,
  },
  estadoVazioTexto: {
    color: CORES.textoSuave,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  linhaHistorico: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: CORES.superficie,
    padding: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconeLimite: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: CORES.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeLimiteTexto: {
    color: CORES.verdeEscuro,
    fontSize: 12,
    fontWeight: '900',
  },
  principalHistorico: {
    flex: 1,
  },
  tituloHistorico: {
    color: CORES.texto,
    fontWeight: '900',
    fontSize: 15,
  },
  subtituloHistorico: {
    color: CORES.textoSuave,
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
  },
  valorHistorico: {
    color: CORES.verde,
    fontWeight: '900',
    fontSize: 14,
  },
  acoesHistorico: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  botaoAcao: {
    borderRadius: 999,
    backgroundColor: CORES.azulClaro,
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  botaoExcluir: {
    backgroundColor: CORES.vermelhoClaro,
  },
  textoBotaoAcao: {
    color: CORES.roxo,
    fontWeight: '900',
    fontSize: 12,
  },
  textoBotaoExcluir: {
    color: CORES.vermelho,
  },
});
