package br.com.algolearning.modules.binarysearch.service;

import br.com.algolearning.modules.binarysearch.dto.*;
import org.springframework.stereotype.Service;

import javax.tools.*;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
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
        if (request == null || request.array() == null || request.target() == null || request.code() == null) {
            throw new IllegalArgumentException("Os parâmetros de submissão não podem ser nulos");
        }

        long startTime = System.currentTimeMillis();

        List<Integer> array = request.array();
        int target = request.target();
        String userCode = request.code();

        int expectedIndex = java.util.Collections.binarySearch(array, target);

        try {
            int userResult = compileAndExecute(userCode, array, target);
            long executionTimeMs = System.currentTimeMillis() - startTime;

            boolean isCorrect = false;
            if (expectedIndex >= 0 && userResult == expectedIndex) {
                isCorrect = true;
            } else if (expectedIndex < 0 && userResult == -1) {
                isCorrect = true;
            }

            if (isCorrect) {
                return new ExerciseResult(true, executionTimeMs, "Parabéns! Sua submissão atende aos requisitos.");
            } else {
                String msg = String.format(
                    "Resultado incorreto. Esperado: %d, Obtido: %d",
                    expectedIndex >= 0 ? expectedIndex : -1, userResult
                );
                return new ExerciseResult(false, executionTimeMs, msg);
            }
        } catch (CompilationException e) {
            long executionTimeMs = System.currentTimeMillis() - startTime;
            return new ExerciseResult(false, executionTimeMs, "Erro de compilação:\n" + e.getErrors());
        } catch (Exception e) {
            long executionTimeMs = System.currentTimeMillis() - startTime;
            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return new ExerciseResult(false, executionTimeMs, "Erro de execução: " + msg);
        }
    }

    private int compileAndExecute(String userCode, List<Integer> array, int target) throws Exception {
        String className = extractClassName(userCode);
        String fullClassName = "sandbox." + className;
        String wrappedCode = wrapCode(userCode, fullClassName, className);

        File tempDir = Files.createTempDirectory("sandbox-").toFile();
        try {
            compileCode(wrappedCode, tempDir);
            return executeClass(fullClassName, tempDir, array, target);
        } finally {
            deleteRecursive(tempDir);
        }
    }

    private void compileCode(String code, File outputDir) throws CompilationException {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            throw new CompilationException("JavaCompiler não disponível. Verifique se o JDK está configurado.");
        }

        DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
        StandardJavaFileManager stdFm = compiler.getStandardFileManager(diagnostics, null, null);

        JavaFileObject sourceFile = new SimpleJavaFileObject(
                java.net.URI.create("string:///Solution.java"), JavaFileObject.Kind.SOURCE) {
            @Override
            public CharSequence getCharContent(boolean ignoreEncodingErrors) {
                return code;
            }
        };

        List<String> options = List.of("-d", outputDir.getAbsolutePath());
        JavaCompiler.CompilationTask task = compiler.getTask(
                null, stdFm, diagnostics, options, null, List.of(sourceFile));

        boolean success = task.call();
        if (!success) {
            StringBuilder errors = new StringBuilder();
            for (Diagnostic<? extends JavaFileObject> d : diagnostics.getDiagnostics()) {
                errors.append(d.getMessage(null)).append("\n");
            }
            throw new CompilationException(errors.toString().trim());
        }
    }

    private int executeClass(String fullClassName, File classDir, List<Integer> array, int target) throws Exception {
        URLClassLoader classLoader = new URLClassLoader(
                new URL[]{classDir.toURI().toURL()},
                BinarySearchService.class.getClassLoader());

        try {
            Class<?> clazz = Class.forName(fullClassName, true, classLoader);
            java.lang.reflect.Constructor<?> ctor = clazz.getDeclaredConstructor();
            ctor.setAccessible(true);
            Object instance = ctor.newInstance();

            int[] intArray = array.stream().mapToInt(Integer::intValue).toArray();
            java.lang.reflect.Method method = clazz.getMethod("search", int[].class, int.class);
            method.setAccessible(true);
            Object result = method.invoke(instance, intArray, target);

            return (int) result;
        } finally {
            classLoader.close();
        }
    }

    private String extractClassName(String code) {
        if (code.contains("class Solution")) {
            return "Solution";
        }
        int classIdx = code.indexOf("class ");
        if (classIdx >= 0) {
            String afterClass = code.substring(classIdx + 6).trim();
            int spaceIdx = afterClass.indexOf(' ');
            int braceIdx = afterClass.indexOf('{');
            int endIdx = Math.min(
                    spaceIdx >= 0 ? spaceIdx : afterClass.length(),
                    braceIdx >= 0 ? braceIdx : afterClass.length()
            );
            return afterClass.substring(0, endIdx).trim();
        }
        return "Solution";
    }

    private String wrapCode(String userCode, String fullClassName, String simpleClassName) {
        String trimmed = userCode.trim();
        if (trimmed.startsWith("class ")) {
            return "package sandbox;\n\n" + trimmed;
        }
        return "package sandbox;\n\npublic class " + simpleClassName + " {\n" + trimmed + "\n}";
    }

    private void deleteRecursive(File file) {
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                for (File child : children) {
                    deleteRecursive(child);
                }
            }
        }
        file.delete();
    }

    private static class CompilationException extends Exception {
        private final String errors;
        CompilationException(String errors) {
            super("Erro de compilação");
            this.errors = errors;
        }
        String getErrors() { return errors; }
    }
}
