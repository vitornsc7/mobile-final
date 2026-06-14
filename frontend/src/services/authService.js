import { obterToken } from '../utils/storage';

const URL_API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${URL_API}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(opcoes.headers || {}),
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.message || 'Erro ao comunicar com a API.');
  }

  return dados;
}

export async function signup({ nome, email, senha, dataNascimento }) {
  return requisicao('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha, dataNascimento }),
  });
}

export async function signin({ email, senha }) {
  return requisicao('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export async function getMe() {
  const token = await obterToken();
  return requisicao('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
