import { Pressable, StyleSheet, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { CORES } from '../theme/colors';

export function NavegacaoInferior({ telaAtiva, aoTrocarTela }) {
  const itens = [
    { chave: 'inicio', icone: 'home', tipo: 'entypo' },
    { chave: 'despesas', icone: 'add-card', tipo: 'materialIcons' },
    { chave: 'limites', icone: 'gears', tipo: 'fontAwesome6' },
    { chave: 'perfil', icone: 'user-alt', tipo: 'fontAwesome5' },
  ];

  function renderizarIcone(item) {
    const corIcone = CORES.branco;

    if (item.tipo === 'entypo') {
      return <Entypo name={item.icone} size={24} color={corIcone} />;
    }

    if (item.tipo === 'materialIcons') {
      return <MaterialIcons name={item.icone} size={24} color={corIcone} />;
    }

    if (item.tipo === 'fontAwesome5') {
      return <FontAwesome5 name={item.icone} size={24} color={corIcone} />;
    }

    return <FontAwesome6 name={item.icone} size={24} color={corIcone} />;
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
            {renderizarIcone(item)}
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  navegacaoInferior: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: CORES.verdeCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  itemNavegacao: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 62,
    height: 56,
    borderRadius: 28,
  },
  itemNavegacaoAtivo: {
    backgroundColor: 'rgba(20, 83, 45, 0.22)',
  },
});
