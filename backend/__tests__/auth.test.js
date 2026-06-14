/**
 * auth.test.js — Testes do módulo de Autenticação e Usuário (Backend)
 *
 * ABORDAGEM TDD: estes testes são escritos ANTES da implementação.
 * Ao rodar `npm test` agora, TODOS devem FALHAR (vermelho).
 * Implemente cada peça até que fiquem verdes, na ordem sugerida no PLANO_DE_EXECUCAO.md.
 *
 * Setup necessário (Fase 0):
 *   npm install --save-dev jest supertest
 *   npm install bcryptjs
 *
 * AJUSTE OS CAMINHOS DE IMPORT conforme a estrutura real do seu projeto.
 * Os caminhos abaixo assumem a estrutura descrita no CLAUDE.md.
 */

const fs = require('fs');
const path = require('path');
const request = require('supertest');


const { gerarToken } = require('../src/utils/token');
const userRepository = require('../src/repositories/userRepository');
const authService = require('../src/services/authService');
const app = require('../src/app'); // o app Express exportado (sem dar listen)


const DB_TEST_PATH = path.resolve(__dirname, '../db.test.json');

function resetDb() {
  // Zera o banco de teste antes de cada teste para isolamento total.
  fs.writeFileSync(
    DB_TEST_PATH,
    JSON.stringify({ users: [], expenses: [], limits: [] }, null, 2)
  );
}

const usuarioValido = {
  nome: 'João',
  email: 'joao@gmail.com',
  senha: 'senha123',
  dataNascimento: '1987-12-09',
};

beforeEach(() => {
  resetDb();
});


describe('utils/token — gerarToken()', () => {
  test('retorna uma string', () => {
    expect(typeof gerarToken()).toBe('string');
  });

  test('o token tem um tamanho mínimo razoável (>= 16 chars)', () => {
    expect(gerarToken().length).toBeGreaterThanOrEqual(16);
  });

  test('gera tokens diferentes a cada chamada (aleatoriedade)', () => {
    const t1 = gerarToken();
    const t2 = gerarToken();
    expect(t1).not.toBe(t2);
  });
});


describe('repositories/userRepository', () => {
  test('create() salva e retorna o usuário', () => {
    const novo = {
      id: 'u_1',
      nome: 'Maria',
      email: 'maria@x.com',
      senha: 'hash',
      dataNascimento: '1990-01-01',
      token: 'tok_1',
      createdAt: new Date().toISOString(),
    };
    const salvo = userRepository.create(novo);
    expect(salvo.id).toBe('u_1');
    expect(userRepository.findById('u_1')).toBeTruthy();
  });

  test('findByEmail() encontra usuário existente', () => {
    userRepository.create({
      id: 'u_2', nome: 'Ana', email: 'ana@x.com',
      senha: 'h', dataNascimento: '1991-02-02', token: 'tok_2',
      createdAt: new Date().toISOString(),
    });
    expect(userRepository.findByEmail('ana@x.com')).toBeTruthy();
  });

  test('findByEmail() retorna null/undefined quando não existe', () => {
    expect(userRepository.findByEmail('naoexiste@x.com')).toBeFalsy();
  });

  test('findByToken() encontra usuário pelo token', () => {
    userRepository.create({
      id: 'u_3', nome: 'Leo', email: 'leo@x.com',
      senha: 'h', dataNascimento: '1992-03-03', token: 'tok_3',
      createdAt: new Date().toISOString(),
    });
    const achado = userRepository.findByToken('tok_3');
    expect(achado).toBeTruthy();
    expect(achado.email).toBe('leo@x.com');
  });

  test('update() atualiza o token de um usuário existente', () => {
    userRepository.create({
      id: 'u_4', nome: 'Bia', email: 'bia@x.com',
      senha: 'h', dataNascimento: '1993-04-04', token: 'tok_old',
      createdAt: new Date().toISOString(),
    });
    const user = userRepository.findById('u_4');
    user.token = 'tok_new';
    userRepository.update(user);
    expect(userRepository.findByToken('tok_new')).toBeTruthy();
    expect(userRepository.findByToken('tok_old')).toBeFalsy();
  });
});


