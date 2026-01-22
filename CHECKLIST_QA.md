# Checklist de Garantia de Qualidade (QA) - Sistema Fraternidade Transparente

Este documento serve como roteiro de testes manuais para validar o funcionamento completo do sistema após a migração.

## 1. Configuração do Ambiente
- [ ] **Backend Rodando:** Verificar se o terminal do backend exibe `Server running on http://localhost:3000`.
- [ ] **Frontend Rodando:** Verificar se o terminal do frontend exibe `Local: http://localhost:8080/`.
- [ ] **Banco de Dados:** PostgreSQL deve estar ativo.

## 2. Fluxo de Autenticação (Login)
- [ ] **Login com Sucesso:**
  - Acessar `http://localhost:8080/login`.
  - Inserir Email: `admin@fraternidade.org`.
  - Inserir Senha: `admin123`.
  - Clicar em "Entrar".
  - **Resultado Esperado:** Redirecionamento para o Dashboard (`/`). Token JWT salvo no `localStorage` (verificar via DevTools > Application).
- [ ] **Login com Erro:**
  - Tentar logar com senha incorreta.
  - **Resultado Esperado:** Mensagem de erro "Credenciais inválidas" ou similar.

## 3. Cadastros Auxiliares (Configurações)
Acesse a página "Configurações" no menu lateral.

### 3.1. Unidades
- [ ] **Listagem:** Verificar se as unidades cadastradas (seed) aparecem na lista.
- [ ] **Criação:**
  - Clicar em "Nova Unidade".
  - Preencher Nome ("Unidade Teste QA") e Endereço.
  - Salvar.
  - **Resultado Esperado:** Nova unidade aparece na lista imediatamente.
- [ ] **Edição:**
  - Editar a "Unidade Teste QA".
  - Alterar o nome para "Unidade Teste QA Editada".
  - Salvar.
  - **Resultado Esperado:** Nome atualizado na lista.
- [ ] **Exclusão:**
  - Excluir a "Unidade Teste QA Editada".
  - **Resultado Esperado:** Unidade removida da lista.

### 3.2. Centros de Custo
- [ ] **Listagem:** Verificar se as categorias padrão aparecem.
- [ ] **Criação:** Criar um novo centro de custo "Categoria Teste".
- [ ] **Exclusão:** Excluir a "Categoria Teste".

## 4. Fluxo de Lançamentos (Despesas)
Acesse "Novo Lançamento".

- [ ] **Preenchimento do Formulário:**
  - Selecionar Unidade (ex: Sede Administrativa).
  - Selecionar Categoria (ex: Alimentação).
  - Preencher Fornecedor ("Mercado Teste").
  - Preencher CNPJ (ex: 00.000.000/0001-91).
  - Preencher Valor (ex: 150,00).
  - Selecionar Data.
  - Preencher Descrição ("Compra de itens para café").
- [ ] **Upload de Arquivos (CRÍTICO):**
  - Anexar arquivo em "Nota Fiscal" (PDF ou Imagem < 10MB).
  - Anexar arquivo em "Comprovante" (PDF ou Imagem < 10MB).
- [ ] **Envio:**
  - Clicar em "Enviar Lançamento".
  - **Resultado Esperado:** Mensagem de sucesso "Lançamento enviado com sucesso!" e redirecionamento para a lista de Lançamentos.

## 5. Verificação de Persistência
- [ ] **Backend (Arquivos):**
  - Ir na pasta `backend/uploads` no seu computador.
  - Verificar se dois novos arquivos foram criados (nomes aleatórios tipo `1705...-nota.pdf`).
- [ ] **Backend (Banco de Dados):**
  - (Opcional) Verificar no banco se o registro foi criado na tabela `Transaction` com as colunas `invoiceUrl` e `receiptUrl` preenchidas.

## 6. Fluxo de Auditoria e Aprovação
Acesse "Auditoria".

- [ ] **Listagem de Pendências:**
  - O lançamento criado no passo 4 deve aparecer aqui.
- [ ] **Visualização de Arquivos (Visualização):**
  - Clicar em "Ver Nota Fiscal".
  - **Resultado Esperado:** O arquivo deve abrir em uma nova aba do navegador (URL deve começar com `http://localhost:3000/uploads/...`).
  - Repetir para "Ver Comprovante".
- [ ] **Aprovação:**
  - Clicar em "Aprovar".
  - **Resultado Esperado:** O item some da lista de pendências.
- [ ] **Rejeição (Glosa) - Teste Alternativo:**
  - Criar outro lançamento de teste.
  - Na Auditoria, clicar em "Glosar".
  - Preencher motivo e confirmar.
  - **Resultado Esperado:** O item some da lista de pendências.

## 7. Consulta de Histórico (Lançamentos)
Acesse "Lançamentos".

- [ ] **Filtros:**
  - Filtrar por Status "Aprovados". O primeiro lançamento deve aparecer.
  - Filtrar por Status "Glosados". O segundo lançamento deve aparecer.
- [ ] **Detalhes:**
  - Clicar no menu de ações (...) do lançamento aprovado.
  - Testar novamente "Ver Nota Fiscal" e "Ver Comprovante" para garantir que o link funciona no histórico também.
