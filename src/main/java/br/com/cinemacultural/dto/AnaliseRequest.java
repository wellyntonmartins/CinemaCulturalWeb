package br.com.cinemacultural.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AnaliseRequest(
        @NotNull(message = "Selecione um filme.")
        Long filmeId,
        @NotBlank(message = "Escreva a análise.")
        @Size(min = 10, max = 2000, message = "A análise deve ter entre 10 e 2000 caracteres.")
        String texto,
        @NotNull(message = "Informe a nota.")
        @DecimalMin(value = "0.0", message = "A nota mínima é 0.")
        @DecimalMax(value = "10.0", message = "A nota máxima é 10.")
        Double nota
) {
}
