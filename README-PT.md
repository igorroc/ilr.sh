# ilr.sh

Encurtador de links privado com paginas pessoais para reunir e compartilhar destinos importantes.

## Recursos

- Crie links curtos com slug gerado ou personalizado.
- Redirecione com seguranca somente para URLs HTTP e HTTPS validas.
- Ative, desative ou exclua links pelo painel privado.
- Publique uma pagina em `/@usuario` com links curtos ou URLs diretas.
- Use autenticacao por senha com sessoes persistidas no PostgreSQL.

## Stack

Next.js, React, TypeScript, Prisma, PostgreSQL, Tailwind CSS e Bun.

## Desenvolvimento

### Requisitos

- Bun 1.4.2+
- Docker e Docker Compose

### Configuracao

1. Clone o repositorio e instale as dependencias:

```bash
git clone https://github.com/igorroc/ilr.sh.git
cd ilr.sh
bun install --frozen-lockfile
```

2. Crie `.env` a partir de `.env.example` e configure o banco:

```env
DATABASE_DB="ilr-sh"
DATABASE_USER="postgres"
DATABASE_PASSWORD="uma_senha_segura"
POSTGRES_PRISMA_URL="postgresql://postgres:uma_senha_segura@localhost:5432/ilr-sh"
```

3. Inicie o PostgreSQL, aplique as migracoes e execute o projeto:

```bash
bun run compose:up
bun run migrate
bun run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

- `bun run dev`: inicia o servidor de desenvolvimento.
- `bun run build`: gera o build de producao.
- `bun run start`: inicia a aplicacao em producao.
- `bun run lint`: verifica o codigo com ESLint.
- `bun run ts-check`: verifica os tipos sem emitir arquivos.
- `bun run test`: executa os testes.
- `bun run migrate`: aplica migracoes locais e gera o Prisma Client.
- `bun run prisma:studio`: abre o Prisma Studio.

## Deploy

O projeto pode ser implantado na Vercel. Configure `POSTGRES_PRISMA_URL` com a URL do PostgreSQL de producao. O comando `vercel-build` gera o Prisma Client, aplica as migracoes pendentes e executa o build do Next.js.

O projeto fixa Bun `1.4.2` no `package.json`; mantenha essa versao ou uma mais recente no ambiente de build.

## Arquitetura

- `src/app`: paginas, painel, rotas de redirecionamento e perfil publico.
- `src/modules/links`: regras para criacao, validacao e resolucao de links.
- `src/modules/bio`: gerenciamento da pagina pessoal e seus links.
- `src/modules/auth`: autenticacao e sessoes.
- `prisma/schema`: modelos de usuarios, links, paginas e sessoes.

Consulte [ARCHITECTURE.md](ARCHITECTURE.md) para a estrutura detalhada.

## Licenca

[MIT](LICENSE)
