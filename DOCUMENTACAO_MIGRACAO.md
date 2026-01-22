# Manual Técnico - Sistema Fraternidade Transparente

Este documento consolida todas as informações técnicas, arquiteturais e de manutenção do sistema "Fraternidade Transparente". Ele serve como guia definitivo para novos desenvolvedores e para referência futura.

---

## 1. Visão Geral do Projeto

O **Sistema Fraternidade Transparente** é uma plataforma de gestão financeira e auditoria desenvolvida para a Associação Lar São Francisco de Assis. Seu objetivo é permitir o lançamento transparente de despesas, upload de comprovantes fiscais e um fluxo de auditoria rigoroso.

O sistema opera em uma arquitetura **Full Stack Monorepo** (logicamente separado), onde Frontend e Backend residem no mesmo repositório mas operam como serviços distintos.

---

## 2. Tecnologias Utilizadas

### 2.1. Frontend (Interface)
- **Framework:** React 18.3 (via Vite 5.4)
- **Linguagem:** TypeScript 5.8
- **UI Library:** Shadcn UI (baseado em Radix UI)
- **Estilização:** Tailwind CSS 3.4
- **Gerenciamento de Estado:** React Hooks (useState, useEffect, useContext)
- **Roteamento:** React Router DOM 6.30
- **Comunicação HTTP:** Axios 1.13 (com Interceptors)
- **Ícones:** Lucide React
- **Formulários:** React Hook Form + Zod (Validação)
- **Exportação de Dados:** SheetJS (xlsx)

### 2.2. Backend (API)
- **Runtime:** Node.js (v18+)
- **Framework:** Express 5.2
- **Linguagem:** TypeScript 5.9 (executado via `ts-node`)
- **ORM:** Prisma 5.22
- **Banco de Dados:** PostgreSQL (Local)
- **Autenticação:** JWT (JSON Web Token) + Bcrypt.js
- **Uploads:** Multer (Armazenamento em disco local)
- **CORS:** Habilitado para comunicação local

---

## 3. Arquitetura e Fluxo de Dados

### 3.1. Diagrama de Fluxo
```
[Usuário] <-> [React Frontend] <-> [Axios Interceptor] <-> [Express API] <-> [Prisma ORM] <-> [PostgreSQL]
                                                                  |
                                                                  v
                                                            [Pasta /uploads] (Arquivos Estáticos)
```

### 3.2. Padrões de Projeto
- **MVC (Adaptado):** O Backend segue uma estrutura simplificada onde `server.ts` atua como Controller e Router, delegando a persistência para o Prisma (Model).
- **Interceptor Pattern:** O Frontend utiliza interceptadores do Axios para injetar automaticamente o token JWT em todas as requisições autenticadas.
- **Static File Serving:** O Backend serve a pasta `uploads` como uma rota estática pública, permitindo que links diretos (`http://localhost:3000/uploads/...`) funcionem no navegador.

---

## 4. Estrutura de Pastas

### Raiz do Projeto (`/`)
- `src/`: Código fonte do Frontend React.
  - `pages/`: Componentes de página (Login, Dashboard, Lançamentos).
  - `components/`: Componentes reutilizáveis (UI Shadcn, Header, Sidebar).
  - `services/`: Configuração do Axios (`api.ts`).
  - `hooks/`: Hooks customizados (ex: `use-toast`).
- `backend/`: Código fonte do Backend Node.js.
  - `src/server.ts`: Ponto de entrada da API, rotas e lógica.
  - `src/seed.ts`: Script para popular o banco de dados inicialmente.
  - `prisma/schema.prisma`: Definição das tabelas e relacionamentos.
  - `uploads/`: Diretório onde notas e comprovantes são salvos.

---

## 5. Funcionalidades Principais (Detalhes de Implementação)

### 5.1. Autenticação (JWT)
1.  **Login:** Usuário envia credenciais para `POST /login`.
2.  **Token:** Backend valida e retorna um `accessToken`.
3.  **Armazenamento:** Frontend salva o token no `localStorage`.
4.  **Uso:** O arquivo `src/services/api.ts` intercepta toda requisição e adiciona `Authorization: Bearer <token>`.

### 5.2. Upload de Arquivos
1.  **Frontend:** Usa `FormData` para encapsular campos de texto e arquivos (`File` objects) em uma única requisição `multipart/form-data`.
2.  **Backend:** O middleware `multer` intercepta a rota `POST /transactions`.
3.  **Renomeação:** Arquivos são renomeados para `timestamp-random.ext` para evitar conflitos.
4.  **Persistência:** O arquivo vai para o disco (`backend/uploads`) e a URL relativa é salva no banco (`invoiceUrl`, `receiptUrl`).

### 5.3. Auditoria
- Transações iniciam com status `PENDING`.
- Usuários podem visualizar os anexos clicando nos botões "Ver Nota Fiscal" (abre a URL estática em nova aba).
- Ações de `APPROVED` ou `REJECTED` atualizam o status no banco via `PUT /transactions/:id/status`.

### 5.4. Exportação de Relatórios (Excel)
- Localizada na página de **Lançamentos**.
- Utiliza a biblioteca `xlsx` (SheetJS) no frontend.
- **Comportamento:** O botão de download gera uma planilha `.xlsx` baseada nos dados **atualmente filtrados** na tela (respeitando a busca por texto, filtro de status e unidade).
- **Formatação:** Os dados são tratados antes da exportação (ex: datas em formato PT-BR, valores numéricos para cálculo).

---

## 6. Banco de Dados (Schema Simplificado)

O banco de dados PostgreSQL é gerenciado pelo Prisma com as seguintes tabelas principais:

- **User:** Usuários do sistema (Admin, Gestores).
- **Unit:** Unidades da associação (ex: Sede, Centro Social).
- **CostCenter:** Categorias de despesa (ex: Alimentação, Transporte).
- **Transaction:** Lançamentos financeiros (contém FKs para Unit, CostCenter, User e URLs de arquivos).
- **AuditLog:** Registro de ações críticas (quem aprovou/rejeitou).

---

## 7. Configuração e Manutenção

### 7.1. Variáveis de Ambiente (`backend/.env`)
```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/fraternidade_db?schema=public"
JWT_SECRET="sua_chave_secreta_super_segura"
PORT=3000
```

### 7.2. Scripts Úteis
No diretório `backend/`:
- `npm run dev`: Inicia o servidor em modo de desenvolvimento.
- `npx prisma migrate dev`: Cria novas tabelas baseadas em alterações no `schema.prisma`.
- `npm run seed`: Reseta/Popula o banco com dados padrão.
- `npx prisma studio`: Abre uma interface web para visualizar o banco de dados.

No diretório raiz (Frontend):
- `npm run dev`: Inicia o servidor de desenvolvimento do Vite (Porta 8080).

### 7.3. Checklist de QA
Para validar o funcionamento do sistema, utilize o roteiro de testes disponível em:
👉 [CHECKLIST_QA.md](./CHECKLIST_QA.md)
