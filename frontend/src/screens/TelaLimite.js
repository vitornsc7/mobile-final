import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Campo } from '../components/Campo';
import { ChevronDown } from '../components/ChevronDown';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { formatarMoeda } from '../utils/currencyUtils';
import { formatarMesReferencia, gerarMesesDisponiveis } from '../utils/dateUtils';

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
  const [seletorMesFormularioAberto, definirSeletorMesFormularioAberto] = useState(false);
  const [seletorMesConsultaAberto, definirSeletorMesConsultaAberto] = useState(false);
  const mesesDisponiveis = gerarMesesDisponiveis();

  function selecionarMesFormulario(mesReferencia) {
    aoAlterarFormulario('mesReferencia', mesReferencia);
    definirSeletorMesFormularioAberto(false);
  }

  function alternarSeletorMesFormulario() {
    definirSeletorMesFormularioAberto((atual) => !atual);
  }

  function selecionarMesConsulta(mesReferencia) {
    definirSeletorMesConsultaAberto(false);
    aoSelecionarMesConsulta(mesReferencia);
  }

  function alternarSeletorMesConsulta() {
    definirSeletorMesConsultaAberto((atual) => !atual);
  }

  return (
    <View style={estilos.telaFormulario}>
      <Text style={estilos.tituloTela}>Limite</Text>

      <View style={estilos.cardFormulario}>
        <Campo
          rotulo="Valor"
          valor={formularioLimite.valor}
          aoAlterarTexto={(valor) => aoAlterarFormulario('valor', valor)}
          dica="Ex: 1200.00"
          tipoTeclado="numeric"
        />

        {Boolean(mensagemErro) && <Text style={estilos.mensagemErro}>{mensagemErro}</Text>}

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Mês</Text>
          <Pressable
            style={[estilos.entradaSelectMes, seletorMesFormularioAberto && estilos.entradaSelectMesAberta]}
            onPress={alternarSeletorMesFormulario}
          >
            <Text style={formularioLimite.mesReferencia ? estilos.textoSelectMes : estilos.textoSelectMesVazio}>
              {formularioLimite.mesReferencia
                ? formatarMesReferencia(formularioLimite.mesReferencia, false)
                : 'Selecione um mês'}
            </Text>
            <ChevronDown style={estilos.chevronSelectMes} />
          </Pressable>

          {seletorMesFormularioAberto && (
            <View style={estilos.dropdownContainer}>
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
                      mes.valor === formularioLimite.mesReferencia && estilos.opcaoMesAtiva,
                    ]}
                    onPress={() => selecionarMesFormulario(mes.valor)}
                  >
                    <Text
                      style={[
                        estilos.textoOpcaoMes,
                        mes.valor === formularioLimite.mesReferencia && estilos.textoOpcaoMesAtiva,
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
          <Text style={estilos.textoBotaoPrincipal}>{limiteEmEdicao ? 'Atualizar' : 'Salvar'}</Text>
        </Pressable>
        {limiteEmEdicao && (
          <Pressable style={estilos.botaoTexto} onPress={aoCancelarEdicao}>
            <Text style={estilos.rotuloBotaoTexto}>Cancelar edicao</Text>
          </Pressable>
        )}
      </View>

      <Text style={estilos.tituloSecao}>Histórico</Text>
      <Pressable
        style={[estilos.entradaSelectMesConsulta, seletorMesConsultaAberto && estilos.entradaSelectMesAberta]}
        onPress={alternarSeletorMesConsulta}
      >
        <Text style={mesSelecionado ? estilos.textoSelectMes : estilos.textoSelectMesVazio}>
          {mesSelecionado ? formatarMesReferencia(mesSelecionado, false) : 'Selecione um mês'}
        </Text>
        <ChevronDown style={estilos.chevronSelectMes} />
      </Pressable>

      {seletorMesConsultaAberto && (
        <View style={estilos.dropdownHistoricoContainer}>
          <ScrollView
            style={estilos.dropdownScroll}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {mesesDisponiveis.map((mes) => (
              <Pressable
                key={mes.valor}
                style={[estilos.opcaoMes, mes.valor === mesSelecionado && estilos.opcaoMesAtiva]}
                onPress={() => selecionarMesConsulta(mes.valor)}
              >
                <Text style={[estilos.textoOpcaoMes, mes.valor === mesSelecionado && estilos.textoOpcaoMesAtiva]}>
                  {mes.rotulo}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {limites.length === 0 ? (
        <Text style={estilos.textoVazio}>Nenhum limite foi encontrado</Text>
      ) : (
        limites.map((limite) => (
          <View key={limite.id} style={estilos.linhaHistorico}>
            <View style={estilos.principalHistorico}>
              <Text style={estilos.tituloHistorico}>{limite.mesReferencia}</Text>
              <Text style={estilos.valorHistorico}>{formatarMoeda(limite.valor)}</Text>
            </View>
            <View style={estilos.acoesHistorico}>
              <Pressable style={estilos.botaoAcao} onPress={() => aoEditar(limite)}>
                <Text style={estilos.textoBotaoAcao}>Editar</Text>
              </Pressable>
              <Pressable style={estilos.botaoAcao} onPress={() => aoExcluir(limite)}>
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
    justifyContent: 'center',
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
  mensagemErro: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  entradaSelectMesAberta: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textoSelectMes: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.texto,
  },
  textoSelectMesVazio: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.textoSuave,
  },
  chevronSelectMes: {
    color: CORES.texto,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 22,
  },
  dropdownContainer: {
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
  dropdownHistoricoContainer: {
    marginTop: -1,
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
  entradaSelectMesConsulta: {
    height: 42,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
