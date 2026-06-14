import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { NavegacaoInferior } from './NavegacaoInferior';
import { CORES } from '../theme/colors';

export function TelaCelular({ children, telaAtiva, aoTrocarTela }) {
  return (
    <SafeAreaView style={estilos.fundo}>
      <StatusBar style="dark" />
      <View style={estilos.container}>
        <ScrollView
          contentContainerStyle={estilos.conteudo}
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
  fundo: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 90,
  },
});
