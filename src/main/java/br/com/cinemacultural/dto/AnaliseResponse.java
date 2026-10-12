package br.com.cinemacultural.dto;

import java.time.LocalDate;

public record AnaliseResponse(
        Long id,
        Long filmeId,
        String filmeTitulo,
        String texto,
        double nota,
        LocalDate data
) {
}
