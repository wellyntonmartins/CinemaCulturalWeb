package br.com.cinemacultural.service;

import br.com.cinemacultural.dto.FilmeRequest;
import br.com.cinemacultural.dto.FilmeResponse;
import br.com.cinemacultural.exception.RecursoNaoEncontradoException;
import br.com.cinemacultural.model.Filme;
import br.com.cinemacultural.repository.AnaliseRepository;
import br.com.cinemacultural.repository.FilmeRepository;
import java.util.List;
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
class FilmeServiceTest {

    @Mock
    private FilmeRepository filmeRepository;

    @Mock
    private AnaliseRepository analiseRepository;

    @InjectMocks
    private FilmeService filmeService;

    @Test
    void deveCadastrarFilmeValido() {
        FilmeRequest request = new FilmeRequest("Interestelar", "Uma equipe viaja pelo espaço em busca de um novo lar.", "Ficção científica", 2014, null);
        when(filmeRepository.save(any(Filme.class))).thenAnswer(invocacao -> {
            Filme filme = invocacao.getArgument(0);
            filme.setId(1L);
            return filme;
        });

        FilmeResponse resposta = filmeService.criar(request);

        assertEquals(1L, resposta.id());
        assertEquals("Interestelar", resposta.titulo());
        assertNotNull(resposta.cor());
        verify(filmeRepository).save(any(Filme.class));
    }

    @Test
    void deveRecusarTituloCurto() {
        FilmeRequest request = new FilmeRequest("I", "Uma equipe viaja pelo espaço em busca de um novo lar.", "Drama", 2014, null);
        assertThrows(IllegalArgumentException.class, () -> filmeService.criar(request));
        verifyNoInteractions(filmeRepository);
    }

    @Test
    void deveRecusarSinopseCurta() {
        FilmeRequest request = new FilmeRequest("Filme válido", "Curta", "Drama", 2014, null);
        assertThrows(IllegalArgumentException.class, () -> filmeService.criar(request));
        verifyNoInteractions(filmeRepository);
    }

    @Test
    void deveRecusarAnoAnteriorAoCinema() {
        FilmeRequest request = new FilmeRequest("Filme válido", "Uma sinopse suficientemente longa para passar.", "Drama", 1880, null);
        assertThrows(IllegalArgumentException.class, () -> filmeService.criar(request));
        verifyNoInteractions(filmeRepository);
    }

    @Test
    void deveListarFilmes() {
        Filme filme = filmeValido(1L);
        when(filmeRepository.findAll()).thenReturn(List.of(filme));
        List<FilmeResponse> filmes = filmeService.listar();
        assertEquals(1, filmes.size());
        assertEquals("Interestelar", filmes.get(0).titulo());
    }

    @Test
    void deveInformarQuandoFilmeNaoExiste() {
        when(filmeRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RecursoNaoEncontradoException.class, () -> filmeService.buscar(99L));
    }

    @Test
    void deveExcluirFilmeEAnalisesAssociadas() {
        Filme filme = filmeValido(3L);
        when(filmeRepository.findById(3L)).thenReturn(Optional.of(filme));
        filmeService.excluir(3L);
        verify(analiseRepository).deleteByFilme_Id(3L);
        verify(filmeRepository).delete(filme);
    }

    private Filme filmeValido(Long id) {
        Filme filme = new Filme();
        filme.setId(id);
        filme.setTitulo("Interestelar");
        filme.setSinopse("Uma equipe viaja pelo espaço em busca de um novo lar.");
        filme.setGenero("Ficção científica");
        filme.setAnoLancamento(2014);
        filme.setCor("#475b77");
        return filme;
    }
}
