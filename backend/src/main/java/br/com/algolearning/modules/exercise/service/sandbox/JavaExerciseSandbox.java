package br.com.algolearning.modules.exercise.service.sandbox;

import com.sun.source.tree.AnnotationTree;
import com.sun.source.tree.ClassTree;
import com.sun.source.tree.CompilationUnitTree;
import com.sun.source.tree.LambdaExpressionTree;
import com.sun.source.tree.MemberReferenceTree;
import com.sun.source.tree.MethodInvocationTree;
import com.sun.source.tree.MethodTree;
import com.sun.source.tree.NewClassTree;
import com.sun.source.tree.SynchronizedTree;
import com.sun.source.tree.ThrowTree;
import com.sun.source.tree.Tree;
import com.sun.source.tree.TryTree;
import com.sun.source.util.JavacTask;
import com.sun.source.util.TreeScanner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.lang.model.element.Modifier;
import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;
import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public final class JavaExerciseSandbox {

    private static final Logger LOGGER = LoggerFactory.getLogger(JavaExerciseSandbox.class);
    public static final int MAX_CODE_LENGTH = 12_000;
    private static final int MAX_ARRAY_LENGTH = 100;
    private static final int MAX_CONCURRENT_EXECUTIONS = 2;
    private static final int MAX_OUTPUT_BYTES = 1_024;
    private static final long QUEUE_TIMEOUT_MILLIS = 500;
    private static final long EXECUTION_TIMEOUT_MILLIS = 2_000;
    private static final String RESULT_PREFIX = "RESULT:";
    private static final String SOLUTION_CLASS = "Solution";
    private static final String RUNNER_CLASS = "SandboxRunner";
    private final Semaphore executionSlots = new Semaphore(MAX_CONCURRENT_EXECUTIONS, true);

    public int execute(String userCode, List<Integer> array, int target) throws SandboxException {
        validateInput(userCode, array);
        String output = executeIsolated(userCode, ExerciseContract.SEARCH, createSearchRunnerSource(array, target));

        try {
            return Integer.parseInt(output);
        } catch (NumberFormatException exception) {
            throw SandboxException.runtime("A solução retornou um resultado inválido.");
        }
    }

    public boolean verifyReverse(String userCode, List<List<Integer>> testCases) throws SandboxException {
        validateReverseInput(userCode, testCases);
        String output = executeIsolated(userCode, ExerciseContract.REVERSE, createReverseRunnerSource(testCases));
        if (!output.equals("true") && !output.equals("false")) {
            throw SandboxException.runtime("A solução retornou um resultado inválido.");
        }
        return Boolean.parseBoolean(output);
    }

    private String executeIsolated(String userCode, ExerciseContract contract, String runnerSource)
            throws SandboxException {
        acquireExecutionSlot();

        try {
            validateSourcePolicy(userCode, contract);
            Path sandboxDirectory = createSandboxDirectory();
            try {
                compile(userCode, runnerSource, sandboxDirectory);
                return executeInChildJvm(sandboxDirectory);
            } finally {
                deleteSandboxDirectory(sandboxDirectory);
            }
        } finally {
            executionSlots.release();
        }
    }

    private void validateReverseInput(String userCode, List<List<Integer>> testCases) throws SandboxException {
        if (testCases == null || testCases.isEmpty() || testCases.size() > 10) {
            throw SandboxException.policy("Informe entre 1 e 10 casos de teste.");
        }
        for (List<Integer> testCase : testCases) {
            validateInput(userCode, testCase);
        }
    }

    private void acquireExecutionSlot() throws SandboxException {
        try {
            if (!executionSlots.tryAcquire(QUEUE_TIMEOUT_MILLIS, TimeUnit.MILLISECONDS)) {
                throw SandboxException.busy("Muitas submissões estão em execução. Tente novamente em instantes.");
            }
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw SandboxException.internal("A espera pelo executor isolado foi interrompida.", exception);
        }
    }

    private void validateInput(String userCode, List<Integer> array) throws SandboxException {
        if (userCode == null || userCode.isBlank()) {
            throw SandboxException.policy("O código não pode estar vazio.");
        }
        if (userCode.length() > MAX_CODE_LENGTH) {
            throw SandboxException.policy("O código excede o limite de 12.000 caracteres.");
        }
        if (array == null || array.isEmpty() || array.size() > MAX_ARRAY_LENGTH || array.stream().anyMatch(Objects::isNull)) {
            throw SandboxException.policy("O array deve conter entre 1 e 100 inteiros válidos.");
        }
    }

    private void validateSourcePolicy(String userCode, ExerciseContract contract) throws SandboxException {
        JavaCompiler compiler = requireCompiler();
        DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();

        try (StandardJavaFileManager fileManager = compiler.getStandardFileManager(diagnostics, Locale.ROOT, StandardCharsets.UTF_8)) {
            JavaFileObject source = new StringJavaFileObject(SOLUTION_CLASS, userCode);
            JavacTask task = (JavacTask) compiler.getTask(
                    null,
                    fileManager,
                    diagnostics,
                    List.of("-proc:none", "--release", "17"),
                    null,
                    List.of(source)
            );

            List<CompilationUnitTree> units = new ArrayList<>();
            task.parse().forEach(units::add);
            if (hasErrors(diagnostics)) {
                throw SandboxException.compilation(formatDiagnostics(diagnostics));
            }
            if (units.size() != 1) {
                throw SandboxException.policy("A submissão deve conter somente a classe Solution.");
            }

            validateCompilationUnit(units.get(0), contract);
        } catch (IOException exception) {
            throw SandboxException.internal("Não foi possível analisar a submissão.", exception);
        } catch (PolicyViolation exception) {
            throw SandboxException.policy(exception.getMessage());
        }
    }

    private void validateCompilationUnit(CompilationUnitTree unit, ExerciseContract contract) {
        if (unit.getPackageName() != null || !unit.getImports().isEmpty()) {
            throw new PolicyViolation("Packages e imports não são permitidos no exercício.");
        }
        if (unit.getTypeDecls().size() != 1 || !(unit.getTypeDecls().get(0) instanceof ClassTree solutionClass)) {
            throw new PolicyViolation("A submissão deve declarar somente a classe Solution.");
        }
        if (!solutionClass.getSimpleName().contentEquals(SOLUTION_CLASS)
                || solutionClass.getKind() != Tree.Kind.CLASS
                || !hasAllowedClassModifiers(solutionClass.getModifiers().getFlags())
                || solutionClass.getExtendsClause() != null
                || !solutionClass.getImplementsClause().isEmpty()
                || !solutionClass.getTypeParameters().isEmpty()
                || !solutionClass.getModifiers().getAnnotations().isEmpty()) {
            throw new PolicyViolation("A classe deve ser uma Solution simples, sem herança ou anotações.");
        }
        if (solutionClass.getMembers().size() != 1 || !(solutionClass.getMembers().get(0) instanceof MethodTree exerciseMethod)) {
            throw new PolicyViolation("Solution deve conter somente o método solicitado.");
        }

        validateExerciseMethod(exerciseMethod, contract);
        new RestrictedCodeScanner(solutionClass).scan(exerciseMethod.getBody(), null);
    }

    private boolean hasAllowedClassModifiers(Set<Modifier> modifiers) {
        return modifiers.stream().allMatch(modifier -> modifier == Modifier.PUBLIC || modifier == Modifier.FINAL);
    }

    private void validateExerciseMethod(MethodTree method, ExerciseContract contract) {
        Set<Modifier> modifiers = method.getModifiers().getFlags();
        boolean commonSignature = modifiers.equals(Set.of(Modifier.PUBLIC))
                && method.getBody() != null
                && method.getTypeParameters().isEmpty()
                && method.getThrows().isEmpty()
                && method.getDefaultValue() == null
                && method.getReceiverParameter() == null
                && method.getModifiers().getAnnotations().isEmpty();
        boolean validSearchSignature = contract == ExerciseContract.SEARCH
                && method.getName().contentEquals("search")
                && method.getReturnType() != null
                && method.getReturnType().toString().equals("int")
                && method.getParameters().size() == 2
                && method.getParameters().get(0).getType().toString().equals("int[]")
                && method.getParameters().get(1).getType().toString().equals("int")
                && commonSignature;
        boolean validReverseSignature = contract == ExerciseContract.REVERSE
                && method.getName().contentEquals("reverse")
                && method.getReturnType() != null
                && method.getReturnType().toString().equals("int[]")
                && method.getParameters().size() == 1
                && method.getParameters().get(0).getType().toString().equals("int[]")
                && commonSignature;

        if (!validSearchSignature && !validReverseSignature) {
            throw new PolicyViolation("Use exatamente a assinatura " + contract.signature() + ".");
        }
    }

    private void compile(String userCode, String runnerCode, Path outputDirectory) throws SandboxException {
        JavaCompiler compiler = requireCompiler();
        DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();

        try (StandardJavaFileManager fileManager = compiler.getStandardFileManager(diagnostics, Locale.ROOT, StandardCharsets.UTF_8)) {
            List<JavaFileObject> sources = List.of(
                    new StringJavaFileObject(SOLUTION_CLASS, userCode),
                    new StringJavaFileObject(RUNNER_CLASS, runnerCode)
            );
            List<String> options = List.of(
                    "-proc:none",
                    "--release", "17",
                    "-encoding", "UTF-8",
                    "-classpath", outputDirectory.toString(),
                    "-d", outputDirectory.toString()
            );
            Boolean success = compiler.getTask(null, fileManager, diagnostics, options, null, sources).call();
            if (!Boolean.TRUE.equals(success)) {
                throw SandboxException.compilation(formatDiagnostics(diagnostics));
            }
        } catch (IOException exception) {
            throw SandboxException.internal("Não foi possível compilar a submissão.", exception);
        }
    }

    private String executeInChildJvm(Path sandboxDirectory) throws SandboxException {
        Process process = null;
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    javaExecutable().toString(),
                    "-Xms8m",
                    "-Xmx32m",
                    "-XX:MaxMetaspaceSize=32m",
                    "-XX:+UseSerialGC",
                    "-XX:+DisableAttachMechanism",
                    "--limit-modules", "java.base",
                    "-Djava.awt.headless=true",
                    "-Djava.io.tmpdir=" + sandboxDirectory,
                    "-cp", sandboxDirectory.toString(),
                    RUNNER_CLASS
            );
            processBuilder.directory(sandboxDirectory.toFile());
            processBuilder.redirectErrorStream(true);
            processBuilder.environment().clear();
            process = processBuilder.start();
            process.getOutputStream().close();

            if (!process.waitFor(EXECUTION_TIMEOUT_MILLIS, TimeUnit.MILLISECONDS)) {
                destroyProcessTree(process);
                throw SandboxException.timeout("A execução excedeu o limite de 2 segundos.");
            }

            byte[] outputBytes = process.getInputStream().readNBytes(MAX_OUTPUT_BYTES);
            String output = new String(outputBytes, StandardCharsets.UTF_8).trim();
            if (process.exitValue() != 0) {
                throw SandboxException.runtime("A solução foi encerrada por violar os limites de execução.");
            }
            if (!output.startsWith(RESULT_PREFIX)) {
                throw SandboxException.runtime("A solução não retornou um resultado válido.");
            }

            return output.substring(RESULT_PREFIX.length()).trim();
        } catch (IOException exception) {
            throw SandboxException.internal("Não foi possível iniciar o executor isolado.", exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            if (process != null) {
                destroyProcessTree(process);
            }
            throw SandboxException.internal("A execução isolada foi interrompida.", exception);
        }
    }

    private JavaCompiler requireCompiler() throws SandboxException {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            throw SandboxException.internal("JavaCompiler indisponível. Execute a aplicação com um JDK.", null);
        }
        return compiler;
    }

    private Path createSandboxDirectory() throws SandboxException {
        try {
            Path directory = Files.createTempDirectory("algo-sandbox-");
            try {
                Files.setPosixFilePermissions(directory, PosixFilePermissions.fromString("rwx------"));
            } catch (UnsupportedOperationException exception) {
                LOGGER.debug("Permissões POSIX indisponíveis para o diretório temporário", exception);
            }
            return directory;
        } catch (IOException exception) {
            throw SandboxException.internal("Não foi possível criar o ambiente isolado.", exception);
        }
    }

    private String createSearchRunnerSource(List<Integer> array, int target) {
        String values = array.stream().map(String::valueOf).collect(Collectors.joining(", "));
        return """
                public final class SandboxRunner {
                    private SandboxRunner() {}

                    public static void main(String[] args) {
                        int[] values = new int[] {%s};
                        int result = new Solution().search(values, %d);
                        System.out.print("RESULT:" + result);
                    }
                }
                """.formatted(values, target);
    }

    private String createReverseRunnerSource(List<List<Integer>> testCases) {
        String inputs = testCases.stream()
                .map(this::toIntArraySource)
                .collect(Collectors.joining(", "));
        String expected = testCases.stream()
                .map(values -> {
                    List<Integer> reversed = new ArrayList<>(values);
                    java.util.Collections.reverse(reversed);
                    return toIntArraySource(reversed);
                })
                .collect(Collectors.joining(", "));

        return """
                public final class SandboxRunner {
                    private SandboxRunner() {}

                    public static void main(String[] args) {
                        int[][] inputs = new int[][] {%s};
                        int[][] expected = new int[][] {%s};
                        Solution solution = new Solution();
                        boolean passed = true;
                        for (int index = 0; index < inputs.length; index++) {
                            int[] result = solution.reverse(inputs[index]);
                            if (!equals(result, expected[index])) {
                                passed = false;
                                break;
                            }
                        }
                        System.out.print("RESULT:" + passed);
                    }

                    private static boolean equals(int[] left, int[] right) {
                        if (left == null || left.length != right.length) return false;
                        for (int index = 0; index < left.length; index++) {
                            if (left[index] != right[index]) return false;
                        }
                        return true;
                    }
                }
                """.formatted(inputs, expected);
    }

    private String toIntArraySource(List<Integer> values) {
        return "new int[] {%s}".formatted(values.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(", ")));
    }

    private Path javaExecutable() {
        String executable = System.getProperty("os.name", "").toLowerCase(Locale.ROOT).contains("win")
                ? "java.exe"
                : "java";
        return Path.of(System.getProperty("java.home"), "bin", executable);
    }

    private boolean hasErrors(DiagnosticCollector<JavaFileObject> diagnostics) {
        return diagnostics.getDiagnostics().stream().anyMatch(diagnostic -> diagnostic.getKind() == Diagnostic.Kind.ERROR);
    }

    private String formatDiagnostics(DiagnosticCollector<JavaFileObject> diagnostics) {
        String errors = diagnostics.getDiagnostics().stream()
                .filter(diagnostic -> diagnostic.getKind() == Diagnostic.Kind.ERROR)
                .limit(8)
                .map(diagnostic -> "Linha " + diagnostic.getLineNumber() + ": " + diagnostic.getMessage(Locale.ROOT))
                .collect(Collectors.joining("\n"));
        return errors.length() > 2_000 ? errors.substring(0, 2_000) : errors;
    }

    private void destroyProcessTree(Process process) {
        process.descendants().forEach(ProcessHandle::destroyForcibly);
        process.destroyForcibly();
    }

    private void deleteSandboxDirectory(Path directory) {
        if (directory == null || !Files.exists(directory)) {
            return;
        }
        try (Stream<Path> paths = Files.walk(directory)) {
            paths.sorted(Comparator.reverseOrder()).forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException exception) {
                    LOGGER.warn("Não foi possível remover um artefato temporário do sandbox: {}", path, exception);
                    path.toFile().deleteOnExit();
                }
            });
        } catch (IOException exception) {
            LOGGER.warn("Não foi possível percorrer o diretório temporário do sandbox: {}", directory, exception);
            directory.toFile().deleteOnExit();
        }
    }

    private static final class RestrictedCodeScanner extends TreeScanner<Void, Void> {
        private final ClassTree rootClass;

        private RestrictedCodeScanner(ClassTree rootClass) {
            this.rootClass = rootClass;
        }

        @Override
        public Void visitMethodInvocation(MethodInvocationTree node, Void unused) {
            throw new PolicyViolation("Chamadas de APIs ou de outros métodos não são permitidas.");
        }

        @Override
        public Void visitNewClass(NewClassTree node, Void unused) {
            throw new PolicyViolation("A criação de objetos não é permitida.");
        }

        @Override
        public Void visitLambdaExpression(LambdaExpressionTree node, Void unused) {
            throw new PolicyViolation("Expressões lambda não são permitidas.");
        }

        @Override
        public Void visitMemberReference(MemberReferenceTree node, Void unused) {
            throw new PolicyViolation("Referências de método não são permitidas.");
        }

        @Override
        public Void visitClass(ClassTree node, Void unused) {
            if (node != rootClass) {
                throw new PolicyViolation("Classes locais ou aninhadas não são permitidas.");
            }
            return super.visitClass(node, unused);
        }

        @Override
        public Void visitTry(TryTree node, Void unused) {
            throw new PolicyViolation("Blocos try não são permitidos.");
        }

        @Override
        public Void visitThrow(ThrowTree node, Void unused) {
            throw new PolicyViolation("Lançamento de exceções não é permitido.");
        }

        @Override
        public Void visitSynchronized(SynchronizedTree node, Void unused) {
            throw new PolicyViolation("Blocos synchronized não são permitidos.");
        }

        @Override
        public Void visitAnnotation(AnnotationTree node, Void unused) {
            throw new PolicyViolation("Anotações não são permitidas.");
        }
    }

    private static final class StringJavaFileObject extends SimpleJavaFileObject {
        private final String source;

        private StringJavaFileObject(String className, String source) {
            super(URI.create("string:///" + className + JavaFileObject.Kind.SOURCE.extension), JavaFileObject.Kind.SOURCE);
            this.source = source;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return source;
        }
    }

    private static final class PolicyViolation extends RuntimeException {
        private PolicyViolation(String message) {
            super(message);
        }
    }

    private enum ExerciseContract {
        SEARCH("public int search(int[] nums, int target)"),
        REVERSE("public int[] reverse(int[] nums)");

        private final String signature;

        ExerciseContract(String signature) {
            this.signature = signature;
        }

        private String signature() {
            return signature;
        }
    }

    public static final class SandboxException extends Exception {
        private final Reason reason;

        private SandboxException(Reason reason, String message, Throwable cause) {
            super(message, cause);
            this.reason = reason;
        }

        public Reason reason() {
            return reason;
        }

        private static SandboxException policy(String message) {
            return new SandboxException(Reason.POLICY, message, null);
        }

        private static SandboxException compilation(String message) {
            return new SandboxException(Reason.COMPILATION, message, null);
        }

        private static SandboxException timeout(String message) {
            return new SandboxException(Reason.TIMEOUT, message, null);
        }

        private static SandboxException runtime(String message) {
            return new SandboxException(Reason.RUNTIME, message, null);
        }

        private static SandboxException busy(String message) {
            return new SandboxException(Reason.BUSY, message, null);
        }

        private static SandboxException internal(String message, Throwable cause) {
            return new SandboxException(Reason.INTERNAL, message, cause);
        }
    }

    public enum Reason {
        POLICY,
        COMPILATION,
        TIMEOUT,
        RUNTIME,
        BUSY,
        INTERNAL
    }
}
