# Cinema Cultural — Etapa 9

Aplicação web com Spring Boot, API REST, MySQL e front-end HTML/CSS/JavaScript reaproveitado da Etapa 8. O front-end consome os endpoints REST; os filmes e as análises ficam no banco, não no `localStorage`. O `localStorage` é usado somente para guardar o tema visual.

## Requisitos

- JDK 17 ou superior
- MySQL 8
- NetBeans com suporte a projetos Maven

## Preparar o banco

Para um banco novo, execute `database/cinema.sql` no MySQL Workbench. Para o banco `cinema` já usado nas etapas anteriores, execute uma única vez `database/migracao_etapa9.sql` para adicionar a cor dos cartazes e a data das análises. Para inserir dois registros de exemplo, execute opcionalmente `database/dados_exemplo.sql`.

## Configurar a conexão

Abra `src/main/resources/application.properties` e ajuste `spring.datasource.username`/`spring.datasource.password` conforme seu MySQL. Por padrão, o usuário é `root` e a senha é vazia. Também é possível configurar as variáveis `DB_URL`, `DB_USERNAME` e `DB_PASSWORD`.

A aplicação usa `spring.jpa.hibernate.ddl-auto=validate`: ela verifica o schema, mas não altera suas tabelas automaticamente.

## Abrir no NetBeans

1. File → Open Project e selecione a pasta `CinemaCulturalWeb`.
2. Aguarde a resolução das dependências Maven.
3. Confirme a conexão com o MySQL.
4. Execute `CinemaCulturalApplication.java`.
5. Abra `http://localhost:8080/`.

## API

### Filmes

- `GET /api/filmes`
- `GET /api/filmes/{id}`
- `POST /api/filmes`
- `PUT /api/filmes/{id}`
- `DELETE /api/filmes/{id}`

### Análises

- `GET /api/analises`
- `GET /api/analises?filmeId={id}`
- `GET /api/analises/{id}`
- `POST /api/analises`
- `PUT /api/analises/{id}`
- `DELETE /api/analises/{id}`

Os erros da API retornam JSON com `status`, `mensagem` e `dataHora`.

## Testes

No NetBeans, clique com o botão direito no projeto e selecione Test. Os testes de serviço usam JUnit Jupiter e Mockito; não exigem MySQL porque os repositórios são simulados.

Pelo terminal, com Maven disponível:

```bash
mvn test
```

## Pastas importantes

- `src/main/java`: API REST, serviços, entidades, DTOs e repositórios.
- `src/main/resources/static`: as páginas da Etapa 8 servidas pelo Spring Boot.
- `src/test/java`: testes unitários.
- `database`: scripts SQL de criação, migração e dados de demonstração.
- `docs`: plano de testes, controle de bugs e guias de evidência.
