package br.com.algolearning.modules.binarysearch.service;

import br.com.algolearning.modules.binarysearch.dto.BinarySearchStep;
import br.com.algolearning.modules.binarysearch.dto.ExerciseResult;
import br.com.algolearning.modules.binarysearch.dto.ExerciseSubmissionRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class BinarySearchServiceTest {

    @InjectMocks
    private BinarySearchService service;

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
    void verify_shouldReturnPassed_whenSubmissionIsCorrect() {
        ExerciseSubmissionRequest request = new ExerciseSubmissionRequest(List.of(1, 2, 3, 4, 5), 4);
        ExerciseResult result = service.verify(request);
        
        assertTrue(result.passed());
    }
    
    @Test
    void verify_shouldThrowException_whenRequestIsNull() {
        assertThrows(IllegalArgumentException.class, () -> service.verify(null));
    }
}
