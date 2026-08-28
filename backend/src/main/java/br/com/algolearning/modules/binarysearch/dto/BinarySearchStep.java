package br.com.algolearning.modules.binarysearch.dto;

public record BinarySearchStep(
    int low,
    int mid,
    int high,
    int midValue,
    boolean found,
    String description
) {}
