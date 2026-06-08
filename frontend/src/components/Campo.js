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
        placeholderTextColor="#8c95a3"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
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
  entrada: {
    fontFamily: FONTE_PRINCIPAL,
    height: 44,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: CORES.texto,
    backgroundColor: CORES.branco,
  },
});
