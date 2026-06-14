import { obterToken } from '../utils/storage';

const URL_API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function requisicaoApi(caminho, opcoes = {}) {
  const token = await obterToken();

  const resposta = await fetch(`${URL_API}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opcoes.headers || {}),
    },
  });

  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.message || 'Erro ao comunicar com a API!');
  }

  return dados;
}
