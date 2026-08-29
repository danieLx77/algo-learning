package br.com.algolearning.modules.binarysearch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ExerciseSubmissionRequest(
    @NotEmpty(message = "O array não pode ser vazio")
    @NotNull(message = "O array não pode ser nulo")
    @Size(max = 100, message = "O array pode conter no máximo 100 itens")
    List<Integer> array,
    
    @NotNull(message = "O alvo não pode ser nulo")
    Integer target,

    @NotBlank(message = "O código não pode estar vazio")
    @Size(max = 12000, message = "O código pode conter no máximo 12.000 caracteres")
    String code
) {}
