package br.com.cinemacultural.dto;

public record FilmeResponse(
        Long id,
        String titulo,
        String sinopse,
        String genero,
        int anoLancamento,
        String cor
) {
}
