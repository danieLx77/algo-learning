package br.com.algolearning.modules.binarysearch.service;

import br.com.algolearning.modules.binarysearch.dto.BinarySearchStep;
import br.com.algolearning.modules.binarysearch.dto.ExerciseResult;
import br.com.algolearning.modules.binarysearch.dto.ExerciseSubmissionRequest;
import br.com.algolearning.modules.exercise.service.sandbox.JavaExerciseSandbox;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class BinarySearchServiceTest {

    private BinarySearchService service;

    @BeforeEach
    void setUp() {
        service = new BinarySearchService(new JavaExerciseSandbox());
    }

    private static final String CORRECT_CODE = """
            class Solution {
                public int search(int[] nums, int target) {
                    int left = 0;
                    int right = nums.length - 1;
                    while (left <= right) {
                        int mid = left + (right - left) / 2;
                        if (nums[mid] == target) return mid;
                        if (nums[mid] < target) left = mid + 1;
                        else right = mid - 1;
                    }
                    return -1;
                }
            }
            """;

    private static final String WRONG_CODE = """
            class Solution {
                public int search(int[] nums, int target) {
                    return -1;
                }
            }
            """;

    private static final String COMPILATION_ERROR_CODE = """
            class Solution {
                public int search(int[] nums, int target) {
                    return "not an int";
                }
            }
            """;

    private static final String ALWAYS_RETURN_ZERO_CODE = """
            class Solution {
                public int search(int[] nums, int target) {
                    return 0;
                }
            }
            """;

    @Test
    void trace_shouldReturnSteps_whenTargetExists() {
        List<BinarySearchStep> steps = service.trace(23);

        assertNotNull(steps);
        assertFalse(steps.isEmpty());
        assertTrue(steps.get(steps.size() - 1).found());
        assertEquals(23, steps.get(steps.size() - 1).midValue());
    }

    @Test
    void trace_shouldReturnSteps_whenTargetDoesNotExist() {
        List<BinarySearchStep> steps = service.trace(99);

        assertNotNull(steps);
        assertFalse(steps.isEmpty());
        assertFalse(steps.get(steps.size() - 1).found());
        assertEquals(-1, steps.get(steps.size() - 1).midValue());
    }

    @Test
    void trace_shouldThrowException_whenTargetIsNull() {
        assertThrows(IllegalArgumentException.class, () -> service.trace(null));
    }

    @Test
    void verify_shouldReturnPassed_whenCodeIsCorrect() {
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(
                List.of(-1, 0, 3, 5, 9, 12), 9, CORRECT_CODE);
        ExerciseResult result = service.verify(request);

        assertTrue(result.passed());
        assertTrue(result.message().contains("Parabéns"));
    }

    @Test
    void verify_shouldReturnFailed_whenCodeAlwaysReturnsMinusOne() {
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(
                List.of(-1, 0, 3, 5, 9, 12), 9, WRONG_CODE);
        ExerciseResult result = service.verify(request);

        assertFalse(result.passed());
        assertTrue(result.message().contains("Resultado incorreto"));
    }

    @Test
    void verify_shouldReturnFailed_whenCodeAlwaysReturnsZero() {
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(
                List.of(-1, 0, 3, 5, 9, 12), 9, ALWAYS_RETURN_ZERO_CODE);
        ExerciseResult result = service.verify(request);

        assertFalse(result.passed());
        assertTrue(result.message().contains("Resultado incorreto"));
    }

    @Test
    void verify_shouldReturnFailed_whenCodeHasCompilationError() {
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(
                List.of(-1, 0, 3, 5, 9, 12), 9, COMPILATION_ERROR_CODE);
        ExerciseResult result = service.verify(request);

        assertFalse(result.passed());
        assertTrue(result.message().contains("Erro de compilação"));
    }

    @Test
    void verify_shouldReturnPassed_whenTargetNotFound() {
        String codeNotFound = """
                class Solution {
                    public int search(int[] nums, int target) {
                        int left = 0;
                        int right = nums.length - 1;
                        while (left <= right) {
                            int mid = left + (right - left) / 2;
                            if (nums[mid] == target) return mid;
                            if (nums[mid] < target) left = mid + 1;
                            else right = mid - 1;
                        }
                        return -1;
                    }
                }
                """;
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(
                List.of(-1, 0, 3, 5, 9, 12), 7, codeNotFound);
        ExerciseResult result = service.verify(request);

        assertTrue(result.passed());
    }

    @Test
    void verify_shouldThrowException_whenRequestIsNull() {
        assertThrows(IllegalArgumentException.class, () -> service.verify(null));
    }

    @Test
    void verify_shouldThrowException_whenCodeIsNull() {
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(
                List.of(1, 2, 3), 2, null);
        assertThrows(IllegalArgumentException.class, () -> service.verify(request));
    }

    @Test
    void verify_shouldRejectCodeThatExceedsSizeLimit() {
        String oversizedCode = "a".repeat(JavaExerciseSandbox.MAX_CODE_LENGTH + 1);
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(
                List.of(1, 2, 3), 2, oversizedCode);

        assertThrows(IllegalArgumentException.class, () -> service.verify(request));
    }

    @Test
    void verify_shouldReturnSafeMessage_whenCodeViolatesPolicy() {
        String maliciousCode = """
                class Solution {
                    public int search(int[] nums, int target) {
                        System.exit(0);
                        return -1;
                    }
                }
                """;
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(
                List.of(1, 2, 3), 2, maliciousCode);

        ExerciseResult result = service.verify(request);

        assertFalse(result.passed());
        assertTrue(result.message().startsWith("Código não permitido"));
    }
}
