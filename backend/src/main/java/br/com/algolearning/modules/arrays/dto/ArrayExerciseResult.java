package br.com.algolearning.modules.arrays.dto;

public record ArrayExerciseResult(
        boolean passed,
        long executionTimeMs,
        String message
) {
}
