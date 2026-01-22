# Diretrizes Técnicas e Arquitetura de Migração
## Projeto: Fraternidade Transparente

### 1. Visão Geral
Este documento estabelece os padrões técnicos e arquiteturais para a migração do frontend estático (Lovable/React) para uma aplicação Full Stack escalável e multiusuário.

### 2. Stack Tecnológica Definida
- **Frontend:** React + Vite + TypeScript (Mantido do original).
- **Backend:** Node.js (Express ou NestJS).
- **Banco de Dados:** PostgreSQL.
- **ORM:** Prisma (Para tipagem segura e migrações).
- **Infraestrutura:** Execução Local (Node.js + PostgreSQL instalado no SO).

### 3. Modelagem de Dados (Schema Canônico)
Baseado na análise das interfaces (`Lancamentos.tsx`, `Configuracoes.tsx`, `Auditoria.tsx`), esta é a estrutura relacional obrigatória:

#### 3.1. Tabelas Principais
1.  **users**
    *   *Objetivo:* Controle de acesso e auditoria.
    *   *Campos:* `id` (UUID), `email` (Unique), `password_hash`, `role` (ENUM: ADMIN, AUDITOR, USER), `created_at`.
2.  **units** (Ref: Unidades)
    *   *Objetivo:* Cadastro de locais físicos.
    *   *Campos:* `id`, `name`, `address`, `responsible_person`.
3.  **cost_centers** (Ref: Centros de Custo/Categorias)
    *   *Objetivo:* Classificação contábil.
    *   *Campos:* `id`, `code` (ex: CC-001), `name`, `description`.
4.  **transactions** (Ref: Lançamentos)
    *   *Objetivo:* Coração do sistema financeiro.
    *   *Campos:* `id`, `unit_id` (FK), `cost_center_id` (FK), `supplier_name`, `supplier_cnpj`, `amount` (Decimal), `date`, `description`, `status` (ENUM: PENDING, APPROVED, REJECTED), `invoice_url`, `receipt_url`, `created_by_user_id` (FK).
5.  **audit_logs** (Ref: Auditoria)
    *   *Objetivo:* Rastreabilidade de ações sensíveis.
    *   *Campos:* `id`, `transaction_id` (FK), `auditor_user_id` (FK), `action` (APPROVE/REJECT), `reason` (Text), `created_at`.

### 4. Diretrizes de Desenvolvimento

#### 4.1. Backend & API
- **Autenticação:** Obrigatório uso de **JWT (JSON Web Token)**. O frontend deve enviar o token no header `Authorization: Bearer <token>`.
- **Gestão de Arquivos:** Arquivos (Notas/Comprovantes) **NÃO** devem ser salvos no banco como BLOB.
    - *Dev:* Salvar em diretório local do projeto (ex: `./uploads`).
    - *Prod:* Salvar em Object Storage (S3/MinIO) e persistir apenas a URL na tabela `transactions`.
- **Validações:** Replicar todas as regras de negócio (CNPJ, Valores Positivos) no backend usando bibliotecas como `Zod` ou `Joi`.

#### 4.2. Frontend (Adaptação)
- **Desacoplamento:** Remover arrays estáticos (`const lancamentos = [...]`). Criar Services/Hooks para consumir a API.
- **Estado Global:** Utilizar Context API ou React Query para gerenciar o estado de autenticação e cache de dados.

### 5. Estratégia de Migração e Deploy

#### Fase 1: Ambiente Local (Instalação Nativa)
1.  **Banco de Dados:** Instalar PostgreSQL manualmente no sistema operacional. Criar database `fraternidade_db`.
2.  **Backend:** Configurar `.env` com `DATABASE_URL="postgresql://usuario:senha@localhost:5432/fraternidade_db"`.
3.  **Execução:** Rodar backend e frontend via terminais separados (`npm run dev`).

#### Fase 2: Banco de Dados
Utilizar o **Prisma Migrate** para criar as tabelas. Nunca alterar o banco manualmente em produção.

#### Fase 3: Produção
- O banco de dados deve ser um serviço gerenciado (RDS/Cloud SQL) ou container com volume persistente.
- O frontend deve ser "buildado" (`npm run build`) e servido como arquivos estáticos (Nginx/CDN).

### 6. Registro de Decisões de Arquitetura (ADR)

#### 6.1. Banco de Dados: PostgreSQL vs SQLite
- **Decisão:** Uso estrito do **PostgreSQL**.
- **Justificativa:** O requisito de sistema multiusuário ("N usuários") inviabiliza o SQLite, que possui limitações severas de concorrência de escrita (travamento de arquivo). Para um sistema financeiro/auditoria, a integridade transacional e o suporte a conexões simultâneas do PostgreSQL são inegociáveis.

#### 6.2. Banco de Dados: PostgreSQL vs MySQL
- **Decisão:** Manter **PostgreSQL** (Preferencial).
- **Nota:** O MySQL é uma alternativa aceitável caso haja restrição de infraestrutura, mas o PostgreSQL é superior para este caso de uso devido ao melhor suporte a tipos complexos, JSON (para logs de auditoria) e performance em queries analíticas de relatórios financeiros.

#### 6.3. Infraestrutura: Docker vs Instalação Local
- **Decisão:** Instalação Local (Sem Docker).
- **Justificativa:** Simplificação do ambiente de desenvolvimento, utilizando serviços nativos do SO. Elimina a curva de aprendizado do Docker para a equipe atual, mantendo a robustez do PostgreSQL.

---
*Documento gerado por Engenharia de Software - Base para Prompt e Desenvolvimento.*