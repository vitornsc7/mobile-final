const URL_API = 'http://localhost:3000';
const TOKEN_DEMO = 'demo-token';
const USUARIO_DEMO_ID = 'demo-user';

export async function requisicaoApi(caminho, opcoes = {}) {
  const resposta = await fetch(`${URL_API}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_DEMO}`,
      'x-user-id': USUARIO_DEMO_ID,
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
