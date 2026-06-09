import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from '../components/ChevronDown';
import { Campo } from '../components/Campo';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { formatarMoeda } from '../utils/currencyUtils';
import { formatarMesReferencia, gerarMesesDisponiveis } from '../utils/dateUtils';

export function TelaDespesa({
  mesSelecionado,
  seletorMesAberto,
  aoAbrirSeletorMes,
  aoFecharSeletorMes,
  aoSelecionarMes,
  despesas,
  formularioDespesa,
  despesaEmEdicao,
  aoAlterarFormulario,
  aoSalvar,
  aoEditar,
  aoExcluir,
  aoCancelarEdicao,
}) {
  const [seletorMesFormularioAberto, definirSeletorMesFormularioAberto] = useState(false);
  const mesesDisponiveis = gerarMesesDisponiveis();
  const mesSelecionadoRotulo = mesSelecionado ? formatarMesReferencia(mesSelecionado, false) : '';
  const aoAlternarSeletorHistorico = seletorMesAberto ? aoFecharSeletorMes : aoAbrirSeletorMes;
  const mesFormularioRotulo = formularioDespesa.mesReferencia
    ? formatarMesReferencia(formularioDespesa.mesReferencia, false)
    : '';
  const totalHistorico = useMemo(() => despesas.reduce((total, despesa) => total + Number(despesa.valor), 0), [despesas]);

  function selecionarMesFormulario(mesReferencia) {
    aoAlterarFormulario('mesReferencia', mesReferencia);
    definirSeletorMesFormularioAberto(false);
  }

  function alternarSeletorMesFormulario() {
    definirSeletorMesFormularioAberto((atual) => !atual);
  }

  return (
    <View style={estilos.telaFormulario}>
      <View style={estilos.cabecalhoTela}>
        <Text style={estilos.eyebrow}>Lançamentos</Text>
        <Text style={estilos.tituloTela}>Despesas</Text>
        <Text style={estilos.subtituloTela}>Registre saídas e acompanhe o histórico mensal.</Text>
      </View>

      <View style={estilos.cardFormulario}>
        <View style={estilos.cabecalhoCard}>
          <Text style={estilos.tituloCard}>{despesaEmEdicao ? 'Editar despesa' : 'Nova despesa'}</Text>
          {despesaEmEdicao && <Text style={estilos.badgeEdicao}>Editando</Text>}
        </View>
        <Campo
          rotulo="Descrição"
          valor={formularioDespesa.descricao}
          aoAlterarTexto={(valor) => aoAlterarFormulario('descricao', valor)}
          dica="Ex: Mercado"
        />
        <Campo
          rotulo="Valor"
          valor={formularioDespesa.valor}
          aoAlterarTexto={(valor) => aoAlterarFormulario('valor', valor)}
          dica="Ex: 150.00"
          tipoTeclado="numeric"
        />
        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Mês</Text>
          <Pressable
            style={[estilos.entradaSelectMes, seletorMesFormularioAberto && estilos.entradaSelecaoAberta]}
            onPress={alternarSeletorMesFormulario}
          >
            <Text style={formularioDespesa.mesReferencia ? estilos.textoSelectMes : estilos.textoSelectMesVazio}>
              {mesFormularioRotulo || 'Selecione um mês'}
            </Text>
            <ChevronDown style={estilos.chevronSelectMes} />
          </Pressable>

          {seletorMesFormularioAberto && (
            <View style={estilos.dropdownFormularioContainer}>
              <ScrollView style={estilos.dropdownScroll} showsVerticalScrollIndicator={false}>
                {mesesDisponiveis.map((mes) => (
                  <Pressable
                    key={mes.valor}
                    style={[
                      estilos.opcaoMes,
                      mes.valor === formularioDespesa.mesReferencia && estilos.opcaoMesAtiva,
                    ]}
                    onPress={() => selecionarMesFormulario(mes.valor)}
                  >
                    <Text
                      style={[
                        estilos.textoOpcaoMes,
                        mes.valor === formularioDespesa.mesReferencia && estilos.textoOpcaoMesAtiva,
                      ]}
                    >
                      {mes.rotulo}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <Pressable style={estilos.botaoPrincipal} onPress={aoSalvar}>
          <Text style={estilos.textoBotaoPrincipal}>{despesaEmEdicao ? 'Atualizar despesa' : 'Salvar despesa'}</Text>
        </Pressable>
        {despesaEmEdicao && (
          <Pressable style={estilos.botaoTexto} onPress={aoCancelarEdicao}>
            <Text style={estilos.rotuloBotaoTexto}>Cancelar edição</Text>
          </Pressable>
        )}
      </View>

      <View style={estilos.cabecalhoHistorico}>
        <View>
          <Text style={estilos.tituloSecao}>Histórico</Text>
          <Text style={estilos.subtituloSecao}>{despesas.length} registros no período</Text>
        </View>
        <View style={estilos.totalPill}>
          <Text style={estilos.totalPillRotulo}>Total</Text>
          <Text style={estilos.totalPillValor}>{formatarMoeda(totalHistorico)}</Text>
        </View>
      </View>

      <View style={estilos.buscaMes}>
        <Pressable
          style={[estilos.entradaSelecao, seletorMesAberto && estilos.entradaSelecaoAberta]}
          onPress={aoAlternarSeletorHistorico}
        >
          <Text style={mesSelecionado ? estilos.textoSelectMes : estilos.textoSelectMesVazio}>
            {mesSelecionadoRotulo || 'Selecione um mês'}
          </Text>
        </Pressable>
        <Pressable style={estilos.botaoChevron} onPress={aoAlternarSeletorHistorico}>
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

      {despesas.length === 0 ? (
        <View style={estilos.estadoVazio}>
          <Text style={estilos.estadoVazioTitulo}>Nenhuma despesa encontrada</Text>
          <Text style={estilos.estadoVazioTexto}>Selecione outro mês ou registre uma nova despesa.</Text>
        </View>
      ) : (
        despesas.map((despesa) => (
          <View key={despesa.id} style={estilos.linhaHistorico}>
            <View style={estilos.iconeDespesa}>
              <Text style={estilos.iconeDespesaTexto}>-</Text>
            </View>
            <View style={estilos.principalHistorico}>
              <Text style={estilos.tituloHistorico}>{despesa.descricao}</Text>
              <Text style={estilos.subtituloHistorico}>{despesa.mesReferencia}</Text>
              <View style={estilos.acoesHistorico}>
                <Pressable style={estilos.botaoAcao} onPress={() => aoEditar(despesa)}>
                  <Text style={estilos.textoBotaoAcao}>Editar</Text>
                </Pressable>
                <Pressable style={[estilos.botaoAcao, estilos.botaoExcluir]} onPress={() => aoExcluir(despesa)}>
                  <Text style={[estilos.textoBotaoAcao, estilos.textoBotaoExcluir]}>Excluir</Text>
                </Pressable>
              </View>
            </View>
            <Text style={estilos.valorHistorico}>{formatarMoeda(despesa.valor)}</Text>
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
    color: CORES.vermelho,
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
    backgroundColor: CORES.vermelhoClaro,
    color: CORES.vermelhoEscuro,
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
  chevronSelectMes: {
    color: CORES.texto,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 22,
  },
  dropdownFormularioContainer: {
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
  botaoPrincipal: {
    height: 54,
    borderRadius: 18,
    backgroundColor: CORES.vermelho,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: CORES.vermelho,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
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
  totalPill: {
    backgroundColor: CORES.vermelhoClaro,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
  },
  totalPillRotulo: {
    color: CORES.vermelhoEscuro,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  totalPillValor: {
    color: CORES.vermelhoEscuro,
    fontWeight: '900',
    marginTop: 2,
  },
  buscaMes: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    position: 'relative',
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
  entradaSelecao: {
    flex: 1,
    height: 50,
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
  dropdownContainer: {
    marginTop: -13,
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
  iconeDespesa: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: CORES.vermelhoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeDespesaTexto: {
    color: CORES.vermelho,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
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
    color: CORES.vermelho,
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
