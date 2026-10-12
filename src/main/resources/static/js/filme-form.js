document.addEventListener('DOMContentLoaded', async function () {
    const app = window.CinemaApp;
    const form = document.getElementById('form-filme');
    const id = app.valorParam('id');
    const campos = {
        titulo: document.getElementById('titulo'),
        genero: document.getElementById('genero'),
        ano: document.getElementById('anoLancamento'),
        sinopse: document.getElementById('sinopse')
    };
    let filmeExistente = null;

    if (id) {
        try {
            filmeExistente = await app.filmePorId(id);
            document.title = 'Editar filme | Cinema Cultural';
            document.getElementById('form-titulo-pagina').textContent = 'Editar filme';
            document.getElementById('salvar-filme').textContent = 'Salvar alterações';
            campos.titulo.value = filmeExistente.titulo;
            campos.genero.value = filmeExistente.genero;
            campos.ano.value = filmeExistente.anoLancamento;
            campos.sinopse.value = filmeExistente.sinopse;
        } catch (erro) {
            app.toast('Filme não encontrado.', 'error');
            window.location.href = 'index.html';
            return;
        }
    }

    function limparErros() {
        document.querySelectorAll('.field-error').forEach(function (item) { item.textContent = ''; });
        document.querySelectorAll('.form-field').forEach(function (item) { item.classList.remove('invalid'); });
    }
    function mostrarErro(campo, elemento, mensagem) {
        elemento.textContent = mensagem;
        campo.closest('.form-field').classList.add('invalid');
    }

    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        limparErros();
        let valido = true;
        const titulo = campos.titulo.value.trim();
        const genero = campos.genero.value;
        const ano = Number(campos.ano.value);
        const sinopse = campos.sinopse.value.trim();
        const anoAtual = new Date().getFullYear();
        if (titulo.length < 2 || titulo.length > 120) { mostrarErro(campos.titulo, document.getElementById('erro-titulo'), 'Informe um título entre 2 e 120 caracteres.'); valido = false; }
        if (!genero) { mostrarErro(campos.genero, document.getElementById('erro-genero'), 'Selecione um gênero.'); valido = false; }
        if (!Number.isInteger(ano) || ano < 1888 || ano > anoAtual + 5) { mostrarErro(campos.ano, document.getElementById('erro-ano'), 'Informe um ano entre 1888 e ' + (anoAtual + 5) + '.'); valido = false; }
        if (sinopse.length < 20 || sinopse.length > 1500) { mostrarErro(campos.sinopse, document.getElementById('erro-sinopse'), 'A sinopse deve ter entre 20 e 1500 caracteres.'); valido = false; }
        if (!valido) {
            const primeiroErro = document.querySelector('.form-field.invalid input, .form-field.invalid select, .form-field.invalid textarea');
            if (primeiroErro) primeiroErro.focus();
            return;
        }
        const dados = { titulo: titulo, genero: genero, anoLancamento: ano, sinopse: sinopse, cor: filmeExistente ? filmeExistente.cor : null };
        try {
            const resultado = filmeExistente ? await app.atualizarFilme(filmeExistente.id, dados) : await app.criarFilme(dados);
            app.toast(filmeExistente ? 'Filme atualizado.' : 'Filme cadastrado.', 'success');
            window.location.href = 'filme.html?id=' + encodeURIComponent(resultado.id);
        } catch (erro) {
            app.toast(erro.message, 'error');
        }
    });
});
