document.addEventListener('DOMContentLoaded', async function () {
    const app = window.CinemaApp;
    const form = document.getElementById('form-analise');
    const selecao = document.getElementById('filmeId');
    const texto = document.getElementById('texto-analise');
    const nota = document.getElementById('nota');
    const id = app.valorParam('id');
    const filmeIdInicial = app.valorParam('filmeId');
    let analiseExistente = null;
    let filmes = [];

    try {
        filmes = await app.getFilmes();
        selecao.innerHTML = '<option value="">Selecione um filme</option>' + filmes.slice().sort(function (a, b) { return a.titulo.localeCompare(b.titulo, 'pt-BR'); }).map(function (filme) {
            return '<option value="' + app.escapar(filme.id) + '">' + app.escapar(filme.titulo) + ' (' + app.escapar(filme.anoLancamento) + ')</option>';
        }).join('');
        if (id) analiseExistente = await app.analisePorId(id);
    } catch (erro) {
        app.toast(erro.message, 'error');
        if (id) { window.location.href = 'analises.html'; return; }
    }

    if (id && !analiseExistente) {
        app.toast('Análise não encontrada.', 'error');
        window.location.href = 'analises.html';
        return;
    }
    if (!filmes.length) {
        app.toast('Cadastre um filme antes de escrever uma análise.', 'error');
        window.location.href = 'filme-form.html';
        return;
    }
    if (analiseExistente) {
        selecao.value = String(analiseExistente.filmeId);
        texto.value = analiseExistente.texto;
        nota.value = analiseExistente.nota;
        document.getElementById('titulo-form-analise').textContent = 'Editar análise';
        document.getElementById('salvar-analise').textContent = 'Salvar alterações';
    } else if (filmeIdInicial && filmes.some(function (filme) { return String(filme.id) === String(filmeIdInicial); })) {
        selecao.value = filmeIdInicial;
    }

    function atualizarLinks() {
        const destino = selecao.value ? 'filme.html?id=' + encodeURIComponent(selecao.value) : 'analises.html';
        document.getElementById('voltar-filme').href = destino;
        document.getElementById('cancelar-analise').href = destino;
    }
    selecao.addEventListener('change', atualizarLinks);
    atualizarLinks();

    function limparErros() {
        document.querySelectorAll('.field-error').forEach(function (item) { item.textContent = ''; });
        document.querySelectorAll('.form-field').forEach(function (item) { item.classList.remove('invalid'); });
    }
    function mostrarErro(campo, erro, mensagem) {
        erro.textContent = mensagem;
        campo.closest('.form-field').classList.add('invalid');
    }

    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        limparErros();
        let valido = true;
        const filmeId = Number(selecao.value);
        const textoValor = texto.value.trim();
        const notaValor = Number(nota.value);
        if (!filmeId || !filmes.some(function (filme) { return Number(filme.id) === filmeId; })) { mostrarErro(selecao, document.getElementById('erro-filme'), 'Selecione um filme válido.'); valido = false; }
        if (textoValor.length < 10 || textoValor.length > 2000) { mostrarErro(texto, document.getElementById('erro-texto'), 'A análise deve ter entre 10 e 2000 caracteres.'); valido = false; }
        if (nota.value === '' || !Number.isFinite(notaValor) || notaValor < 0 || notaValor > 10 || Math.round(notaValor * 2) !== notaValor * 2) { mostrarErro(nota, document.getElementById('erro-nota'), 'Informe uma nota entre 0 e 10 em intervalos de 0,5.'); valido = false; }
        if (!valido) return;
        const dados = { filmeId: filmeId, texto: textoValor, nota: notaValor };
        try {
            if (analiseExistente) await app.atualizarAnalise(analiseExistente.id, dados);
            else await app.criarAnalise(dados);
            app.toast(analiseExistente ? 'Análise atualizada.' : 'Análise publicada.', 'success');
            window.location.href = 'filme.html?id=' + encodeURIComponent(filmeId);
        } catch (erro) {
            app.toast(erro.message, 'error');
        }
    });
});
