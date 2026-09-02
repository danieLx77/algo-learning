package br.com.algolearning.modules.arrays.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ArrayTraceRequest(
        @NotEmpty(message = "O array não pode ser vazio")
        @Size(max = 20, message = "O visualizador aceita no máximo 20 itens")
        List<@NotNull(message = "Os itens do array não podem ser nulos") Integer> array,

        @NotNull(message = "A operação não pode ser nula")
        ArrayOperation operation,

        Integer index,
        Integer value
) {
}
