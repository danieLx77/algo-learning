package br.com.algolearning.modules.binarysearch.dto;

public record ExerciseResult(
    boolean passed,
    long executionTimeMs,
    String message
) {}
