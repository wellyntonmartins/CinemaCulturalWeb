# Registro de bugs — Etapa 9

Este registro deve ser atualizado após executar os cenários no seu ambiente. Os itens abaixo são inconsistências de integração identificadas ao preparar a etapa; o status de correção no código não substitui a validação local.

| ID | Prioridade | Problema observado na integração | Correção implementada | Status após validar localmente |
|---|---|---|---|---|
| BUG-01 | Alta | O front-end da Etapa 8 lia e gravava filmes/avaliações no `localStorage`, sem persistência no banco. | `js/app.js` agora usa `fetch` nos endpoints `/api/filmes` e `/api/analises`. | Pendente de validação |
| BUG-02 | Alta | O front-end usa `texto` e `data`, enquanto o banco anterior mantém a coluna `analise` e não tinha data da avaliação. | DTO converte o campo JSON `texto` para a coluna `analise`; script SQL adiciona `data`. | Pendente de validação |
| BUG-03 | Média | Os cartazes do front-end utilizam a propriedade `cor`, que não existia na tabela antiga de filmes. | Script SQL de migração adiciona a coluna `cor`; o serviço define uma cor padrão. | Pendente de validação |
| BUG-04 | Média | Respostas HTTP de erro poderiam aparecer como falhas genéricas no formulário. | A API retorna mensagem JSON e o front-end apresenta essa mensagem em toast. | Pendente de validação |
| BUG-05 | Alta | A exclusão de um filme precisa remover as análises vinculadas para não deixar registros órfãos. | `FilmeService` exclui as análises relacionadas antes do filme e o banco mantém chave estrangeira. | Pendente de validação |

## Como registrar no GitHub Issues

1. Abra o repositório GitHub do projeto da Etapa 9.
2. Entre em Issues → New issue.
3. Registre qualquer falha que realmente ocorrer, com passos, resultado esperado, resultado obtido e captura de tela.
4. Quando corrigir e confirmar a correção, feche a issue e anote o número/link no relatório de testes.

Não marque os itens como confirmados/corrigidos antes de reproduzir os testes na sua máquina.
