# Sistema Fraternidade Transparente

Sistema de Gestão Financeira e Auditoria para a Associação Lar São Francisco de Assis.

## 🚀 Como Rodar o Projeto

Este projeto consiste em um Backend (API) e um Frontend (Interface). Ambos precisam estar rodando simultaneamente.

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **PostgreSQL** (Rodando localmente)

---

### 1️⃣ Configurando o Backend (API)

1. Abra um terminal e entre na pasta `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o Banco de Dados:
   - Certifique-se de que o PostgreSQL está rodando.
   - O arquivo `.env` já está configurado para conectar em `localhost:5432` com usuário `postgres` e senha `admin`. Ajuste se necessário.

4. Crie as tabelas e popule o banco (apenas na primeira vez):
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```
   ✅ Você verá: `Server running on http://localhost:3000`

---

### 2️⃣ Rodando o Frontend (Interface)

1. Abra um **novo terminal** na raiz do projeto (fora da pasta backend).

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npm run dev
   ```
   ✅ Você verá: `Local: http://localhost:8080/`

---

### 🔑 Acesso ao Sistema

Abra seu navegador em **http://localhost:8080**

**Credenciais de Administrador:**
- **Email:** `admin@fraternidade.org`
- **Senha:** `admin123`

---

## 📚 Documentação Técnica

Para detalhes completos sobre a arquitetura, tecnologias e manutenção, consulte o arquivo:
👉 [DOCUMENTACAO_MIGRACAO.md](./DOCUMENTACAO_MIGRACAO.md)

## ✅ Checklist de QA

Para validar as funcionalidades do sistema, siga o roteiro de testes:
👉 [CHECKLIST_QA.md](./CHECKLIST_QA.md)
