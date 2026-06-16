import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Campo } from '../components/Campo';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { signin } from '../services/authService';
import { salvarAuth } from '../utils/storage';

export function LoginScreen({ aoAutenticar, aoIrParaCadastro }) {
  const [email, definirEmail] = useState('');
  const [senha, definirSenha] = useState('');
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState('');

  async function entrar() {
    definirErro('');
    if (!email.trim() || !senha.trim()) {
      definirErro('Preencha e-mail e senha.');
      return;
    }
    definirCarregando(true);
    try {
      const { token, user } = await signin({ email: email.trim(), senha });
      await salvarAuth(token, user);
      aoAutenticar(user);
    } catch (err) {
      definirErro(err.message || 'E-mail ou senha inválidos.');
    } finally {
      definirCarregando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.fundo}>
      <ScrollView contentContainerStyle={estilos.container} keyboardShouldPersistTaps="handled">
        <View style={estilos.topo}>
          <Text style={estilos.logo}>My Economy</Text>
          <View style={estilos.tag}>
            <Text style={estilos.tagTexto}>Finanças pessoais</Text>
          </View>
          <Text style={estilos.titulo}>Entrar.</Text>
        </View>

        <View style={estilos.form}>
          <Campo
            rotulo="Email"
            valor={email}
            aoAlterarTexto={definirEmail}
            dica="seu@email.com"
            tipoTeclado="email-address"
          />
          <Campo
            rotulo="Senha"
            valor={senha}
            aoAlterarTexto={definirSenha}
            dica="Sua senha"
            seguro
          />
          {!!erro && <Text style={estilos.textoErro}>{erro}</Text>}
          <Pressable style={estilos.botao} onPress={entrar} disabled={carregando}>
            {carregando
              ? <ActivityIndicator color={CORES.preto} />
              : <Text style={estilos.textoBotao}>Entrar</Text>}
          </Pressable>
        </View>

        <Pressable style={estilos.linkArea} onPress={aoIrParaCadastro}>
          <Text style={estilos.textoLink}>
            Não tem conta?{' '}
            <Text style={estilos.textoLinkDestaque}>Criar agora</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: CORES.branco,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
  },
  topo: {
    marginBottom: 48,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: CORES.acento,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 18,
  },
  tagTexto: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 11,
    fontWeight: '800',
    color: CORES.preto,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  titulo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 56,
    fontWeight: '900',
    color: CORES.preto,
    letterSpacing: -2,
    lineHeight: 58,
  },
  logo: {
    fontFamily: FONTE_PRINCIPAL,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
    color: CORES.preto,
    letterSpacing: -2,
  },
  form: {
    marginBottom: 8,
  },
  textoErro: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.vermelho,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  botao: {
    height: 56,
    backgroundColor: CORES.acento,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotao: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.preto,
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  linkArea: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  textoLink: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.cinzaEscuro,
    fontWeight: '600',
    fontSize: 14,
  },
  textoLinkDestaque: {
    color: CORES.preto,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});
