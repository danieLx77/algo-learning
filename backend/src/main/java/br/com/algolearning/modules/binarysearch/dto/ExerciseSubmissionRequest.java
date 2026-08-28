package br.com.algolearning.modules.binarysearch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ExerciseSubmissionRequest(
    @NotEmpty(message = "O array não pode ser vazio")
    @NotNull(message = "O array não pode ser nulo")
    List<Integer> array,
    
    @NotNull(message = "O alvo não pode ser nulo")
    Integer target,

    @NotBlank(message = "O código não pode estar vazio")
    String code
) {}
