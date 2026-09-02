package br.com.algolearning.modules.arrays.dto;

import br.com.algolearning.modules.exercise.service.sandbox.JavaExerciseSandbox;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ArrayExerciseRequest(
        @NotBlank(message = "O código não pode estar vazio")
        @Size(max = JavaExerciseSandbox.MAX_CODE_LENGTH, message = "O código pode conter no máximo 12.000 caracteres")
        String code
) {
}
