import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_TOKEN = '@auth_token';
const CHAVE_USUARIO = '@auth_user';

export async function salvarAuth(token, user) {
  await AsyncStorage.setItem(CHAVE_TOKEN, token);
  await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(user));
}

export async function obterToken() {
  return AsyncStorage.getItem(CHAVE_TOKEN);
}

export async function obterUsuario() {
  const json = await AsyncStorage.getItem(CHAVE_USUARIO);
  return json ? JSON.parse(json) : null;
}

export async function limparAuth() {
  await AsyncStorage.multiRemove([CHAVE_TOKEN, CHAVE_USUARIO]);
}
