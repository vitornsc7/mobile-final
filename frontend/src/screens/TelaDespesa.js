import { useState } from 'react';
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

  function selecionarMesFormulario(mesReferencia) {
    aoAlterarFormulario('mesReferencia', mesReferencia);
    definirSeletorMesFormularioAberto(false);
  }

  function alternarSeletorMesFormulario() {
    definirSeletorMesFormularioAberto((atual) => !atual);
  }

  return (
    <View style={estilos.telaFormulario}>
      <Text style={estilos.tituloTela}>Despesa</Text>

      <View style={estilos.cardFormulario}>
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
              <ScrollView
                style={estilos.dropdownScroll}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
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
          <Text style={estilos.textoBotaoPrincipal}>{despesaEmEdicao ? 'Atualizar' : 'Salvar'}</Text>
        </Pressable>
        {despesaEmEdicao && (
          <Pressable style={estilos.botaoTexto} onPress={aoCancelarEdicao}>
            <Text style={estilos.rotuloBotaoTexto}>Cancelar edição</Text>
          </Pressable>
        )}
      </View>

      <Text style={estilos.tituloSecao}>Histórico</Text>
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

      {despesas.length === 0 ? (
        <Text style={estilos.textoVazio}>Nenhuma despesa foi encontrada!</Text>
      ) : (
        despesas.map((despesa) => (
          <View key={despesa.id} style={estilos.linhaHistorico}>
            <View style={estilos.principalHistorico}>
              <Text style={estilos.tituloHistorico}>{despesa.descricao}</Text>
              <Text style={estilos.valorHistorico}>{formatarMoeda(despesa.valor)}</Text>
            </View>
            <View style={estilos.acoesHistorico}>
              <Pressable style={estilos.botaoAcao} onPress={() => aoEditar(despesa)}>
                <Text style={estilos.textoBotaoAcao}>Editar</Text>
              </Pressable>
              <Pressable style={estilos.botaoAcao} onPress={() => aoExcluir(despesa)}>
                <Text style={estilos.textoBotaoAcao}>Excluir</Text>
              </Pressable>
            </View>
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
    paddingVertical: 22,
  },
  tituloTela: {
    fontFamily: FONTE_PRINCIPAL,
    textAlign: 'center',
    color: CORES.texto,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 24,
  },
  cardFormulario: {
    backgroundColor: CORES.branco,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 16,
  },
  campo: {
    marginBottom: 14,
  },
  rotulo: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.texto,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
  },
  entradaSelectMes: {
    height: 44,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: CORES.branco,
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
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.branco,
    maxHeight: 180,
    overflow: 'hidden',
  },
  botaoPrincipal: {
    height: 52,
    borderRadius: 10,
    backgroundColor: CORES.verdeCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  textoBotaoPrincipal: {
    color: CORES.branco,
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  botaoTexto: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  rotuloBotaoTexto: {
    color: CORES.roxo,
    fontWeight: '800',
  },
  tituloSecao: {
    marginTop: 28,
    marginBottom: 12,
    textAlign: 'center',
    color: CORES.texto,
    fontSize: 22,
    fontWeight: '900',
  },
  buscaMes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
    position: 'relative',
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
  entradaSelecao: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingRight: 42,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  entradaSelecaoAberta: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownContainer: {
    marginTop: -13,
    marginBottom: 12,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.branco,
    maxHeight: 180,
    overflow: 'hidden',
  },
  dropdownScroll: {
    padding: 8,
  },
  textoVazio: {
    marginTop: 14,
    textAlign: 'center',
    color: CORES.textoSuave,
  },
  linhaHistorico: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: CORES.branco,
    padding: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  principalHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  tituloHistorico: {
    flex: 1,
    color: CORES.texto,
    fontWeight: '900',
  },
  valorHistorico: {
    color: CORES.roxoEscuro,
    fontWeight: '900',
  },
  acoesHistorico: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoAcao: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: CORES.verdeClaro,
    alignItems: 'center',
    paddingVertical: 9,
  },
  textoBotaoAcao: {
    color: CORES.verdeEscuro,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
