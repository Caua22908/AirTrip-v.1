# AirTrip

Aplicativo de busca de voos, reservas e gerenciamento de usuarios. O projeto possui front-end em Expo/React Native, API em Node.js/Express, PostgreSQL e autenticacao JWT.

## 1. Pre-requisitos

Instale Node.js, npm, Docker Engine e Docker Compose. O PostgreSQL nao precisa ser instalado separadamente, pois roda em Docker.

Confira as instalacoes:

```bash
node --version
npm --version
docker --version
docker compose version
```

No Linux, se o Docker informar `permission denied`, execute:

```bash
sudo usermod -aG docker $USER
newgrp docker
sudo systemctl enable --now docker
```

## 2. Instalacao inicial

Execute esta etapa somente na primeira vez em cada computador.

### Dependencias do aplicativo

```bash
cd ~/AirTrip-v.1
npm install
```

### Dependencias do back-end

```bash
cd ~/AirTrip-v.1/backend
npm install
cp .env.example .env
```

O arquivo `backend/.env` usa estes valores locais por padrao:

```env
DB_NAME=airtrip
DB_USER=postgres
DB_PASS=admin
DB_HOST=localhost
DB_PORT=5432
PORT=3000
JWT_SECRET=change-this-secret
```

Em um ambiente real, altere `DB_PASS` e `JWT_SECRET`. O arquivo `.env` nao deve ser commitado.

## 3. Iniciar o banco de dados

Execute na pasta `backend`:

```bash
cd ~/AirTrip-v.1/backend
docker compose up -d database
docker compose ps
```

O servico deve aparecer como `running` ou `Up`.

O arquivo `backend/database.sql` e executado automaticamente na primeira inicializacao do volume e cria as tabelas `usuario`, `agendamento` e `notificacao`. Os dados ficam salvos no volume `airtrip-postgres-data`.

## 4. Iniciar o back-end

Abra um segundo terminal:

```bash
cd ~/AirTrip-v.1/backend
npm run dev
```

Quando estiver correto, aparecera:

```text
AirTrip API rodando na porta 3000
```

Teste no navegador:

```text
http://localhost:3000/health
```

Resposta esperada:

```json
{"status":"ok","service":"airtrip-api"}
```

## 5. Iniciar o aplicativo

Abra um terceiro terminal na raiz do projeto. Confira se o caminho termina em `AirTrip-v.1`, e nao em `AirTrip-v.1/backend`:

```bash
cd ~/AirTrip-v.1
npm start
```

Nao execute `npx expo start` ou `npm start` dentro de `backend`. Essa pasta e exclusiva da API Node.js; se o Expo for iniciado nela, ele pode tentar empacotar arquivos do servidor e gerar erros de dependencias como `pg-hstore`.

No menu do Expo, use `w` para navegador, `a` para emulador Android ou escaneie o QR Code com o Expo Go.

Tambem existem:

```bash
npm run android
npm run ios
npm run web
```

## 6. Configurar a URL da API

Para navegador ou emulador Android, o padrao e `http://localhost:3000`.

Para celular fisico, descubra o IP do computador:

```bash
hostname -I
```

Crie `.env` na raiz do projeto, ao lado do `package.json` do Expo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

Substitua o IP pelo valor correto. Computador e celular precisam estar na mesma rede Wi-Fi. Reinicie o Expo:

```bash
npm start -- --clear
```

## 7. Rotina diaria

Depois da instalacao inicial, use tres terminais.

Terminal 1, banco:

```bash
cd ~/AirTrip-v.1/backend
docker compose up -d database
```

Terminal 2, back-end:

```bash
cd ~/AirTrip-v.1/backend
npm run dev
```

Terminal 3, aplicativo:

```bash
cd ~/AirTrip-v.1
npx expo start
```

Digite cada comando separadamente. Nao cole `npm run dev` junto com outro comando na mesma linha.

## 8. Rotas principais da API

| Metodo | Rota | Uso |
| --- | --- | --- |
| POST | `/usuarios` | Criar usuario |
| POST | `/usuarios/login` | Fazer login e obter JWT |
| GET | `/usuarios` | Listar usuarios como administrador |
| PUT | `/usuarios/:id` | Atualizar usuario como administrador |
| DELETE | `/usuarios/:id` | Excluir usuario como administrador |
| GET | `/agendamentos` | Listar reservas do usuario autenticado |
| POST | `/agendamentos` | Criar reserva |
| PATCH | `/agendamentos/:id/cancelar` | Cancelar reserva |
| POST | `/agendamentos/:id/notificacoes` | Criar notificacao |

Rotas protegidas precisam do cabecalho `Authorization: Bearer SEU_TOKEN_JWT`.

## 9. Parar os servicos

Para parar o back-end, pressione `Ctrl+C` no terminal dele.

Para parar o banco sem apagar dados:

```bash
cd ~/AirTrip-v.1/backend
docker compose stop database
```

Para remover o container mantendo os dados:

```bash
docker compose down
```

Para apagar tambem os dados do banco, use somente se tiver certeza:

```bash
docker compose down -v
```

## 10. Solucao de problemas

### `ECONNREFUSED 127.0.0.1:5432`

O PostgreSQL nao esta aceitando conexoes:

```bash
cd ~/AirTrip-v.1/backend
docker compose up -d database
docker compose ps
```

Depois reinicie `npm run dev`.

### `permission denied while trying to connect to the Docker API`

O usuario ainda nao tem acesso ao Docker:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Se continuar, encerre a sessao do Linux, entre novamente e teste `docker ps`.

### `npm error Missing script: "dev~cd"`

Dois comandos foram colados juntos. Execute uma linha por vez:

```bash
npm run dev
```

### Porta `3000` ocupada

```bash
sudo lsof -i :3000
```

Encerre o processo ou altere `PORT` em `backend/.env`. Se alterar a porta, atualize tambem `EXPO_PUBLIC_API_URL`.

### Celular nao conecta na API

Confirme que o back-end esta rodando, que celular e computador estao na mesma rede, que o `.env` da raiz usa o IP do computador e que o firewall permite a porta `3000`.

## 11. Validacao

TypeScript do aplicativo:

```bash
cd ~/AirTrip-v.1
npx tsc --noEmit
```

Sintaxe do back-end:

```bash
cd ~/AirTrip-v.1/backend
find src -name '*.js' -print0 | xargs -0 -n1 node --check
```