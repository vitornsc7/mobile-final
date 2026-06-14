import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    if (
      dataObj.getFullYear() !== ano ||
      dataObj.getMonth() + 1 !== mes ||
      dataObj.getDate() !== dia
    ) {
      return 'Data inválida.';
    }

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
    if (erroData) {
      definirErro(erroData);
      return;
    }

    if (senha !== confirmarSenha) {
      definirErro('As senhas não coincidem.');
      return;
    }

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
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>CRIAR</Text>
        </View>

        <Campo
          rotulo="Nome"
          valor={nome}
          aoAlterarTexto={definirNome}
          dica="Seu nome completo"
        />
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
        <Campo
          rotulo="Senha"
          valor={senha}
          aoAlterarTexto={definirSenha}
          dica="Mínimo 6 caracteres"
          seguro
        />
        <Campo
          rotulo="Confirmar senha"
          valor={confirmarSenha}
          aoAlterarTexto={definirConfirmarSenha}
          dica="Repita a senha"
          seguro
        />

        {!!erro && <Text style={estilos.textoErro}>{erro}</Text>}

        <Pressable style={estilos.botaoPrincipal} onPress={cadastrar} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={CORES.branco} />
            : <Text style={estilos.textoBotaoPrincipal}>CRIAR</Text>
          }
        </Pressable>

        <Pressable style={estilos.linkLogin} onPress={aoIrParaLogin}>
          <Text style={estilos.textoLink}>Voltar</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 36,
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
  linkLogin: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  textoLink: {
    color: CORES.textoSuave,
    fontWeight: '600',
  },
});
