package br.com.cinemacultural.controller;

import br.com.cinemacultural.dto.AnaliseRequest;
import br.com.cinemacultural.dto.AnaliseResponse;
import br.com.cinemacultural.service.AnaliseService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analises")
public class AnaliseRestController {

    private final AnaliseService analiseService;

    public AnaliseRestController(AnaliseService analiseService) {
        this.analiseService = analiseService;
    }

    @GetMapping
    public List<AnaliseResponse> listar(@RequestParam(required = false) Long filmeId) {
        return analiseService.listar(filmeId);
    }

    @GetMapping("/{id}")
    public AnaliseResponse buscar(@PathVariable Long id) {
        return analiseService.buscar(id);
    }

    @PostMapping
    public ResponseEntity<AnaliseResponse> criar(@Valid @RequestBody AnaliseRequest request) {
        AnaliseResponse analise = analiseService.criar(request);
        return ResponseEntity.created(URI.create("/api/analises/" + analise.id())).body(analise);
    }

    @PutMapping("/{id}")
    public AnaliseResponse atualizar(@PathVariable Long id, @Valid @RequestBody AnaliseRequest request) {
        return analiseService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        analiseService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
