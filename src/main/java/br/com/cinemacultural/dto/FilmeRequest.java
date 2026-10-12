package br.com.cinemacultural.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FilmeRequest(
        @NotBlank(message = "Informe o título.")
        @Size(min = 2, max = 120, message = "O título deve ter entre 2 e 120 caracteres.")
        String titulo,
        @NotBlank(message = "Informe a sinopse.")
        @Size(min = 20, max = 1500, message = "A sinopse deve ter entre 20 e 1500 caracteres.")
        String sinopse,
        @NotBlank(message = "Selecione o gênero.")
        @Size(max = 100, message = "O gênero deve ter até 100 caracteres.")
        String genero,
        @NotNull(message = "Informe o ano de lançamento.")
        @Min(value = 1888, message = "O ano deve ser a partir de 1888.")
        @Max(value = 2100, message = "O ano deve ser até 2100.")
        Integer anoLancamento,
        String cor
) {
}
