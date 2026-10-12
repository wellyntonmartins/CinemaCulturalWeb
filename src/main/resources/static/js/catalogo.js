document.addEventListener('DOMContentLoaded', function () {
    const app = window.CinemaApp;
    const lista = document.getElementById('lista-filmes');
    const busca = document.getElementById('busca');
    const genero = document.getElementById('filtro-genero');
    const ordenacao = document.getElementById('ordenacao');

    function popularGeneros(filmes) {
        const selecionado = genero.value;
        const generos = Array.from(new Set(filmes.map(function (filme) { return filme.genero; }).filter(Boolean))).sort();
        genero.innerHTML = '<option value="">Todos os gêneros</option>' + generos.map(function (item) { return '<option value="' + app.escapar(item) + '">' + app.escapar(item) + '</option>'; }).join('');
        if (generos.includes(selecionado)) genero.value = selecionado;
    }

    async function renderizar() {
        lista.innerHTML = '<p class="muted-text">Carregando filmes...</p>';
        try {
            const resultados = await Promise.all([app.getFilmes(), app.getAnalises()]);
            const filmes = resultados[0];
            const analises = resultados[1];
            document.getElementById('stat-filmes').textContent = filmes.length;
            document.getElementById('stat-analises').textContent = analises.length;
            const mediaGeral = app.notaMedia(analises);
            document.getElementById('stat-nota').textContent = mediaGeral === null ? '—' : app.notaFormatada(mediaGeral);
            popularGeneros(filmes);
            const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
            let filtrados = filmes.filter(function (filme) {
                const texto = (filme.titulo + ' ' + filme.sinopse + ' ' + filme.genero).toLocaleLowerCase('pt-BR');
                return texto.includes(termo) && (!genero.value || filme.genero === genero.value);
            });
            if (ordenacao.value === 'ano-desc') filtrados.sort(function (a, b) { return Number(b.anoLancamento) - Number(a.anoLancamento); });
            else if (ordenacao.value === 'ano-asc') filtrados.sort(function (a, b) { return Number(a.anoLancamento) - Number(b.anoLancamento); });
            else filtrados.sort(function (a, b) { return a.titulo.localeCompare(b.titulo, 'pt-BR'); });
            document.getElementById('resultado-contagem').textContent = filtrados.length + (filtrados.length === 1 ? ' filme encontrado' : ' filmes encontrados');
            if (!filtrados.length) {
                lista.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><span class="empty-icon">⌕</span><h2>Nenhum filme encontrado</h2><p>Cadastre um filme ou altere a busca.</p><a href="filme-form.html" class="button button-primary">Cadastrar filme</a></div>';
                return;
            }
            lista.innerHTML = filtrados.map(function (filme, indice) {
                const analisesFilme = analises.filter(function (item) { return Number(item.filmeId) === Number(filme.id); });
                const mediaFilme = app.notaMedia(analisesFilme);
                const cor = /^#[0-9a-f]{6}$/i.test(filme.cor || '') ? filme.cor : ['#4d6255', '#475b77', '#8b4b3d', '#5d536f'][indice % 4];
                const sinopse = filme.sinopse.length > 110 ? filme.sinopse.slice(0, 107) + '...' : filme.sinopse;
                return '<article class="film-card"><div class="film-card-top" style="--poster-bg:' + cor + '"><span class="card-title-art">' + app.escapar(filme.titulo) + '</span><span class="card-category">' + app.escapar(filme.genero) + '</span><span class="card-year">' + app.escapar(filme.anoLancamento) + '</span></div><div class="film-card-body"><h3>' + app.escapar(filme.titulo) + '</h3><p>' + app.escapar(sinopse) + '</p><div class="card-meta"><span class="pill">' + app.escapar(filme.genero) + '</span><span class="rating"><span class="star">★</span>' + app.notaFormatada(mediaFilme) + '</span></div><div class="card-actions"><a class="button button-primary" href="filme.html?id=' + encodeURIComponent(filme.id) + '">Ver detalhes →</a><button class="button button-quiet excluir-filme" data-id="' + app.escapar(filme.id) + '" type="button">Excluir</button></div></div></article>';
            }).join('');
            lista.querySelectorAll('.excluir-filme').forEach(function (botao) {
                botao.addEventListener('click', async function () {
                    const filme = filmes.find(function (item) { return Number(item.id) === Number(botao.dataset.id); });
                    if (!filme || !window.confirm('Excluir "' + filme.titulo + '" e todas as análises associadas?')) return;
                    try {
                        await app.apagarFilme(filme.id);
                        app.toast('Filme excluído.', 'success');
                        renderizar();
                    } catch (erro) {
                        app.toast(erro.message, 'error');
                    }
                });
            });
        } catch (erro) {
            document.getElementById('resultado-contagem').textContent = 'Falha ao carregar';
            lista.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h2>Não foi possível carregar o catálogo</h2><p>Verifique se a aplicação está rodando e se o MySQL está conectado.</p><p>' + app.escapar(erro.message) + '</p></div>';
        }
    }

    busca.addEventListener('input', renderizar);
    genero.addEventListener('change', renderizar);
    ordenacao.addEventListener('change', renderizar);
    renderizar();
});
