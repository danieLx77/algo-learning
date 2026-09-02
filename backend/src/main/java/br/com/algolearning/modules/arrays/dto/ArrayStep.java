package br.com.algolearning.modules.arrays.dto;

import java.util.List;

public record ArrayStep(
        List<Integer> values,
        int activeIndex,
        List<Integer> shiftedIndices,
        String description,
        boolean completed
) {
    public ArrayStep {
        values = List.copyOf(values);
        shiftedIndices = List.copyOf(shiftedIndices);
    }
}