describe('services/authService — signup()', () => {
  test('cria usuário e retorna token + dados públicos', async () => {
    const res = await authService.signup(usuarioValido);
    expect(res.token).toBeTruthy();
    expect(res.user.nome).toBe('João');
    expect(res.user.email).toBe('joao@gmail.com');
    expect(res.user.id).toBeTruthy();
  });

  test('NUNCA retorna a senha (nem o hash) no resultado', async () => {
    const res = await authService.signup(usuarioValido);
    expect(res.user.senha).toBeUndefined();
  });

  test('salva a senha com HASH, não em texto puro', async () => {
    await authService.signup(usuarioValido);
    const salvo = userRepository.findByEmail('joao@gmail.com');
    expect(salvo.senha).not.toBe('senha123');
  });

  test('rejeita email duplicado com status 409', async () => {
    await authService.signup(usuarioValido);
    await expect(authService.signup(usuarioValido)).rejects.toMatchObject({
      status: 409,
    });
  });
});

describe('services/authService — signin()', () => {
  beforeEach(async () => {
    await authService.signup(usuarioValido);
  });

  test('loga com credenciais corretas e retorna token', async () => {
    const res = await authService.signin({
      email: 'joao@gmail.com',
      senha: 'senha123',
    });
    expect(res.token).toBeTruthy();
    expect(res.user.email).toBe('joao@gmail.com');
  });

  test('gera um token NOVO a cada login', async () => {
    const r1 = await authService.signin({ email: 'joao@gmail.com', senha: 'senha123' });
    const r2 = await authService.signin({ email: 'joao@gmail.com', senha: 'senha123' });
    expect(r1.token).not.toBe(r2.token);
  });

  test('rejeita senha incorreta com status 401', async () => {
    await expect(
      authService.signin({ email: 'joao@gmail.com', senha: 'errada' })
    ).rejects.toMatchObject({ status: 401 });
  });

  test('rejeita email inexistente com status 401', async () => {
    await expect(
      authService.signin({ email: 'naoexiste@x.com', senha: 'senha123' })
    ).rejects.toMatchObject({ status: 401 });
  });

  test('signin não vaza a senha no resultado', async () => {
    const res = await authService.signin({ email: 'joao@gmail.com', senha: 'senha123' });
    expect(res.user.senha).toBeUndefined();
  });
});


describe('POST /auth/signup', () => {
  test('201 ao cadastrar usuário válido', async () => {
    const res = await request(app).post('/auth/signup').send(usuarioValido);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe('joao@gmail.com');
  });

  test('não retorna a senha no corpo da resposta', async () => {
    const res = await request(app).post('/auth/signup').send(usuarioValido);
    expect(res.body.user.senha).toBeUndefined();
  });

  test('409 ao cadastrar email já existente', async () => {
    await request(app).post('/auth/signup').send(usuarioValido);
    const res = await request(app).post('/auth/signup').send(usuarioValido);
    expect(res.status).toBe(409);
  });
});

describe('POST /auth/signin', () => {
  beforeEach(async () => {
    await request(app).post('/auth/signup').send(usuarioValido);
  });

  test('200 com credenciais corretas', async () => {
    const res = await request(app)
      .post('/auth/signin')
      .send({ email: 'joao@gmail.com', senha: 'senha123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  test('401 com senha incorreta', async () => {
    const res = await request(app)
      .post('/auth/signin')
      .send({ email: 'joao@gmail.com', senha: 'errada' });
    expect(res.status).toBe(401);
  });
});

describe('GET /users/me (rota protegida)', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/auth/signup').send(usuarioValido);
    token = res.body.token;
  });

  test('401 sem token', async () => {
    const res = await request(app).get('/users/me');
    expect(res.status).toBe(401);
  });

  test('401 com token inválido', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer tok_invalido_123');
    expect(res.status).toBe(401);
  });

  test('200 com token válido retorna os dados do usuário', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('joao@gmail.com');
    expect(res.body.nome).toBe('João');
  });

  test('a resposta de /users/me não inclui a senha', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.senha).toBeUndefined();
  });
});
