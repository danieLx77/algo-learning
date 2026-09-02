package br.com.algolearning.modules.exercise.service.sandbox;

import br.com.algolearning.modules.exercise.service.sandbox.JavaExerciseSandbox.Reason;
import br.com.algolearning.modules.exercise.service.sandbox.JavaExerciseSandbox.SandboxException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JavaExerciseSandboxTest {

    private static final List<Integer> VALUES = List.of(-1, 0, 3, 5, 9, 12);

    private JavaExerciseSandbox sandbox;

    @BeforeEach
    void setUp() {
        sandbox = new JavaExerciseSandbox();
    }

    @Test
    void execute_shouldReturnResult_whenCodeUsesAllowedSubset() throws SandboxException {
        int result = sandbox.execute(solution("""
                int left = 0;
                int right = nums.length - 1;
                while (left <= right) {
                    int mid = left + (right - left) / 2;
                    if (nums[mid] == target) return mid;
                    if (nums[mid] < target) left = mid + 1;
                    else right = mid - 1;
                }
                return -1;
                """), VALUES, 9);

        assertEquals(4, result);
    }

    @Test
    void execute_shouldRejectSystemExit() {
        SandboxException exception = assertThrows(SandboxException.class, () -> sandbox.execute(
                solution("System.exit(0); return -1;"), VALUES, 9));

        assertEquals(Reason.POLICY, exception.reason());
    }

    @Test
    void execute_shouldRejectFileAccess() {
        SandboxException exception = assertThrows(SandboxException.class, () -> sandbox.execute(
                solution("return java.nio.file.Files.exists(java.nio.file.Path.of(\"/etc/passwd\")) ? 1 : -1;"),
                VALUES,
                9));

        assertEquals(Reason.POLICY, exception.reason());
    }

    @Test
    void execute_shouldRejectNetworkAccess() {
        SandboxException exception = assertThrows(SandboxException.class, () -> sandbox.execute(
                solution("java.net.Socket socket = new java.net.Socket(); return -1;"), VALUES, 9));

        assertEquals(Reason.POLICY, exception.reason());
    }

    @Test
    void execute_shouldRejectReflection() {
        SandboxException exception = assertThrows(SandboxException.class, () -> sandbox.execute(
                solution("return Class.forName(\"java.lang.Runtime\") != null ? 1 : -1;"), VALUES, 9));

        assertEquals(Reason.POLICY, exception.reason());
    }

    @Test
    void execute_shouldStopInfiniteLoop() {
        SandboxException exception = assertThrows(SandboxException.class, () -> sandbox.execute(
                solution("while (true) {}"), VALUES, 9));

        assertEquals(Reason.TIMEOUT, exception.reason());
    }

    @Test
    void execute_shouldContainExcessiveMemoryAllocation() {
        SandboxException exception = assertThrows(SandboxException.class, () -> sandbox.execute(
                solution("int[] memory = new int[Integer.MAX_VALUE]; return memory.length;"), VALUES, 9));

        assertEquals(Reason.RUNTIME, exception.reason());
    }

    @Test
    void execute_shouldRejectImportsAndAdditionalMembers() {
        String code = """
                import java.util.Arrays;
                class Solution {
                    private int state;
                    public int search(int[] nums, int target) {
                        return -1;
                    }
                }
                """;

        SandboxException exception = assertThrows(
                SandboxException.class,
                () -> sandbox.execute(code, VALUES, 9)
        );

        assertEquals(Reason.POLICY, exception.reason());
    }

    @Test
    void verifyReverse_shouldValidateMultipleCases() throws SandboxException {
        String code = """
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

        boolean passed = sandbox.verifyReverse(code, List.of(VALUES, List.of(7), List.of(-4, 8)));

        assertTrue(passed);
    }

    @Test
    void verifyReverse_shouldRejectWrongMethodSignature() {
        SandboxException exception = assertThrows(SandboxException.class, () -> sandbox.verifyReverse(
                solution("return -1;"),
                List.of(VALUES)
        ));

        assertEquals(Reason.POLICY, exception.reason());
    }

    private String solution(String body) {
        return """
                class Solution {
                    public int search(int[] nums, int target) {
                        %s
                    }
                }
                """.formatted(body);
    }
}
