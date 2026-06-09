import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';

export function Campo({ rotulo, valor, aoAlterarTexto, dica, tipoTeclado = 'default' }) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        style={estilos.entrada}
        value={valor}
        onChangeText={aoAlterarTexto}
        placeholder={dica}
        keyboardType={tipoTeclado}
        placeholderTextColor={CORES.textoSuave}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: {
    marginBottom: 16,
  },
  rotulo: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.cinzaEscuro,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  entrada: {
    fontFamily: FONTE_PRINCIPAL,
    height: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 16,
    paddingHorizontal: 16,
    color: CORES.texto,
    backgroundColor: CORES.superficieSuave,
    fontSize: 15,
    fontWeight: '700',
  },
});
