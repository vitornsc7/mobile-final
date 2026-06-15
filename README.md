# Como rodar o projeto

## Subir backend e banco com Docker

Na raiz do projeto, execute:

```bash
docker compose up -d
```

Isso irá subir o backend e o banco de dados.

## Rodar emulador Android

Inicie um dispositivo virtual em um emulador android.

## Rodar aplicação mobile

Com o emulador aberto, execute no terminal no diretório frontend que se encontra na raiz do projeto:

```bash
npx expo start --android
```

## Pré-requisitos

* Docker
* Docker Compose
* Node.js e npm
* Expo (via npx ou instalado globalmente)
* Android Studio com emulador configurado
