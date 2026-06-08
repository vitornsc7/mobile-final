import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { TelaCelular } from './src/components/TelaCelular';
import { TelaInicio } from './src/screens/TelaInicio';
import { TelaDespesa } from './src/screens/TelaDespesa';
import { TelaLimite } from './src/screens/TelaLimite';
import { TelaPerfil } from './src/screens/TelaPerfil';
import { requisicaoApi } from './src/services/api';
import { CORES } from './src/theme/colors';
import { obterMesReferenciaAtual, mesReferenciaAnterior, validarMesReferencia } from './src/utils/dateUtils';

export default function App() {
  const [telaAtiva, definirTelaAtiva] = useState('inicio');
  const [mesSelecionado, definirMesSelecionado] = useState('');
  const [mesesCadastrados, definirMesesCadastrados] = useState([]);
  const [seletorMesAberto, definirSeletorMesAberto] = useState(false);
  const [despesas, definirDespesas] = useState([]);
  const [limites, definirLimites] = useState([]);
  const [carregando, definirCarregando] = useState(false);
  const [despesaEmEdicao, definirDespesaEmEdicao] = useState(null);
  const [limiteEmEdicao, definirLimiteEmEdicao] = useState(null);
  const [mensagemErroLimite, definirMensagemErroLimite] = useState('');
  const [formularioDespesa, definirFormularioDespesa] = useState({
    descricao: '',
    valor: '',
    mesReferencia: '',
  });
  const [formularioLimite, definirFormularioLimite] = useState({
    valor: '',
    mesReferencia: obterMesReferenciaAtual(),
  });

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

  useEffect(() => {
    async function iniciarTela() {
      try {
        await carregarMesesCadastrados();
        definirDespesas([]);
        definirLimites([]);
      } catch (erro) {
        Alert.alert('Erro', erro.message);
      }
    }

    iniciarTela();
  }, []);

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
    definirSeletorMesAberto(false);
    definirMesSelecionado(mes);
    await carregarDados(mes);
  }

  function alternarSeletorMes() {
    definirSeletorMesAberto((atual) => !atual);
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
      definirFormularioDespesa({ descricao: '', valor: '', mesReferencia: '' });
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
    definirSeletorMesAberto(false);
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
          mesSelecionado={mesSelecionado}
          mesesCadastrados={mesesCadastrados}
          seletorMesAberto={seletorMesAberto}
          totalDespesas={totalDespesas}
          limiteAtual={limiteAtual}
          aoAbrirSeletorMes={alternarSeletorMes}
          aoFecharSeletorMes={() => definirSeletorMesAberto(false)}
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
          mesesCadastrados={mesesCadastrados}
          seletorMesAberto={seletorMesAberto}
          aoAbrirSeletorMes={alternarSeletorMes}
          aoFecharSeletorMes={() => definirSeletorMesAberto(false)}
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
            definirFormularioDespesa({ descricao: '', valor: '', mesReferencia: '' });
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

    return <TelaPerfil />;
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
});
