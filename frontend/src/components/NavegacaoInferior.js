import { Pressable, StyleSheet, Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';

export function NavegacaoInferior({ telaAtiva, aoTrocarTela }) {
  const itens = [
    { chave: 'inicio', rotulo: 'Início', icone: 'home', tipo: 'entypo' },
    { chave: 'despesas', rotulo: 'Despesas', icone: 'add-card', tipo: 'materialIcons' },
    { chave: 'limites', rotulo: 'Limites', icone: 'wallet', tipo: 'fontAwesome6' },
    { chave: 'perfil', rotulo: 'Perfil', icone: 'user-alt', tipo: 'fontAwesome5' },
  ];

  function renderizarIcone(item, ativo) {
    const cor = ativo ? CORES.preto : CORES.cinzaEscuro;
    if (item.tipo === 'entypo') return <Entypo name={item.icone} size={20} color={cor} />;
    if (item.tipo === 'materialIcons') return <MaterialIcons name={item.icone} size={21} color={cor} />;
    if (item.tipo === 'fontAwesome5') return <FontAwesome5 name={item.icone} size={17} color={cor} />;
    return <FontAwesome6 name={item.icone} size={18} color={cor} />;
  }

  return (
    <View style={estilos.nav}>
      {itens.map((item) => {
        const ativo = telaAtiva === item.chave;
        return (
          <Pressable
            key={item.chave}
            style={[estilos.item, ativo && estilos.itemAtivo]}
            onPress={() => aoTrocarTela(item.chave)}
          >
            {renderizarIcone(item, ativo)}
            <Text style={[estilos.rotulo, ativo && estilos.rotuloAtivo]}>{item.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: CORES.preto,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 6,
    gap: 3,
  },
  itemAtivo: {
    backgroundColor: CORES.acento,
  },
  rotulo: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.cinzaEscuro,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  rotuloAtivo: {
    color: CORES.preto,
    fontWeight: '900',
  },
});
