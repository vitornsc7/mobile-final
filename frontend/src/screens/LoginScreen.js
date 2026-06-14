import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
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
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>ENTRAR</Text>
        </View>

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

        <Pressable style={estilos.botaoPrincipal} onPress={entrar} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={CORES.branco} />
            : <Text style={estilos.textoBotaoPrincipal}>ENTRAR</Text>
          }
        </Pressable>

        <Pressable style={estilos.linkCadastro} onPress={aoIrParaCadastro}>
          <Text style={estilos.textoLink}>
            Não possui conta? <Text style={estilos.textoLinkDestaque}>Crie aqui</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: CORES.superficie,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titulo: {
    fontFamily: FONTE_PRINCIPAL,
    color: CORES.texto,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 2,
  },
  textoErro: {
    color: CORES.vermelho,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  botaoPrincipal: {
    height: 54,
    borderRadius: 18,
    backgroundColor: CORES.verde,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: CORES.verde,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  textoBotaoPrincipal: {
    color: CORES.branco,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  linkCadastro: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  textoLink: {
    color: CORES.textoSuave,
    fontWeight: '600',
  },
  textoLinkDestaque: {
    color: CORES.verde,
    fontWeight: '900',
  },
});
