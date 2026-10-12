document.addEventListener('DOMContentLoaded', function () {
    const app = window.CinemaApp;
    const lista = document.getElementById('lista-analises');
    const busca = document.getElementById('busca-analise');
    const filtroNota = document.getElementById('filtro-nota');
    const ordem = document.getElementById('ordem-analises');
    let todas = [];

    async function carregar() {
        lista.innerHTML = '<p class="muted-text">Carregando análises...</p>';
        try {
            todas = await app.getAnalises();
            renderizar();
        } catch (erro) {
            lista.innerHTML = '<div class="empty-state"><h2>Não foi possível carregar as análises</h2><p>Confira a aplicação e a conexão com o banco de dados.</p><p>' + app.escapar(erro.message) + '</p></div>';
        }
    }

    function renderizar() {
        document.getElementById('total-analises').textContent = todas.length;
        const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
        let filtradas = todas.filter(function (analise) {
            const texto = (analise.texto + ' ' + (analise.filmeTitulo || '')).toLocaleLowerCase('pt-BR');
            const notaValor = Number(analise.nota);
            let notaPassa = true;
            if (filtroNota.value === '9') notaPassa = notaValor >= 9;
            else if (filtroNota.value === '7') notaPassa = notaValor >= 7;
            else if (filtroNota.value === '5') notaPassa = notaValor >= 5;
            else if (filtroNota.value === '0') notaPassa = notaValor < 5;
            return texto.includes(termo) && notaPassa;
        });
        if (ordem.value === 'nota-desc') filtradas.sort(function (a, b) { return Number(b.nota) - Number(a.nota); });
        else if (ordem.value === 'nota-asc') filtradas.sort(function (a, b) { return Number(a.nota) - Number(b.nota); });
        else filtradas.sort(function (a, b) { return String(b.data).localeCompare(String(a.data)); });
        if (!filtradas.length) {
            lista.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><span class="empty-icon">✎</span><h2>Nenhuma análise encontrada</h2><p>Experimente alterar os filtros ou escreva a primeira análise.</p><a href="index.html" class="button button-primary">Explorar filmes</a></div>';
            return;
        }
        lista.innerHTML = filtradas.map(function (analise) {
            const titulo = analise.filmeTitulo || 'Filme';
            const trecho = analise.texto.length > 230 ? analise.texto.slice(0, 227) + '...' : analise.texto;
            return '<article class="review-card"><div class="review-card-head"><div><a class="review-film-title" href="filme.html?id=' + encodeURIComponent(analise.filmeId) + '">' + app.escapar(titulo) + '</a><span class="review-date">' + app.escapar(app.dataFormatada(analise.data)) + '</span></div><span class="rating"><span class="star">★</span>' + app.notaFormatada(analise.nota) + '</span></div><p class="review-text">' + app.escapar(trecho) + '</p><div class="review-actions"><a class="button button-quiet" href="analise-form.html?id=' + encodeURIComponent(analise.id) + '&filmeId=' + encodeURIComponent(analise.filmeId) + '">Editar</a><button class="button button-danger-outline apagar-analise" data-id="' + app.escapar(analise.id) + '" type="button">Excluir</button></div></article>';
        }).join('');
        lista.querySelectorAll('.apagar-analise').forEach(function (botao) {
            botao.addEventListener('click', async function () {
                if (!window.confirm('Excluir esta análise?')) return;
                try {
                    await app.apagarAnalise(botao.dataset.id);
                    app.toast('Análise excluída.', 'success');
                    await carregar();
                } catch (erro) {
                    app.toast(erro.message, 'error');
                }
            });
        });
    }

    busca.addEventListener('input', renderizar);
    filtroNota.addEventListener('change', renderizar);
    ordem.addEventListener('change', renderizar);
    carregar();
});
