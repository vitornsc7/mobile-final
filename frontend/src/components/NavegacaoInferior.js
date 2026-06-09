import { Pressable, StyleSheet, Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { CORES } from '../theme/colors';

export function NavegacaoInferior({ telaAtiva, aoTrocarTela }) {
  const itens = [
    { chave: 'inicio', rotulo: 'Início', icone: 'home', tipo: 'entypo' },
    { chave: 'despesas', rotulo: 'Despesas', icone: 'add-card', tipo: 'materialIcons' },
    { chave: 'limites', rotulo: 'Limites', icone: 'wallet', tipo: 'fontAwesome6' },
    { chave: 'perfil', rotulo: 'Perfil', icone: 'user-alt', tipo: 'fontAwesome5' },
  ];

  function renderizarIcone(item, ativo) {
    const corIcone = ativo ? CORES.textoInvertido : CORES.textoSuave;

    if (item.tipo === 'entypo') {
      return <Entypo name={item.icone} size={21} color={corIcone} />;
    }

    if (item.tipo === 'materialIcons') {
      return <MaterialIcons name={item.icone} size={22} color={corIcone} />;
    }

    if (item.tipo === 'fontAwesome5') {
      return <FontAwesome5 name={item.icone} size={18} color={corIcone} />;
    }

    return <FontAwesome6 name={item.icone} size={19} color={corIcone} />;
  }

  return (
    <View style={estilos.navegacaoInferior}>
      {itens.map((item) => {
        const ativo = telaAtiva === item.chave;

        return (
          <Pressable
            key={item.chave}
            style={[estilos.itemNavegacao, ativo && estilos.itemNavegacaoAtivo]}
            onPress={() => aoTrocarTela(item.chave)}
          >
            {renderizarIcone(item, ativo)}
            <Text style={[estilos.rotuloItem, ativo && estilos.rotuloItemAtivo]}>{item.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  navegacaoInferior: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    height: 72,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(216, 196, 240, 0.9)',
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  itemNavegacao: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 56,
    borderRadius: 18,
    gap: 4,
  },
  itemNavegacaoAtivo: {
    backgroundColor: CORES.roxo,
    shadowColor: CORES.roxo,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  rotuloItem: {
    color: CORES.textoSuave,
    fontSize: 10,
    fontWeight: '800',
  },
  rotuloItemAtivo: {
    color: CORES.textoInvertido,
  },
});
