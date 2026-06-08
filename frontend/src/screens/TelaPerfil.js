import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';

export function TelaPerfil() {
  return (
    <View style={estilos.telaPerfil}>
      <Text style={estilos.tituloTela}>Meus Dados</Text>

      <View style={estilos.cardPerfil}>
        <Text style={estilos.rotuloPerfil}>Nome</Text>
        <Text style={estilos.valorPerfil}>João</Text>

        <Text style={estilos.rotuloPerfil}>E-mail</Text>
        <Text style={estilos.valorPerfil}>joao@gmail.com</Text>

        <Text style={estilos.rotuloPerfil}>Data de nascimento</Text>
        <Text style={estilos.valorPerfil}>09/12/1987</Text>

        <Pressable style={estilos.botaoPrincipal}>
          <Text style={estilos.textoBotaoPrincipal}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  telaPerfil: {
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
  cardPerfil: {
    backgroundColor: CORES.branco,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 18,
  },
  rotuloPerfil: {
    color: CORES.texto,
    fontWeight: '900',
    marginTop: 16,
  },
  valorPerfil: {
    color: CORES.textoSuave,
    marginTop: 6,
    fontSize: 16,
  },
  botaoPrincipal: {
    height: 52,
    borderRadius: 10,
    backgroundColor: CORES.verdeCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
  },
  textoBotaoPrincipal: {
    color: CORES.branco,
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
