document.addEventListener('DOMContentLoaded', async function () {
    const app = window.CinemaApp;
    const id = app.valorParam('id');
    const encontrado = document.getElementById('filme-nao-encontrado');
    const conteudo = document.getElementById('detalhe-conteudo');

    if (!id) {
        encontrado.classList.remove('hidden');
        return;
    }

    try {
        const filme = await app.filmePorId(id);
        const analises = await app.analisesDoFilme(id);
        conteudo.classList.remove('hidden');
        document.title = filme.titulo + ' | Cinema Cultural';
        document.getElementById('filme-titulo').textContent = filme.titulo;
        document.getElementById('poster-titulo').textContent = filme.titulo;
        document.getElementById('poster-genero').textContent = filme.genero;
        document.getElementById('filme-genero').textContent = filme.genero;
        document.getElementById('filme-ano').textContent = filme.anoLancamento;
        document.getElementById('filme-sinopse').textContent = filme.sinopse;
        document.getElementById('detalhe-poster').style.setProperty('--poster-bg', filme.cor || '#475b77');
        document.getElementById('editar-filme').href = 'filme-form.html?id=' + encodeURIComponent(filme.id);
        document.getElementById('nova-analise').href = 'analise-form.html?filmeId=' + encodeURIComponent(filme.id);
        document.getElementById('link-nova-analise').href = 'analise-form.html?filmeId=' + encodeURIComponent(filme.id);
        document.getElementById('excluir-filme').addEventListener('click', async function () {
            if (!window.confirm('Excluir este filme e todas as análises associadas?')) return;
            try {
                await app.apagarFilme(filme.id);
                app.toast('Filme excluído.', 'success');
                window.location.href = 'index.html';
            } catch (erro) {
                app.toast(erro.message, 'error');
            }
        });
        analises.sort(function (a, b) { return String(b.data).localeCompare(String(a.data)); });
        const media = app.notaMedia(analises);
        document.getElementById('filme-nota-media').textContent = app.notaFormatada(media);
        document.getElementById('filme-quantidade-analises').textContent = analises.length + (analises.length === 1 ? ' análise' : ' análises');
        const lista = document.getElementById('lista-analises-filme');
        if (!analises.length) {
            lista.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><span class="empty-icon">✎</span><h2>Seja a primeira pessoa a avaliar</h2><p>Este filme ainda não tem análises.</p><a class="button button-primary" href="analise-form.html?filmeId=' + encodeURIComponent(filme.id) + '">Escrever análise</a></div>';
            return;
        }
        lista.innerHTML = analises.map(function (analise) {
            return '<article class="review-card"><div class="review-card-head"><div><span class="review-film-title">' + app.escapar(filme.titulo) + '</span><span class="review-date">' + app.escapar(app.dataFormatada(analise.data)) + '</span></div><span class="rating"><span class="star">★</span>' + app.notaFormatada(analise.nota) + '</span></div><p class="review-text">' + app.escapar(analise.texto) + '</p><div class="review-actions"><a class="button button-quiet" href="analise-form.html?id=' + encodeURIComponent(analise.id) + '&filmeId=' + encodeURIComponent(filme.id) + '">Editar análise</a><button class="button button-danger-outline excluir-analise" data-id="' + app.escapar(analise.id) + '" type="button">Excluir</button></div></article>';
        }).join('');
        lista.querySelectorAll('.excluir-analise').forEach(function (botao) {
            botao.addEventListener('click', async function () {
                if (!window.confirm('Excluir esta análise?')) return;
                try {
                    await app.apagarAnalise(botao.dataset.id);
                    app.toast('Análise excluída.', 'success');
                    window.location.reload();
                } catch (erro) {
                    app.toast(erro.message, 'error');
                }
            });
        });
    } catch (erro) {
        encontrado.classList.remove('hidden');
        app.toast(erro.message, 'error');
    }
});
