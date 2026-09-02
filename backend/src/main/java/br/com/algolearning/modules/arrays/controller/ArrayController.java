package br.com.algolearning.modules.arrays.controller;

import br.com.algolearning.modules.arrays.dto.ArrayExerciseRequest;
import br.com.algolearning.modules.arrays.dto.ArrayExerciseResult;
import br.com.algolearning.modules.arrays.dto.ArrayStep;
import br.com.algolearning.modules.arrays.dto.ArrayTraceRequest;
import br.com.algolearning.modules.arrays.service.ArrayService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/algorithms/arrays")
public class ArrayController {

    private final ArrayService service;

    public ArrayController(ArrayService service) {
        this.service = service;
    }

    @PostMapping("/trace")
    public ResponseEntity<List<ArrayStep>> trace(@Valid @RequestBody ArrayTraceRequest request) {
        return ResponseEntity.ok(service.trace(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<ArrayExerciseResult> verify(@Valid @RequestBody ArrayExerciseRequest request) {
        return ResponseEntity.ok(service.verify(request));
    }
}
