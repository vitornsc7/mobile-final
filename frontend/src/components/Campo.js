import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';

export function Campo({ rotulo, valor, aoAlterarTexto, dica, tipoTeclado = 'default', seguro = false }) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        style={estilos.entrada}
        value={valor}
        onChangeText={aoAlterarTexto}
        placeholder={dica}
        keyboardType={tipoTeclado}
        secureTextEntry={seguro}
        placeholderTextColor={CORES.cinzaMedio}
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
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  entrada: {
    fontFamily: FONTE_PRINCIPAL,
    height: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 6,
    paddingHorizontal: 14,
    color: CORES.texto,
    backgroundColor: CORES.branco,
    fontSize: 15,
    fontWeight: '600',
  },
});
