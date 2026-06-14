import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { isoParaBR } from '../utils/dateUtils';

export function TelaPerfil({ usuario, aoSair }) {
  const inicial = usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : '?';

  return (
    <View style={estilos.telaPerfil}>
      <View style={estilos.cabecalhoTela}>
        <Text style={estilos.eyebrow}>Conta</Text>
        <Text style={estilos.tituloTela}>Meus dados</Text>
        <Text style={estilos.subtituloTela}>Informações básicas do perfil conectado.</Text>
      </View>

      <View style={estilos.cartaoHero}>
        <View style={estilos.avatarGrande}>
          <Text style={estilos.avatarTexto}>{inicial}</Text>
        </View>
        <View style={estilos.resumoPerfil}>
          <Text style={estilos.nomePerfil}>{usuario?.nome ?? '—'}</Text>
          <Text style={estilos.emailPerfil}>{usuario?.email ?? '—'}</Text>
        </View>
      </View>

      <View style={estilos.cardPerfil}>
        <View style={estilos.linhaPerfil}>
          <Text style={estilos.rotuloPerfil}>Nome</Text>
          <Text style={estilos.valorPerfil}>{usuario?.nome ?? '—'}</Text>
        </View>

        <View style={estilos.linhaPerfil}>
          <Text style={estilos.rotuloPerfil}>E-mail</Text>
          <Text style={estilos.valorPerfil}>{usuario?.email ?? '—'}</Text>
        </View>

        <View style={estilos.linhaPerfil}>
          <Text style={estilos.rotuloPerfil}>Data de nascimento</Text>
          <Text style={estilos.valorPerfil}>{isoParaBR(usuario?.dataNascimento)}</Text>
        </View>

        <Pressable style={estilos.botaoPrincipal} onPress={aoSair}>
          <Text style={estilos.textoBotaoPrincipal}>Sair da conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  telaPerfil: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  cabecalhoTela: {
    marginBottom: 22,
  },
  eyebrow: {
    color: CORES.roxo,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  tituloTela: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.texto,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  subtituloTela: {
    color: CORES.textoSuave,
    marginTop: 6,
    fontWeight: '600',
  },
  cartaoHero: {
    backgroundColor: CORES.roxoClaro,
    borderRadius: 26,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
    shadowColor: CORES.roxo,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 7,
  },
  avatarGrande: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: CORES.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: CORES.roxoEscuro,
    fontSize: 24,
    fontWeight: '900',
  },
  resumoPerfil: {
    flex: 1,
  },
  nomePerfil: {
    color: CORES.texto,
    fontSize: 22,
    fontWeight: '900',
  },
  emailPerfil: {
    color: CORES.textoSuave,
    marginTop: 5,
    fontWeight: '700',
  },
  cardPerfil: {
    marginTop: 16,
    backgroundColor: CORES.branco,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 18,
  },
  linhaPerfil: {
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    paddingVertical: 14,
  },
  rotuloPerfil: {
    color: CORES.textoSuave,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  valorPerfil: {
    color: CORES.texto,
    marginTop: 6,
    fontSize: 16,
    fontWeight: '800',
  },
  botaoPrincipal: {
    height: 54,
    borderRadius: 18,
    backgroundColor: CORES.verde,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  textoBotaoPrincipal: {
    color: CORES.branco,
    fontSize: 15,
    fontWeight: '900',
  },
});
