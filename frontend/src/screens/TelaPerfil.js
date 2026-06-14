import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { isoParaBR } from '../utils/dateUtils';

export function TelaPerfil({ usuario, aoSair }) {
  const inicial = usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : '?';

  return (
    <View style={estilos.tela}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.eyebrow}>Conta</Text>
        <Text style={estilos.titulo}>Meus dados</Text>
        <Text style={estilos.subtitulo}>Informações básicas do perfil conectado.</Text>
      </View>

      <View style={estilos.cartaoHero}>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarTexto}>{inicial}</Text>
        </View>
        <View style={estilos.resumo}>
          <Text style={estilos.nomeHero}>{usuario?.nome ?? '-'}</Text>
          <Text style={estilos.emailHero}>{usuario?.email ?? '-'}</Text>
        </View>
      </View>

      <View style={estilos.cardDados}>
        <View style={estilos.linha}>
          <Text style={estilos.rotuloLinha}>Nome</Text>
          <Text style={estilos.valorLinha}>{usuario?.nome ?? '-'}</Text>
        </View>
        <View style={estilos.linha}>
          <Text style={estilos.rotuloLinha}>E-mail</Text>
          <Text style={estilos.valorLinha}>{usuario?.email ?? '-'}</Text>
        </View>
        <View style={[estilos.linha, estilos.linhaUltima]}>
          <Text style={estilos.rotuloLinha}>Data de nascimento</Text>
          <Text style={estilos.valorLinha}>{isoParaBR(usuario?.dataNascimento)}</Text>
        </View>
      </View>

      <Pressable style={estilos.botaoSair} onPress={aoSair}>
        <Text style={estilos.textoBotaoSair}>Sair da conta</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { paddingVertical: 8 },
  cabecalho: { marginBottom: 20 },
  eyebrow: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  titulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 36,
    fontWeight: '900',
    color: CORES.preto,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 13,
    fontWeight: '500',
    color: CORES.cinzaEscuro,
    lineHeight: 18,
  },
  cartaoHero: {
    backgroundColor: CORES.preto,
    borderRadius: 8,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: CORES.acento,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.preto,
    fontSize: 26,
    fontWeight: '900',
  },
  resumo: { flex: 1 },
  nomeHero: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.branco,
    fontSize: 20,
    fontWeight: '900',
  },
  emailHero: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.cinzaEscuro,
    fontSize: 13,
    marginTop: 3,
    fontWeight: '500',
  },
  cardDados: {
    backgroundColor: CORES.branco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CORES.borda,
    overflow: 'hidden',
  },
  linha: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  linhaUltima: {
    borderBottomWidth: 0,
  },
  rotuloLinha: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.cinzaEscuro,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  valorLinha: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 15,
    fontWeight: '700',
    color: CORES.preto,
    marginTop: 4,
  },
  botaoSair: {
    height: 52,
    borderWidth: 1.5,
    borderColor: CORES.preto,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  textoBotaoSair: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.preto,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
