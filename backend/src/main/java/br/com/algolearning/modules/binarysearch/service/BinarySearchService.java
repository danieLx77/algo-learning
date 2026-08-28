package br.com.algolearning.modules.binarysearch.service;

import br.com.algolearning.modules.binarysearch.dto.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BinarySearchService {

    private static final List<Integer> STATIC_ARRAY = List.of(2, 5, 8, 12, 16, 23, 38, 56, 72, 91);

    public BinarySearchResponse search(BinarySearchRequest request) {
        if (request == null || request.array() == null || request.target() == null) {
            throw new IllegalArgumentException("Os parâmetros de busca não podem ser nulos");
        }

        List<Integer> array = request.array();
        int target = request.target();

        int left = 0;
        int right = array.size() - 1;
        int steps = 0;

        while (left <= right) {
            steps++;
            int mid = left + (right - left) / 2;
            int midValue = array.get(mid);

            if (midValue == target) {
                return new BinarySearchResponse(true, mid, steps);
            }

            if (midValue < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return new BinarySearchResponse(false, -1, steps);
    }

    public List<BinarySearchStep> trace(Integer target) {
        if (target == null) {
            throw new IllegalArgumentException("O alvo não pode ser nulo");
        }

        List<BinarySearchStep> stepsList = new ArrayList<>();
        int left = 0;
        int right = STATIC_ARRAY.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int midValue = STATIC_ARRAY.get(mid);
            boolean found = (midValue == target);

            String description = found ? "Alvo encontrado no índice " + mid :
                (midValue < target ? "O alvo é maior que " + midValue + ", buscando na metade direita." :
                "O alvo é menor que " + midValue + ", buscando na metade esquerda.");

            stepsList.add(new BinarySearchStep(left, mid, right, midValue, found, description));

            if (found) {
                return stepsList;
            }

            if (midValue < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        stepsList.add(new BinarySearchStep(left, -1, right, -1, false, "Alvo não encontrado no array."));
        return stepsList;
    }

    public ExerciseResult verify(ExerciseSubmissionRequest request) {
        if (request == null || request.array() == null || request.target() == null) {
            throw new IllegalArgumentException("Os parâmetros de submissão não podem ser nulos");
        }

        long startTime = System.currentTimeMillis();
        
        // Simplesmente executar a busca para validar
        List<Integer> array = request.array();
        int target = request.target();
        
        int expectedIndex = java.util.Collections.binarySearch(array, target);
        
        int left = 0;
        int right = array.size() - 1;
        int foundIndex = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int midValue = array.get(mid);

            if (midValue == target) {
                foundIndex = mid;
                break;
            }

            if (midValue < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        long executionTimeMs = System.currentTimeMillis() - startTime;
        
        // binarySearch returns (-(insertion point) - 1) if not found.
        boolean isCorrect = false;
        if (expectedIndex >= 0 && foundIndex == expectedIndex) {
            isCorrect = true;
        } else if (expectedIndex < 0 && foundIndex == -1) {
            isCorrect = true;
        }

        if (isCorrect) {
            return new ExerciseResult(true, executionTimeMs, "Parabéns! Sua submissão atende aos requisitos.");
        } else {
            return new ExerciseResult(false, executionTimeMs, "Submissão incorreta. O resultado obtido não confere com o esperado.");
        }
    }
}
