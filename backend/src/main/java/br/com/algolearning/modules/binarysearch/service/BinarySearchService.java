package br.com.algolearning.modules.binarysearch.service;

import br.com.algolearning.modules.binarysearch.dto.*;
import br.com.algolearning.modules.binarysearch.service.sandbox.JavaExerciseSandbox;
import br.com.algolearning.modules.binarysearch.service.sandbox.JavaExerciseSandbox.SandboxException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BinarySearchService {

    private static final List<Integer> STATIC_ARRAY = List.of(2, 5, 8, 12, 16, 23, 38, 56, 72, 91);
    private static final int MAX_EXERCISE_ARRAY_LENGTH = 100;

    private final JavaExerciseSandbox exerciseSandbox;

    public BinarySearchService(JavaExerciseSandbox exerciseSandbox) {
        this.exerciseSandbox = java.util.Objects.requireNonNull(exerciseSandbox, "O sandbox não pode ser nulo");
    }

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
        if (request == null || request.array() == null || request.target() == null || request.code() == null) {
            throw new IllegalArgumentException("Os parâmetros de submissão não podem ser nulos");
        }
        if (request.array().isEmpty()
                || request.array().size() > MAX_EXERCISE_ARRAY_LENGTH
                || request.array().stream().anyMatch(java.util.Objects::isNull)) {
            throw new IllegalArgumentException("O array deve conter entre 1 e 100 inteiros válidos");
        }
        if (request.code().isBlank() || request.code().length() > JavaExerciseSandbox.MAX_CODE_LENGTH) {
            throw new IllegalArgumentException("O código deve conter entre 1 e 12.000 caracteres");
        }

        long startTime = System.currentTimeMillis();
        List<Integer> array = request.array();
        int target = request.target();
        int expectedIndex = java.util.Collections.binarySearch(array, target);

        try {
            int userResult = exerciseSandbox.execute(request.code(), array, target);
            long executionTimeMs = System.currentTimeMillis() - startTime;
            boolean isCorrect = expectedIndex >= 0
                    ? userResult == expectedIndex
                    : userResult == -1;

            if (isCorrect) {
                return new ExerciseResult(true, executionTimeMs, "Parabéns! Sua submissão atende aos requisitos.");
            }

            String message = String.format(
                    "Resultado incorreto. Esperado: %d, Obtido: %d",
                    expectedIndex >= 0 ? expectedIndex : -1,
                    userResult
            );
            return new ExerciseResult(false, executionTimeMs, message);
        } catch (SandboxException exception) {
            long executionTimeMs = System.currentTimeMillis() - startTime;
            String prefix = switch (exception.reason()) {
                case POLICY -> "Código não permitido: ";
                case COMPILATION -> "Erro de compilação:\n";
                case TIMEOUT -> "Tempo limite excedido: ";
                case RUNTIME -> "Erro de execução: ";
                case BUSY -> "Executor ocupado: ";
                case INTERNAL -> "Executor indisponível: ";
            };
            return new ExerciseResult(false, executionTimeMs, prefix + exception.getMessage());
        }
    }
}
