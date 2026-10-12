package br.com.cinemacultural.controller;

import br.com.cinemacultural.dto.FilmeRequest;
import br.com.cinemacultural.dto.FilmeResponse;
import br.com.cinemacultural.service.FilmeService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/filmes")
public class FilmeRestController {

    private final FilmeService filmeService;

    public FilmeRestController(FilmeService filmeService) {
        this.filmeService = filmeService;
    }

    @GetMapping
    public List<FilmeResponse> listar() {
        return filmeService.listar();
    }

    @GetMapping("/{id}")
    public FilmeResponse buscar(@PathVariable Long id) {
        return filmeService.buscar(id);
    }

    @PostMapping
    public ResponseEntity<FilmeResponse> criar(@Valid @RequestBody FilmeRequest request) {
        FilmeResponse filme = filmeService.criar(request);
        return ResponseEntity.created(URI.create("/api/filmes/" + filme.id())).body(filme);
    }

    @PutMapping("/{id}")
    public FilmeResponse atualizar(@PathVariable Long id, @Valid @RequestBody FilmeRequest request) {
        return filmeService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        filmeService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
