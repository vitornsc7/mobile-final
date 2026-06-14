import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { formatarMesReferencia, obterMesReferenciaAtual } from '../utils/dateUtils';

export function SeletorMesAno({ valor, aoSelecionar }) {
  const base = valor || obterMesReferenciaAtual();

  function navegar(direcao) {
    const [ano, mes] = base.split('-').map(Number);
    const data = new Date(ano, mes - 1 + direcao, 1);
    const novoAno = data.getFullYear();
    const novoMes = String(data.getMonth() + 1).padStart(2, '0');
    aoSelecionar(`${novoAno}-${novoMes}`);
  }

  return (
    <View style={estilos.container}>
      <Pressable style={estilos.seta} onPress={() => navegar(-1)}>
        <Text style={estilos.setaTexto}>‹</Text>
      </Pressable>
      <Text style={estilos.rotulo}>{formatarMesReferencia(base, true)}</Text>
      <Pressable style={estilos.seta} onPress={() => navegar(1)}>
        <Text style={estilos.setaTexto}>›</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CORES.superficieSuave,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    height: 52,
  },
  seta: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CORES.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setaTexto: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 24,
    color: CORES.verdeEscuro,
    lineHeight: 30,
    fontWeight: '700',
  },
  rotulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 15,
    fontWeight: '700',
    color: CORES.texto,
    flex: 1,
    textAlign: 'center',
  },
});
