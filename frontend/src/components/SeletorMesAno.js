import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { obterMesReferenciaAtual } from '../utils/dateUtils';

const ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const NOMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function SeletorMesAno({ valor, aoSelecionar }) {
  const base = valor || obterMesReferenciaAtual();
  const [anoAtual, mesAtual] = base.split('-').map(Number);
  const [expandido, definirExpandido] = useState(false);
  const [anoGrid, definirAnoGrid] = useState(anoAtual);

  function abrir() {
    definirAnoGrid(anoAtual);
    definirExpandido((v) => !v);
  }

  function selecionarMes(i) {
    const m = String(i + 1).padStart(2, '0');
    aoSelecionar(`${anoGrid}-${m}`);
    definirExpandido(false);
  }

  return (
    <View>
      <Pressable
        style={[estilos.gatilho, expandido && estilos.gatilhoAberto]}
        onPress={abrir}
      >
        <Text style={estilos.textoGatilho}>
          {NOMES[mesAtual - 1]} {anoAtual}
        </Text>
        <Text style={estilos.iconeGatilho}>{expandido ? '▲' : '▼'}</Text>
      </Pressable>

      {expandido && (
        <View style={estilos.painel}>
          <View style={estilos.cabecalhoAno}>
            <Pressable style={estilos.setaAno} onPress={() => definirAnoGrid((a) => a - 1)}>
              <Text style={estilos.textoSeta}>←</Text>
            </Pressable>
            <Text style={estilos.textoAno}>{anoGrid}</Text>
            <Pressable style={estilos.setaAno} onPress={() => definirAnoGrid((a) => a + 1)}>
              <Text style={estilos.textoSeta}>→</Text>
            </Pressable>
          </View>

          <View style={estilos.gridMeses}>
            {ABREV.map((m, i) => {
              const ativo = anoGrid === anoAtual && i + 1 === mesAtual;
              return (
                <Pressable
                  key={i}
                  style={[estilos.celula, ativo && estilos.celulaAtiva]}
                  onPress={() => selecionarMes(i)}
                >
                  <Text style={[estilos.textoCelula, ativo && estilos.textoCelulaAtiva]}>
                    {m}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  gatilho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 6,
    paddingHorizontal: 14,
    backgroundColor: CORES.branco,
  },
  gatilhoAberto: {
    borderColor: CORES.preto,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textoGatilho: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 15,
    fontWeight: '700',
    color: CORES.texto,
  },
  iconeGatilho: {
    fontSize: 11,
    color: CORES.cinzaEscuro,
  },
  painel: {
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: CORES.preto,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    padding: 12,
  },
  cabecalhoAno: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  setaAno: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoSeta: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 16,
    color: CORES.texto,
    fontWeight: '700',
  },
  textoAno: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 18,
    fontWeight: '900',
    color: CORES.texto,
    letterSpacing: 0.5,
  },
  gridMeses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  celula: {
    width: '30.5%',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 4,
    alignItems: 'center',
  },
  celulaAtiva: {
    backgroundColor: CORES.acento,
    borderColor: CORES.acento,
  },
  textoCelula: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 13,
    fontWeight: '600',
    color: CORES.cinzaEscuro,
  },
  textoCelulaAtiva: {
    color: CORES.preto,
    fontWeight: '900',
  },
});
