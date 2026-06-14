import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { TelaCelular } from './src/components/TelaCelular';
import { TelaInicio } from './src/screens/TelaInicio';
import { TelaDespesa } from './src/screens/TelaDespesa';
import { TelaLimite } from './src/screens/TelaLimite';
import { TelaPerfil } from './src/screens/TelaPerfil';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { requisicaoApi } from './src/services/api';
import { getMe } from './src/services/authService';
import { obterUsuario, limparAuth } from './src/utils/storage';
import { CORES } from './src/theme/colors';
import { obterMesReferenciaAtual, mesReferenciaAnterior, validarMesReferencia } from './src/utils/dateUtils';

export default function App() {
  const [usuario, definirUsuario] = useState(null);
  const [verificandoAuth, definirVerificandoAuth] = useState(true);
  const [telaAuth, definirTelaAuth] = useState('login');

  const [telaAtiva, definirTelaAtiva] = useState('inicio');
  const [mesSelecionado, definirMesSelecionado] = useState('');
  const [mesesCadastrados, definirMesesCadastrados] = useState([]);
  const [despesas, definirDespesas] = useState([]);
  const [limites, definirLimites] = useState([]);
  const [carregando, definirCarregando] = useState(false);
  const [despesaEmEdicao, definirDespesaEmEdicao] = useState(null);
  const [limiteEmEdicao, definirLimiteEmEdicao] = useState(null);
  const [mensagemErroLimite, definirMensagemErroLimite] = useState('');
  const [formularioDespesa, definirFormularioDespesa] = useState({
    descricao: '',
    valor: '',
    mesReferencia: obterMesReferenciaAtual(),
  });
  const [formularioLimite, definirFormularioLimite] = useState({
    valor: '',
    mesReferencia: obterMesReferenciaAtual(),
  });

  useEffect(() => {
    async function verificarSessao() {
      try {
        const usuarioSalvo = await obterUsuario();
        if (usuarioSalvo) {
          const dadosAtuais = await getMe();
          definirUsuario(dadosAtuais);
        }
      } catch {
        await limparAuth();
      } finally {
        definirVerificandoAuth(false);
      }
    }

    verificarSessao();
  }, []);

  useEffect(() => {
    if (!usuario) return;

    async function iniciarTela() {
      try {
        const meses = await carregarMesesCadastrados();
        if (meses.length > 0) {
          const mesAtual = obterMesReferenciaAtual();
          const mesParaSelecionar = meses.includes(mesAtual) ? mesAtual : meses[0];
          definirMesSelecionado(mesParaSelecionar);
          await carregarDados(mesParaSelecionar);
        } else {
          definirDespesas([]);
          definirLimites([]);
        }
      } catch (erro) {
        Alert.alert('Erro', erro.message);
      }
    }

    iniciarTela();
  }, [usuario]);

  function aoAutenticar(user) {
    definirUsuario(user);
  }

  async function aoSair() {
    await limparAuth();
    definirUsuario(null);
    definirTelaAtiva('inicio');
    definirMesSelecionado('');
    definirMesesCadastrados([]);
    definirDespesas([]);
    definirLimites([]);
    definirTelaAuth('login');
  }

  const totalDespesas = useMemo(() => {
    return despesas.reduce((total, despesa) => total + Number(despesa.valor), 0);
  }, [despesas]);

  const limiteAtual = limites[0];

  function extrairMesesCadastrados(listaDespesas, listaLimites) {
    const meses = new Set();

    listaDespesas.forEach((despesa) => {
      if (despesa.mesReferencia) {
        meses.add(despesa.mesReferencia);
      }
    });

    listaLimites.forEach((limite) => {
      if (limite.mesReferencia) {
        meses.add(limite.mesReferencia);
      }
    });

    return Array.from(meses).sort().reverse();
  }

  async function carregarMesesCadastrados() {
    const [listaDespesas, listaLimites] = await Promise.all([
      requisicaoApi('/expenses'),
      requisicaoApi('/monthly-limits'),
    ]);

    const meses = extrairMesesCadastrados(listaDespesas, listaLimites);
    definirMesesCadastrados(meses);

    return meses;
  }

  async function carregarDados(mes = mesSelecionado) {
    if (!validarMesReferencia(mes)) {
      definirDespesas([]);
      definirLimites([]);
      return;
    }

    definirCarregando(true);

    try {
      const [listaDespesas, listaLimites] = await Promise.all([
        requisicaoApi(`/expenses?mes=${mes}`),
        requisicaoApi(`/monthly-limits?mes=${mes}`),
      ]);

      definirDespesas(listaDespesas);
      definirLimites(listaLimites);
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    } finally {
      definirCarregando(false);
    }
  }

  function alterarFormularioDespesa(campo, valor) {
    definirFormularioDespesa((atual) => ({ ...atual, [campo]: valor }));
  }

  function alterarFormularioLimite(campo, valor) {
    definirMensagemErroLimite('');
    definirFormularioLimite((atual) => ({ ...atual, [campo]: valor }));
  }

  function validarMesEditavel(mesReferencia, rotuloTipo) {
    if (!validarMesReferencia(mesReferencia)) {
      Alert.alert('Validacao', 'Use o mes no formato YYYY-MM.');
      return false;
    }

    if (mesReferenciaAnterior(mesReferencia)) {
      Alert.alert('Validacao', `Nao e permitido cadastrar ou alterar ${rotuloTipo} de meses anteriores.`);
      return false;
    }

    return true;
  }

  async function selecionarMesCadastrado(mes) {
    definirMesSelecionado(mes);
    await carregarDados(mes);
  }

  async function salvarDespesa() {
    const dadosDespesa = {
      descricao: formularioDespesa.descricao.trim(),
      valor: Number(formularioDespesa.valor.replace(',', '.')),
      mesReferencia: formularioDespesa.mesReferencia,
    };

    if (!dadosDespesa.descricao || !formularioDespesa.valor.trim() || !dadosDespesa.mesReferencia) {
      Alert.alert('Validacao', 'Preencha descricao, valor e mes.');
      return;
    }

    if (!Number.isFinite(dadosDespesa.valor) || dadosDespesa.valor <= 0) {
      Alert.alert('Validacao', 'Informe um valor maior que zero.');
      return;
    }

    if (!despesaEmEdicao && !validarMesEditavel(dadosDespesa.mesReferencia, 'despesas')) {
      return;
    }

    try {
      if (despesaEmEdicao) {
        await requisicaoApi(`/expenses/${despesaEmEdicao.id}`, {
          method: 'PUT',
          body: JSON.stringify(dadosDespesa),
        });
      } else {
        await requisicaoApi('/expenses', {
          method: 'POST',
          body: JSON.stringify(dadosDespesa),
        });
      }

      definirMesSelecionado(dadosDespesa.mesReferencia);
      definirFormularioDespesa({ descricao: '', valor: '', mesReferencia: dadosDespesa.mesReferencia });
      definirDespesaEmEdicao(null);
      await carregarMesesCadastrados();
      await carregarDados(dadosDespesa.mesReferencia);
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    }
  }

  async function salvarLimite() {
    const dadosLimite = {
      valor: Number(formularioLimite.valor.replace(',', '.')),
      mesReferencia: formularioLimite.mesReferencia,
    };

    if (!formularioLimite.valor.trim() || !dadosLimite.mesReferencia) {
      definirMensagemErroLimite('Preencha valor e mês.');
      Alert.alert('Validacao', 'Preencha valor e mes.');
      return;
    }

    if (!Number.isFinite(dadosLimite.valor) || dadosLimite.valor <= 0) {
      definirMensagemErroLimite('Informe um valor maior que zero.');
      Alert.alert('Validacao', 'Informe um valor maior que zero.');
      return;
    }

    if (!limiteEmEdicao && !validarMesEditavel(dadosLimite.mesReferencia, 'limites')) {
      definirMensagemErroLimite('Não é permitido cadastrar limites de meses anteriores.');
      return;
    }

    try {
      definirMensagemErroLimite('');

      if (limiteEmEdicao) {
        await requisicaoApi(`/monthly-limits/${limiteEmEdicao.id}`, {
          method: 'PUT',
          body: JSON.stringify(dadosLimite),
        });
      } else {
        const limitesCadastrados = await requisicaoApi('/monthly-limits');
        const limiteJaExiste = limitesCadastrados.some((limite) => limite.mesReferencia === dadosLimite.mesReferencia);

        if (limiteJaExiste) {
          const mensagem = 'Esse mês já possui um limite cadastrado. Você pode editar o limite existente.';
          definirMensagemErroLimite(mensagem);
          Alert.alert('Erro', mensagem);
          return;
        }

        await requisicaoApi('/monthly-limits', {
          method: 'POST',
          body: JSON.stringify(dadosLimite),
        });
      }

      definirMesSelecionado(dadosLimite.mesReferencia);
      definirFormularioLimite({ valor: '', mesReferencia: dadosLimite.mesReferencia });
      definirLimiteEmEdicao(null);
      await carregarMesesCadastrados();
      await carregarDados(dadosLimite.mesReferencia);
    } catch (erro) {
      definirMensagemErroLimite(erro.message);
      Alert.alert('Erro', erro.message);
    }
  }

  function editarDespesa(despesa) {
    definirDespesaEmEdicao(despesa);
    definirFormularioDespesa({
      descricao: despesa.descricao,
      valor: String(despesa.valor),
      mesReferencia: despesa.mesReferencia,
    });
  }

  function editarLimite(limite) {
    definirMensagemErroLimite('');
    definirLimiteEmEdicao(limite);
    definirFormularioLimite({
      valor: String(limite.valor),
      mesReferencia: limite.mesReferencia,
    });
  }

  async function atualizarMesAposExclusao() {
    const meses = await carregarMesesCadastrados();

    if (meses.length === 0) {
      definirMesSelecionado('');
      definirDespesas([]);
      definirLimites([]);
      return;
    }

    const mesParaExibir = meses.includes(mesSelecionado) ? mesSelecionado : meses[0];
    definirMesSelecionado(mesParaExibir);
    await carregarDados(mesParaExibir);
  }

  async function excluirDespesa(despesa) {
    if (mesReferenciaAnterior(despesa.mesReferencia)) {
      Alert.alert('Validacao', 'Nao e permitido excluir despesas de meses anteriores.');
      return;
    }

    try {
      await requisicaoApi(`/expenses/${despesa.id}`, { method: 'DELETE' });
      await atualizarMesAposExclusao();
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    }
  }

  async function excluirLimite(limite) {
    if (mesReferenciaAnterior(limite.mesReferencia)) {
      Alert.alert('Validacao', 'Nao e permitido excluir limites de meses anteriores.');
      return;
    }

    try {
      await requisicaoApi(`/monthly-limits/${limite.id}`, { method: 'DELETE' });
      await atualizarMesAposExclusao();
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    }
  }

  function trocarTela(tela) {
    definirTelaAtiva(tela);
  }

  function renderizarTela() {
    if (carregando) {
      return (
        <View style={estilos.carregando}>
          <ActivityIndicator color={CORES.verde} />
        </View>
      );
    }

    if (telaAtiva === 'inicio') {
      return (
        <TelaInicio
          usuario={usuario}
          mesSelecionado={mesSelecionado}
          mesesCadastrados={mesesCadastrados}
          totalDespesas={totalDespesas}
          limiteAtual={limiteAtual}
          aoSelecionarMes={selecionarMesCadastrado}
          aoIrParaDespesa={() => trocarTela('despesas')}
          aoIrParaLimite={() => trocarTela('limites')}
        />
      );
    }

    if (telaAtiva === 'despesas') {
      return (
        <TelaDespesa
          mesSelecionado={mesSelecionado}
          aoSelecionarMes={selecionarMesCadastrado}
          despesas={despesas}
          formularioDespesa={formularioDespesa}
          despesaEmEdicao={despesaEmEdicao}
          aoAlterarFormulario={alterarFormularioDespesa}
          aoSalvar={salvarDespesa}
          aoEditar={editarDespesa}
          aoExcluir={excluirDespesa}
          aoCancelarEdicao={() => {
            definirDespesaEmEdicao(null);
            definirFormularioDespesa({ descricao: '', valor: '', mesReferencia: mesSelecionado || obterMesReferenciaAtual() });
          }}
        />
      );
    }

    if (telaAtiva === 'limites') {
      return (
        <TelaLimite
          mesSelecionado={mesSelecionado}
          limites={limites}
          formularioLimite={formularioLimite}
          mensagemErro={mensagemErroLimite}
          limiteEmEdicao={limiteEmEdicao}
          aoAlterarFormulario={alterarFormularioLimite}
          aoSalvar={salvarLimite}
          aoEditar={editarLimite}
          aoExcluir={excluirLimite}
          aoSelecionarMesConsulta={selecionarMesCadastrado}
          aoCancelarEdicao={() => {
            definirLimiteEmEdicao(null);
            definirMensagemErroLimite('');
            definirFormularioLimite({ valor: '', mesReferencia: mesSelecionado || obterMesReferenciaAtual() });
          }}
        />
      );
    }

    return <TelaPerfil usuario={usuario} aoSair={aoSair} />;
  }

  if (verificandoAuth) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color={CORES.verde} />
      </View>
    );
  }

  if (!usuario) {
    if (telaAuth === 'cadastro') {
      return (
        <SignupScreen
          aoAutenticar={aoAutenticar}
          aoIrParaLogin={() => definirTelaAuth('login')}
        />
      );
    }
    return (
      <LoginScreen
        aoAutenticar={aoAutenticar}
        aoIrParaCadastro={() => definirTelaAuth('cadastro')}
      />
    );
  }

  return (
    <TelaCelular telaAtiva={telaAtiva} aoTrocarTela={trocarTela}>
      {renderizarTela()}
    </TelaCelular>
  );
}

const estilos = StyleSheet.create({
  carregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CORES.superficie,
  },
});
