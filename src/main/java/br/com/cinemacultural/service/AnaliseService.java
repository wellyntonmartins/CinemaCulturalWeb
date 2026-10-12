package br.com.cinemacultural.service;

import br.com.cinemacultural.dto.AnaliseRequest;
import br.com.cinemacultural.dto.AnaliseResponse;
import br.com.cinemacultural.exception.RecursoNaoEncontradoException;
import br.com.cinemacultural.model.Analise;
import br.com.cinemacultural.model.Filme;
import br.com.cinemacultural.repository.AnaliseRepository;
import br.com.cinemacultural.repository.FilmeRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnaliseService {

    private final AnaliseRepository analiseRepository;
    private final FilmeRepository filmeRepository;

    public AnaliseService(AnaliseRepository analiseRepository, FilmeRepository filmeRepository) {
        this.analiseRepository = analiseRepository;
        this.filmeRepository = filmeRepository;
    }

    @Transactional(readOnly = true)
    public List<AnaliseResponse> listar(Long filmeId) {
        List<Analise> analises = filmeId == null
                ? analiseRepository.findAll()
                : analiseRepository.findByFilme_Id(filmeId);
        return analises.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AnaliseResponse buscar(Long id) {
        return toResponse(encontrar(id));
    }

    @Transactional
    public AnaliseResponse criar(AnaliseRequest request) {
        validar(request);
        Filme filme = filmeRepository.findById(request.filmeId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Filme não encontrado."));
        Analise analise = new Analise();
        analise.setFilme(filme);
        analise.setTexto(request.texto().trim());
        analise.setNota(request.nota());
        analise.setData(LocalDate.now());
        return toResponse(analiseRepository.save(analise));
    }

    @Transactional
    public AnaliseResponse atualizar(Long id, AnaliseRequest request) {
        validar(request);
        Analise analise = encontrar(id);
        Filme filme = filmeRepository.findById(request.filmeId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Filme não encontrado."));
        analise.setFilme(filme);
        analise.setTexto(request.texto().trim());
        analise.setNota(request.nota());
        analise.setData(LocalDate.now());
        return toResponse(analiseRepository.save(analise));
    }

    @Transactional
    public void excluir(Long id) {
        Analise analise = encontrar(id);
        analiseRepository.delete(analise);
    }

    private Analise encontrar(Long id) {
        return analiseRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Análise não encontrada."));
    }

    private void validar(AnaliseRequest request) {
        if (request == null || request.filmeId() == null) {
            throw new IllegalArgumentException("Selecione um filme.");
        }
        if (request.texto() == null || request.texto().trim().length() < 10 || request.texto().trim().length() > 2000) {
            throw new IllegalArgumentException("A análise deve ter entre 10 e 2000 caracteres.");
        }
        if (request.nota() == null || !Double.isFinite(request.nota()) || request.nota() < 0 || request.nota() > 10) {
            throw new IllegalArgumentException("A nota deve estar entre 0 e 10.");
        }
        double notaDobrada = request.nota() * 2;
        if (Math.abs(notaDobrada - Math.rint(notaDobrada)) > 0.0000001) {
            throw new IllegalArgumentException("A nota deve usar intervalos de 0,5.");
        }
    }

    private AnaliseResponse toResponse(Analise analise) {
        Filme filme = analise.getFilme();
        return new AnaliseResponse(
                analise.getId(),
                filme.getId(),
                filme.getTitulo(),
                analise.getTexto(),
                analise.getNota(),
                analise.getData()
        );
    }
}
