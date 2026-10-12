package br.com.cinemacultural.service;

import br.com.cinemacultural.dto.AnaliseRequest;
import br.com.cinemacultural.dto.AnaliseResponse;
import br.com.cinemacultural.exception.RecursoNaoEncontradoException;
import br.com.cinemacultural.model.Analise;
import br.com.cinemacultural.model.Filme;
import br.com.cinemacultural.repository.AnaliseRepository;
import br.com.cinemacultural.repository.FilmeRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnaliseServiceTest {

    @Mock
    private AnaliseRepository analiseRepository;

    @Mock
    private FilmeRepository filmeRepository;

    @InjectMocks
    private AnaliseService analiseService;

    @Test
    void deveCadastrarAnaliseValida() {
        Filme filme = filmeValido();
        when(filmeRepository.findById(1L)).thenReturn(Optional.of(filme));
        when(analiseRepository.save(any(Analise.class))).thenAnswer(invocacao -> {
            Analise analise = invocacao.getArgument(0);
            analise.setId(1L);
            return analise;
        });

        AnaliseResponse resposta = analiseService.criar(new AnaliseRequest(1L, "Uma análise que tem texto suficiente.", 9.5));

        assertEquals(1L, resposta.id());
        assertEquals("Interestelar", resposta.filmeTitulo());
        assertEquals(9.5, resposta.nota());
        assertNotNull(resposta.data());
    }

    @Test
    void deveRecusarNotaAcimaDeDez() {
        assertThrows(IllegalArgumentException.class, () -> analiseService.criar(new AnaliseRequest(1L, "Uma análise que tem texto suficiente.", 10.5)));
        verifyNoInteractions(filmeRepository, analiseRepository);
    }

    @Test
    void deveRecusarNotaForaDoIntervaloDeMeioPonto() {
        assertThrows(IllegalArgumentException.class, () -> analiseService.criar(new AnaliseRequest(1L, "Uma análise que tem texto suficiente.", 8.25)));
        verifyNoInteractions(filmeRepository, analiseRepository);
    }

    @Test
    void deveRecusarTextoCurto() {
        assertThrows(IllegalArgumentException.class, () -> analiseService.criar(new AnaliseRequest(1L, "Ruim", 5.0)));
        verifyNoInteractions(filmeRepository, analiseRepository);
    }

    @Test
    void deveRecusarAnaliseDeFilmeInexistente() {
        when(filmeRepository.findById(77L)).thenReturn(Optional.empty());
        assertThrows(RecursoNaoEncontradoException.class, () -> analiseService.criar(new AnaliseRequest(77L, "Uma análise que tem texto suficiente.", 8.0)));
        verify(analiseRepository, never()).save(any(Analise.class));
    }

    @Test
    void deveInformarQuandoAnaliseNaoExiste() {
        when(analiseRepository.findById(44L)).thenReturn(Optional.empty());
        assertThrows(RecursoNaoEncontradoException.class, () -> analiseService.buscar(44L));
    }

    @Test
    void deveExcluirAnaliseExistente() {
        Analise analise = new Analise();
        analise.setId(8L);
        analise.setFilme(filmeValido());
        analise.setTexto("Uma análise que tem texto suficiente.");
        analise.setNota(8.0);
        when(analiseRepository.findById(8L)).thenReturn(Optional.of(analise));
        analiseService.excluir(8L);
        verify(analiseRepository).delete(analise);
    }

    private Filme filmeValido() {
        Filme filme = new Filme();
        filme.setId(1L);
        filme.setTitulo("Interestelar");
        filme.setSinopse("Uma equipe viaja pelo espaço em busca de um novo lar.");
        filme.setGenero("Ficção científica");
        filme.setAnoLancamento(2014);
        filme.setCor("#475b77");
        return filme;
    }
}
