USE cinema;

INSERT INTO filmes (titulo, sinopse, genero, ano_lancamento, cor)
SELECT 'Interestelar', 'Um grupo de exploradores parte em uma viagem pelo espaço em busca de um futuro possível para a humanidade.', 'Ficção científica', 2014, '#475b77'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE titulo = 'Interestelar');

INSERT INTO filmes (titulo, sinopse, genero, ano_lancamento, cor)
SELECT 'Central do Brasil', 'Uma ex-professora e um menino atravessam o país em busca da família dele, construindo uma relação inesperada.', 'Drama', 1998, '#356d70'
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE titulo = 'Central do Brasil');

INSERT INTO analises (filme_id, analise, nota, data)
SELECT id, 'A história mistura ficção científica com uma relação humana muito forte. A trilha sonora também ajuda a construir a tensão.', 9.5, CURRENT_DATE
FROM filmes WHERE titulo = 'Interestelar'
AND NOT EXISTS (SELECT 1 FROM analises WHERE filme_id = filmes.id AND analise = 'A história mistura ficção científica com uma relação humana muito forte. A trilha sonora também ajuda a construir a tensão.');
