import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { NavegacaoInferior } from './NavegacaoInferior';
import { CORES } from '../theme/colors';

export function TelaCelular({ children, telaAtiva, aoTrocarTela }) {
  return (
    <SafeAreaView style={estilos.fundoAplicativo}>
      <StatusBar style="dark" />
      <View style={estilos.celular}>
        <ScrollView
          contentContainerStyle={estilos.conteudoCelular}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        <NavegacaoInferior telaAtiva={telaAtiva} aoTrocarTela={aoTrocarTela} />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  fundoAplicativo: {
    flex: 1,
    backgroundColor: CORES.fundoElevado,
  },
  celular: {
    flex: 1,
    width: '100%',
    backgroundColor: CORES.fundoElevado,
    overflow: 'hidden',
  },
  conteudoCelular: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 140,
  },
});
