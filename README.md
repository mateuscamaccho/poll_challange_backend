# Poll Challenge — Backend

API em TypeScript/Express para gerenciamento de enquetes (polls). Inclui validação com Zod, persistência com Prisma/Postgres, documentação Swagger e testes com Jest.

Principais funcionalidades:
- Criar, listar, buscar por id e por status
- Editar enquetes (apenas quando status = `inactive`)
- Deletar enquetes (não permite deletar quando status = `closed`)
- Gerenciamento de opções (criação/substituição)
- Documentação OpenAPI (Swagger)
- Testes unitários dos controllers

---

## � Rápido começo

Pré-requisitos:
- Node.js >= 18
- npm
- Uma base PostgreSQL (local ou via Docker)

1) Instale dependências:

```bash
cd /c/workspace/poll_challange_backend
npm install
```

2) Variáveis de ambiente (exemplo `.env`):

```
PORT=3000
ENVIRONMENT=dev
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

3) Rodar em modo desenvolvimento (com reload):

```bash
npm run dev
```

4) Abrir a documentação Swagger:

- http://localhost:3000/docs

---

## 🧭 Scripts úteis

- npm run dev — inicia em modo desenvolvimento (ts-node-dev)
- npm run build — compila TypeScript
- npm start — inicia o bundle compilado (dist)
- npm run test — executa a suíte de testes (Jest)
- npm run migrate — executa migrações do Prisma
- npm run docker — sobe containers via Docker Compose (se houver configuração)

---

## 📚 Endpoints principais

Base: /api/poll

- GET /api/poll — lista todas as enquetes
- GET /api/poll/:id — obtém enquete por id
- GET /api/poll/status/:status — lista enquetes por status (inactive|active|running|closed)
- POST /api/poll — cria nova enquete (body com question, start_date, end_date, options)
- PUT /api/poll/:id — atualiza enquete (somente quando status = inactive)
- DELETE /api/poll/:id — deleta enquete (não permite se status = closed)

Consulte a UI do Swagger (`/docs`) para descrição completa de schemas e exemplos.

---

## ✅ Testes

Executar a suíte de testes:

```bash
npm run test
```

Os controllers têm testes unitários com mocks do Prisma. Veja `src/__tests__/poll.controller.spec.ts`.

---

## 🗄️ Prisma & Migrations

- Arquivo do schema: `prisma/schema.prisma`
- Rodar migrações (desenvolvimento):

```bash
npm run migrate
```

---

## 🐳 Executando com Docker

Se houver `docker-compose.yaml` configurado, você pode subir o ambiente com:

```bash
npm run docker
```

Verifique e ajuste as variáveis de ambiente para apontar para o serviço de banco do Docker.

---

## ✍️ Boas práticas / Observações

- Validações de entrada usam Zod, leia `src/schemas/poll.schemas.ts` para as regras (ex.: mínimo de opções, formatos de data).
- A API já expõe a documentação Swagger em `/docs` — útil para testar rapidamente com exemplos.

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch feature/x
3. Abra um PR com descrição clara

---

## 🧾 Licença

MIT
