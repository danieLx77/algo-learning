package br.com.algolearning.modules.binarysearch.dto;

public record BinarySearchResponse(
    boolean found,
    int index,
    int steps
) {}
