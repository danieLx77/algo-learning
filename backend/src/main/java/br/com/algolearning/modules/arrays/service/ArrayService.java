package br.com.algolearning.modules.arrays.service;

import br.com.algolearning.modules.arrays.dto.ArrayExerciseRequest;
import br.com.algolearning.modules.arrays.dto.ArrayExerciseResult;
import br.com.algolearning.modules.arrays.dto.ArrayOperation;
import br.com.algolearning.modules.arrays.dto.ArrayStep;
import br.com.algolearning.modules.arrays.dto.ArrayTraceRequest;
import br.com.algolearning.modules.exercise.service.sandbox.JavaExerciseSandbox;
import br.com.algolearning.modules.exercise.service.sandbox.JavaExerciseSandbox.SandboxException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.IntStream;

@Service
public final class ArrayService {

    private static final List<List<Integer>> REVERSE_CASES = List.of(
            List.of(1, 2, 3, 4, 5),
            List.of(-8, 0, 12, 42),
            List.of(7)
    );

    private final JavaExerciseSandbox exerciseSandbox;

    public ArrayService(JavaExerciseSandbox exerciseSandbox) {
        this.exerciseSandbox = Objects.requireNonNull(exerciseSandbox, "O sandbox não pode ser nulo");
    }

    public List<ArrayStep> trace(ArrayTraceRequest request) {
        validateTraceRequest(request);
        List<Integer> values = new ArrayList<>(request.array());

        return switch (request.operation()) {
            case ACCESS -> access(values, request.index());
            case UPDATE -> update(values, request.index(), request.value());
            case INSERT -> insert(values, request.index(), request.value());
            case REMOVE -> remove(values, request.index());
            case TRAVERSE -> traverse(values);
        };
    }

    public ArrayExerciseResult verify(ArrayExerciseRequest request) {
        if (request == null || request.code() == null || request.code().isBlank()) {
            throw new IllegalArgumentException("O código não pode estar vazio");
        }
        if (request.code().length() > JavaExerciseSandbox.MAX_CODE_LENGTH) {
            throw new IllegalArgumentException("O código pode conter no máximo 12.000 caracteres");
        }

        long startTime = System.currentTimeMillis();
        try {
            boolean passed = exerciseSandbox.verifyReverse(request.code(), REVERSE_CASES);
            long elapsed = System.currentTimeMillis() - startTime;
            String message = passed
                    ? "Parabéns! Sua solução inverte arrays de diferentes tamanhos."
                    : "Resultado incorreto. Revise as trocas entre as extremidades do array.";
            return new ArrayExerciseResult(passed, elapsed, message);
        } catch (SandboxException exception) {
            long elapsed = System.currentTimeMillis() - startTime;
            String prefix = switch (exception.reason()) {
                case POLICY -> "Código não permitido: ";
                case COMPILATION -> "Erro de compilação:\n";
                case TIMEOUT -> "Tempo limite excedido: ";
                case RUNTIME -> "Erro de execução: ";
                case BUSY -> "Executor ocupado: ";
                case INTERNAL -> "Executor indisponível: ";
            };
            return new ArrayExerciseResult(false, elapsed, prefix + exception.getMessage());
        }
    }

    private void validateTraceRequest(ArrayTraceRequest request) {
        if (request == null || request.array() == null || request.operation() == null) {
            throw new IllegalArgumentException("Array e operação são obrigatórios");
        }
        if (request.array().isEmpty() || request.array().size() > 20 || request.array().stream().anyMatch(Objects::isNull)) {
            throw new IllegalArgumentException("O array deve conter entre 1 e 20 inteiros válidos");
        }

        ArrayOperation operation = request.operation();
        if (operation != ArrayOperation.TRAVERSE && request.index() == null) {
            throw new IllegalArgumentException("Informe um índice para esta operação");
        }
        if ((operation == ArrayOperation.UPDATE || operation == ArrayOperation.INSERT) && request.value() == null) {
            throw new IllegalArgumentException("Informe um valor para esta operação");
        }

        int maxIndex = operation == ArrayOperation.INSERT ? request.array().size() : request.array().size() - 1;
        if (request.index() != null && (request.index() < 0 || request.index() > maxIndex)) {
            throw new IllegalArgumentException("O índice está fora dos limites do array");
        }
        if (operation == ArrayOperation.INSERT && request.array().size() == 20) {
            throw new IllegalArgumentException("O array atingiu o limite de 20 itens do visualizador");
        }
    }

    private List<ArrayStep> access(List<Integer> values, int index) {
        return List.of(step(values, index, List.of(),
                "Acesso direto ao índice %d: valor %d.".formatted(index, values.get(index)), true));
    }

    private List<ArrayStep> update(List<Integer> values, int index, int value) {
        List<ArrayStep> steps = new ArrayList<>();
        steps.add(step(values, index, List.of(), "Localizando o índice %d para atualização.".formatted(index), false));
        int previousValue = values.set(index, value);
        steps.add(step(values, index, List.of(),
                "Valor %d substituído por %d no índice %d.".formatted(previousValue, value, index), true));
        return List.copyOf(steps);
    }

    private List<ArrayStep> insert(List<Integer> values, int index, int value) {
        List<ArrayStep> steps = new ArrayList<>();
        steps.add(step(values, index, range(index, values.size()),
                "Abrindo espaço no índice %d; os itens seguintes deslocam uma posição.".formatted(index), false));
        values.add(index, value);
        steps.add(step(values, index, List.of(index),
                "Valor %d inserido no índice %d.".formatted(value, index), true));
        return List.copyOf(steps);
    }

    private List<ArrayStep> remove(List<Integer> values, int index) {
        List<ArrayStep> steps = new ArrayList<>();
        int removedValue = values.get(index);
        steps.add(step(values, index, List.of(index),
                "O valor %d será removido do índice %d.".formatted(removedValue, index), false));
        values.remove(index);
        int activeIndex = values.isEmpty() ? -1 : Math.min(index, values.size() - 1);
        steps.add(step(values, activeIndex, range(index, values.size()),
                "Remoção concluída; os itens seguintes deslocaram uma posição.", true));
        return List.copyOf(steps);
    }

    private List<ArrayStep> traverse(List<Integer> values) {
        List<ArrayStep> steps = new ArrayList<>();
        for (int index = 0; index < values.size(); index++) {
            steps.add(step(values, index, List.of(),
                    "Visitando o índice %d, que armazena o valor %d.".formatted(index, values.get(index)),
                    index == values.size() - 1));
        }
        return List.copyOf(steps);
    }

    private ArrayStep step(List<Integer> values, int activeIndex, List<Integer> shiftedIndices,
                           String description, boolean completed) {
        return new ArrayStep(values, activeIndex, shiftedIndices, description, completed);
    }

    private List<Integer> range(int startInclusive, int endExclusive) {
        return IntStream.range(startInclusive, endExclusive).boxed().toList();
    }
}
