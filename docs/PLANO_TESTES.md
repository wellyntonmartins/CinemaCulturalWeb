# Plano de testes — Etapa 9

**Projeto:** Cinema Cultural

**Ambiente:** NetBeans, JDK 17+, Spring Boot, MySQL 8 e navegador atual.

## Testes unitários

Execute `Test` no NetBeans. Os testes usam JUnit Jupiter e Mockito e não dependem de um servidor MySQL.

| ID | Classe | Cenário | Resultado esperado |
|---|---|---|---|
| TU-01 | FilmeServiceTest | Cadastrar filme válido | Filme salvo e resposta contém identificador, título e cor. |
| TU-02 | FilmeServiceTest | Título com menos de dois caracteres | Regra rejeita o cadastro. |
| TU-03 | FilmeServiceTest | Sinopse muito curta | Regra rejeita o cadastro. |
| TU-04 | FilmeServiceTest | Ano anterior a 1888 | Regra rejeita o cadastro. |
| TU-05 | FilmeServiceTest | Listar filmes | Lista retorna os filmes do repositório. |
| TU-06 | FilmeServiceTest | Buscar identificador inexistente | Lança erro de recurso não encontrado. |
| TU-07 | FilmeServiceTest | Excluir filme existente | Remove análises relacionadas e filme. |
| TU-08 | AnaliseServiceTest | Cadastrar análise válida | Resposta tem nota, filme e data. |
| TU-09 | AnaliseServiceTest | Nota acima de 10 | Regra rejeita o cadastro. |
| TU-10 | AnaliseServiceTest | Nota fora de intervalo de 0,5 | Regra rejeita o cadastro. |
| TU-11 | AnaliseServiceTest | Texto curto | Regra rejeita o cadastro. |
| TU-12 | AnaliseServiceTest | Filme inexistente | Rejeita análise e não salva. |
| TU-13 | AnaliseServiceTest | Buscar análise inexistente | Lança erro de recurso não encontrado. |
| TU-14 | AnaliseServiceTest | Excluir análise existente | Repositório recebe a exclusão. |

## Testes manuais e de integração

| ID | Passos | Resultado esperado | Resultado/evidência |
|---|---|---|---|
| TM-01 | Iniciar MySQL e executar a aplicação. | Spring Boot inicia sem erro de schema ou conexão. | Preencher após testar |
| TM-02 | Abrir `http://localhost:8080/`. | Catálogo carrega dados a partir de `GET /api/filmes`. | Preencher após testar |
| TM-03 | Cadastrar filme válido. | `POST /api/filmes` retorna 201 e o filme aparece na lista. | Preencher após testar |
| TM-04 | Cadastrar filme com campos inválidos via interface. | JavaScript mostra mensagens e não envia dados inválidos. | Preencher após testar |
| TM-05 | Editar um filme. | `PUT /api/filmes/{id}` atualiza os dados no banco. | Preencher após testar |
| TM-06 | Excluir um filme com análise. | `DELETE /api/filmes/{id}` remove filme e análises associadas. | Preencher após testar |
| TM-07 | Cadastrar análise válida. | `POST /api/analises` retorna 201 e a análise aparece nos detalhes e na listagem. | Preencher após testar |
| TM-08 | Enviar nota inválida por Postman. | API responde 400 com mensagem de validação. | Preencher após testar |
| TM-09 | Editar e excluir análise. | `PUT` atualiza e `DELETE` remove a análise. | Preencher após testar |
| TM-10 | Filtrar análises por filme. | `GET /api/analises?filmeId={id}` retorna só as daquele filme. | Preencher após testar |
| TM-11 | Reiniciar aplicação e consultar os dados. | Filmes e análises continuam no MySQL. | Preencher após testar |
| TM-12 | Alternar tema e navegar entre páginas. | Tema visual permanece escolhido no navegador. | Preencher após testar |

## Evidências a guardar

- Capturas do NetBeans mostrando os testes unitários executados e o resumo de testes.
- Capturas do Postman ou navegador para os casos manuais principais.
- Número/link das issues reais do GitHub Issues usadas para acompanhar as falhas identificadas.
- Para cada bug, registrar passos de reprodução, comportamento esperado, comportamento obtido, correção e reteste.
