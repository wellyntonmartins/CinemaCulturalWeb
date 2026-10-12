(function () {
    const THEME_KEY = 'cinema-cultural-tema-v2';

    async function requisicao(url, opcoes) {
        const config = Object.assign({ method: 'GET', headers: {} }, opcoes || {});
        if (config.body && typeof config.body !== 'string') {
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(config.body);
        }
        const resposta = await fetch(url, config);
        if (resposta.status === 204) return null;
        const texto = await resposta.text();
        let dados = null;
        if (texto) {
            try { dados = JSON.parse(texto); } catch (erro) { dados = { mensagem: texto }; }
        }
        if (!resposta.ok) {
            const mensagem = dados && (dados.mensagem || dados.message || dados.error) ? (dados.mensagem || dados.message || dados.error) : 'Não foi possível concluir a operação.';
            throw new Error(mensagem);
        }
        return dados;
    }

    function notaMedia(lista) {
        return lista.length ? lista.reduce(function (soma, item) { return soma + Number(item.nota); }, 0) / lista.length : null;
    }

    function notaFormatada(nota) {
        return nota === null || nota === undefined || Number.isNaN(Number(nota)) ? '—' : Number(nota).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    function dataFormatada(data) {
        if (!data) return '';
        const partes = String(data).split('-');
        if (partes.length !== 3) return data;
        return partes[2] + '/' + partes[1] + '/' + partes[0];
    }

    function escapar(valor) {
        return String(valor === null || valor === undefined ? '' : valor).replace(/[&<>"']/g, function (caractere) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[caractere];
        });
    }

    function temaAtual() {
        return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    }

    function aplicarTema(tema) {
        document.documentElement.dataset.theme = tema;
        localStorage.setItem(THEME_KEY, tema);
        const botao = document.getElementById('toggle-theme');
        if (botao) {
            botao.textContent = tema === 'dark' ? 'Tema claro' : 'Tema escuro';
            botao.setAttribute('aria-label', tema === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
        }
    }

    function toast(mensagem, tipo) {
        let area = document.getElementById('toast-area');
        if (!area) {
            area = document.createElement('div');
            area.id = 'toast-area';
            area.className = 'toast-area';
            area.setAttribute('aria-live', 'polite');
            document.body.appendChild(area);
        }
        const item = document.createElement('div');
        item.className = 'toast' + (tipo ? ' ' + tipo : '');
        item.textContent = mensagem;
        area.appendChild(item);
        window.setTimeout(function () { item.remove(); }, 3300);
    }

    function valorParam(nome) {
        return new URLSearchParams(window.location.search).get(nome);
    }

    async function getFilmes() { return requisicao('/api/filmes'); }
    async function getAnalises(filmeId) {
        const query = filmeId === undefined || filmeId === null || filmeId === '' ? '' : '?filmeId=' + encodeURIComponent(filmeId);
        return requisicao('/api/analises' + query);
    }
    async function filmePorId(id) { return requisicao('/api/filmes/' + encodeURIComponent(id)); }
    async function analisePorId(id) { return requisicao('/api/analises/' + encodeURIComponent(id)); }
    async function criarFilme(filme) { return requisicao('/api/filmes', { method: 'POST', body: filme }); }
    async function atualizarFilme(id, filme) { return requisicao('/api/filmes/' + encodeURIComponent(id), { method: 'PUT', body: filme }); }
    async function apagarFilme(id) { return requisicao('/api/filmes/' + encodeURIComponent(id), { method: 'DELETE' }); }
    async function criarAnalise(analise) { return requisicao('/api/analises', { method: 'POST', body: analise }); }
    async function atualizarAnalise(id, analise) { return requisicao('/api/analises/' + encodeURIComponent(id), { method: 'PUT', body: analise }); }
    async function apagarAnalise(id) { return requisicao('/api/analises/' + encodeURIComponent(id), { method: 'DELETE' }); }

    document.addEventListener('DOMContentLoaded', function () {
        aplicarTema(temaAtual());
        const botaoTema = document.getElementById('toggle-theme');
        if (botaoTema) botaoTema.addEventListener('click', function () { aplicarTema(temaAtual() === 'dark' ? 'light' : 'dark'); });
        document.querySelectorAll('.current-year').forEach(function (elemento) { elemento.textContent = new Date().getFullYear(); });
    });

    window.CinemaApp = {
        getFilmes: getFilmes,
        getAnalises: getAnalises,
        filmePorId: filmePorId,
        analisePorId: analisePorId,
        analisesDoFilme: function (id) { return getAnalises(id); },
        criarFilme: criarFilme,
        atualizarFilme: atualizarFilme,
        apagarFilme: apagarFilme,
        criarAnalise: criarAnalise,
        atualizarAnalise: atualizarAnalise,
        apagarAnalise: apagarAnalise,
        notaMedia: notaMedia,
        notaFormatada: notaFormatada,
        dataFormatada: dataFormatada,
        escapar: escapar,
        valorParam: valorParam,
        toast: toast
    };
}());
