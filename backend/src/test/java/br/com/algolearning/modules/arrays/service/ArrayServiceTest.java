package br.com.algolearning.modules.arrays.service;

import br.com.algolearning.modules.arrays.dto.ArrayExerciseRequest;
import br.com.algolearning.modules.arrays.dto.ArrayExerciseResult;
import br.com.algolearning.modules.arrays.dto.ArrayOperation;
import br.com.algolearning.modules.arrays.dto.ArrayStep;
import br.com.algolearning.modules.arrays.dto.ArrayTraceRequest;
import br.com.algolearning.modules.exercise.service.sandbox.JavaExerciseSandbox;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ArrayServiceTest {

    private static final List<Integer> VALUES = List.of(4, 8, 15, 16, 23, 42);
    private static final String CORRECT_REVERSE = """
            class Solution {
                public int[] reverse(int[] nums) {
                    int left = 0;
                    int right = nums.length - 1;
                    while (left < right) {
                        int temporary = nums[left];
                        nums[left] = nums[right];
                        nums[right] = temporary;
                        left++;
                        right--;
                    }
                    return nums;
                }
            }
            """;

    private ArrayService service;

    @BeforeEach
    void setUp() {
        service = new ArrayService(new JavaExerciseSandbox());
    }

    @Test
    void trace_shouldAccessValueInConstantTime() {
        List<ArrayStep> steps = service.trace(request(ArrayOperation.ACCESS, 2, null));

        assertEquals(1, steps.size());
        assertEquals(2, steps.get(0).activeIndex());
        assertTrue(steps.get(0).description().contains("15"));
    }

    @Test
    void trace_shouldUpdateSelectedIndex() {
        List<ArrayStep> steps = service.trace(request(ArrayOperation.UPDATE, 1, 99));

        assertEquals(2, steps.size());
        assertEquals(99, steps.get(1).values().get(1));
        assertTrue(steps.get(1).completed());
    }

    @Test
    void trace_shouldInsertAndShiftValues() {
        List<ArrayStep> steps = service.trace(request(ArrayOperation.INSERT, 2, 99));

        assertEquals(List.of(4, 8, 99, 15, 16, 23, 42), steps.get(1).values());
        assertFalse(steps.get(0).shiftedIndices().isEmpty());
    }

    @Test
    void trace_shouldRemoveAndShiftValues() {
        List<ArrayStep> steps = service.trace(request(ArrayOperation.REMOVE, 2, null));

        assertEquals(List.of(4, 8, 16, 23, 42), steps.get(1).values());
        assertTrue(steps.get(1).completed());
    }

    @Test
    void trace_shouldVisitEveryValue() {
        List<ArrayStep> steps = service.trace(request(ArrayOperation.TRAVERSE, null, null));

        assertEquals(VALUES.size(), steps.size());
        assertEquals(VALUES.size() - 1, steps.get(steps.size() - 1).activeIndex());
    }

    @Test
    void trace_shouldRejectIndexOutsideArray() {
        ArrayTraceRequest request = request(ArrayOperation.ACCESS, VALUES.size(), null);

        assertThrows(IllegalArgumentException.class, () -> service.trace(request));
    }

    @Test
    void verify_shouldApproveCorrectReverseImplementation() {
        ArrayExerciseResult result = service.verify(new ArrayExerciseRequest(CORRECT_REVERSE));

        assertTrue(result.passed());
        assertTrue(result.message().contains("Parabéns"));
    }

    @Test
    void verify_shouldRejectIncorrectImplementation() {
        String wrongCode = """
                class Solution {
                    public int[] reverse(int[] nums) {
                        return nums;
                    }
                }
                """;

        ArrayExerciseResult result = service.verify(new ArrayExerciseRequest(wrongCode));

        assertFalse(result.passed());
        assertTrue(result.message().contains("incorreto"));
    }

    @Test
    void verify_shouldReturnSafeMessageForForbiddenCode() {
        String forbiddenCode = """
                class Solution {
                    public int[] reverse(int[] nums) {
                        System.exit(0);
                        return nums;
                    }
                }
                """;

        ArrayExerciseResult result = service.verify(new ArrayExerciseRequest(forbiddenCode));

        assertFalse(result.passed());
        assertTrue(result.message().startsWith("Código não permitido"));
    }

    private ArrayTraceRequest request(ArrayOperation operation, Integer index, Integer value) {
        return new ArrayTraceRequest(VALUES, operation, index, value);
    }
}
