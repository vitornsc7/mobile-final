import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Campo } from '../components/Campo';
import { CORES } from '../theme/colors';
import { FONTE_PRINCIPAL } from '../theme/typography';
import { signup } from '../services/authService';
import { salvarAuth } from '../utils/storage';
import { brParaISO } from '../utils/dateUtils';

export function SignupScreen({ aoAutenticar, aoIrParaLogin }) {
  const [nome, definirNome] = useState('');
  const [email, definirEmail] = useState('');
  const [dataNascimento, definirDataNascimento] = useState('');
  const [senha, definirSenha] = useState('');
  const [confirmarSenha, definirConfirmarSenha] = useState('');
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState('');

  function aplicarMascaraData(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 8);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
  }

  function validarDataBR(data) {
    if (data.length !== 10) return 'Data incompleta.';
    const [diaStr, mesStr, anoStr] = data.split('/');
    const dia = Number(diaStr);
    const mes = Number(mesStr);
    const ano = Number(anoStr);
    const anoAtual = new Date().getFullYear();
    if (mes < 1 || mes > 12) return 'Mês inválido.';
    if (ano < 1900 || ano > anoAtual) return 'Ano inválido.';
    const dataObj = new Date(ano, mes - 1, dia);
    if (dataObj.getFullYear() !== ano || dataObj.getMonth() + 1 !== mes || dataObj.getDate() !== dia)
      return 'Data inválida.';
    if (dataObj > new Date()) return 'Data não pode ser futura.';
    return null;
  }

  async function cadastrar() {
    definirErro('');
    if (!nome.trim() || !email.trim() || !dataNascimento.trim() || !senha.trim() || !confirmarSenha.trim()) {
      definirErro('Preencha todos os campos.');
      return;
    }
    const erroData = validarDataBR(dataNascimento);
    if (erroData) { definirErro(erroData); return; }
    if (senha !== confirmarSenha) { definirErro('As senhas não coincidem.'); return; }
    definirCarregando(true);
    try {
      const { token, user } = await signup({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        dataNascimento: brParaISO(dataNascimento),
      });
      await salvarAuth(token, user);
      aoAutenticar(user);
    } catch (err) {
      definirErro(err.message || 'Erro ao criar conta.');
    } finally {
      definirCarregando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.fundo}>
      <ScrollView contentContainerStyle={estilos.container} keyboardShouldPersistTaps="handled">
        <View style={estilos.topo}>
          <View style={estilos.tag}>
            <Text style={estilos.tagTexto}>Nova conta</Text>
          </View>
          <Text style={estilos.titulo}>Criar{' \n'}conta.</Text>
        </View>

        <View style={estilos.form}>
          <Campo rotulo="Nome" valor={nome} aoAlterarTexto={definirNome} dica="Seu nome completo" />
          <Campo
            rotulo="Email"
            valor={email}
            aoAlterarTexto={definirEmail}
            dica="seu@email.com"
            tipoTeclado="email-address"
          />
          <Campo
            rotulo="Data de nascimento"
            valor={dataNascimento}
            aoAlterarTexto={(v) => definirDataNascimento(aplicarMascaraData(v))}
            dica="dd/mm/aaaa"
            tipoTeclado="numeric"
          />
          <Campo rotulo="Senha" valor={senha} aoAlterarTexto={definirSenha} dica="Mínimo 6 caracteres" seguro />
          <Campo
            rotulo="Confirmar senha"
            valor={confirmarSenha}
            aoAlterarTexto={definirConfirmarSenha}
            dica="Repita a senha"
            seguro
          />
          {!!erro && <Text style={estilos.textoErro}>{erro}</Text>}
          <Pressable style={estilos.botao} onPress={cadastrar} disabled={carregando}>
            {carregando
              ? <ActivityIndicator color={CORES.preto} />
              : <Text style={estilos.textoBotao}>Criar conta</Text>}
          </Pressable>
        </View>

        <Pressable style={estilos.linkArea} onPress={aoIrParaLogin}>
          <Text style={estilos.textoLink}>
            Já tem conta?{' '}
            <Text style={estilos.textoLinkDestaque}>Entrar</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  topo: {
    marginBottom: 36,
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
    fontSize: 52,
    fontWeight: '900',
    color: CORES.preto,
    letterSpacing: -2,
    lineHeight: 54,
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
