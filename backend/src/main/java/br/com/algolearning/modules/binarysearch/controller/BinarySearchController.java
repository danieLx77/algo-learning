package br.com.algolearning.modules.binarysearch.controller;

import br.com.algolearning.modules.binarysearch.dto.*;
import br.com.algolearning.modules.binarysearch.service.BinarySearchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/algorithms/binary-search")
public class BinarySearchController {

    private final BinarySearchService service;

    public BinarySearchController(BinarySearchService service) {
        this.service = service;
    }

    @PostMapping("/execute")
    public ResponseEntity<BinarySearchResponse> executeSearch(@Valid @RequestBody BinarySearchRequest request) {
        BinarySearchResponse response = service.search(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trace")
    public ResponseEntity<List<BinarySearchStep>> trace(@RequestParam("target") Integer target) {
        List<BinarySearchStep> steps = service.trace(target);
        return ResponseEntity.ok(steps);
    }

    @PostMapping("/verify")
    public ResponseEntity<ExerciseResult> verify(@Valid @RequestBody ExerciseSubmissionRequest request) {
        ExerciseResult result = service.verify(request);
        return ResponseEntity.ok(result);
    }
}
