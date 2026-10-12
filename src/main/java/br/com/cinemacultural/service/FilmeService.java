package br.com.cinemacultural.service;

import br.com.cinemacultural.dto.FilmeRequest;
import br.com.cinemacultural.dto.FilmeResponse;
import br.com.cinemacultural.exception.RecursoNaoEncontradoException;
import br.com.cinemacultural.model.Filme;
import br.com.cinemacultural.repository.AnaliseRepository;
import br.com.cinemacultural.repository.FilmeRepository;
import java.time.Year;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FilmeService {

    private static final String[] CORES = {"#475b77", "#8b4b3d", "#4d6255", "#5d536f", "#356d70"};
    private static final Pattern COR_HEX = Pattern.compile("^#[0-9a-fA-F]{6}$");

    private final FilmeRepository filmeRepository;
    private final AnaliseRepository analiseRepository;

    public FilmeService(FilmeRepository filmeRepository, AnaliseRepository analiseRepository) {
        this.filmeRepository = filmeRepository;
        this.analiseRepository = analiseRepository;
    }

    @Transactional(readOnly = true)
    public List<FilmeResponse> listar() {
        return filmeRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public FilmeResponse buscar(Long id) {
        return toResponse(encontrar(id));
    }

    @Transactional
    public FilmeResponse criar(FilmeRequest request) {
        validar(request);
        Filme filme = new Filme();
        preencher(filme, request, true);
        return toResponse(filmeRepository.save(filme));
    }

    @Transactional
    public FilmeResponse atualizar(Long id, FilmeRequest request) {
        validar(request);
        Filme filme = encontrar(id);
        preencher(filme, request, false);
        return toResponse(filmeRepository.save(filme));
    }

    @Transactional
    public void excluir(Long id) {
        Filme filme = encontrar(id);
        analiseRepository.deleteByFilme_Id(id);
        filmeRepository.delete(filme);
    }

    private Filme encontrar(Long id) {
        return filmeRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Filme não encontrado."));
    }

    private void preencher(Filme filme, FilmeRequest request, boolean novo) {
        filme.setTitulo(request.titulo().trim());
        filme.setSinopse(request.sinopse().trim());
        filme.setGenero(request.genero().trim());
        filme.setAnoLancamento(request.anoLancamento());
        String cor = request.cor();
        if (cor != null && COR_HEX.matcher(cor.trim()).matches()) {
            filme.setCor(cor.trim());
        } else if (novo || filme.getCor() == null || filme.getCor().isBlank()) {
            filme.setCor(CORES[Math.floorMod(request.anoLancamento(), CORES.length)]);
        }
    }

    private void validar(FilmeRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Informe os dados do filme.");
        }
        if (request.titulo() == null || request.titulo().trim().length() < 2 || request.titulo().trim().length() > 120) {
            throw new IllegalArgumentException("O título deve ter entre 2 e 120 caracteres.");
        }
        if (request.sinopse() == null || request.sinopse().trim().length() < 20 || request.sinopse().trim().length() > 1500) {
            throw new IllegalArgumentException("A sinopse deve ter entre 20 e 1500 caracteres.");
        }
        if (request.genero() == null || request.genero().isBlank() || request.genero().trim().length() > 100) {
            throw new IllegalArgumentException("Informe um gênero válido.");
        }
        int anoAtual = Year.now().getValue();
        if (request.anoLancamento() == null || request.anoLancamento() < 1888 || request.anoLancamento() > anoAtual + 5) {
            throw new IllegalArgumentException("Informe um ano entre 1888 e " + (anoAtual + 5) + ".");
        }
    }

    private FilmeResponse toResponse(Filme filme) {
        return new FilmeResponse(filme.getId(), filme.getTitulo(), filme.getSinopse(), filme.getGenero(), filme.getAnoLancamento(), filme.getCor());
    }
}
