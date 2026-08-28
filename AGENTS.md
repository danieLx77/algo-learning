# Memória e Contexto do Projeto

## ⚠️ PROTOCOLO DE EXECUÇÃO OBRIGATÓRIO (Em 3 Etapas)

Você NUNCA deve alterar código diretamente no primeiro turno. Siga estritamente este ciclo de vida para TODA tarefa:

1. **FASE 1: Planejamento (Obrigatório)**
   - Ative a skill `plan`.
   - Mapeie os arquivos afetados no Backend (Spring Boot) e Frontend (React).
   - Apresente um plano resumido (máximo 6 tópicos) e **PARE A EXECUÇÃO**, solicitando a confirmação do usuário antes de prosseguir.

2. **FASE 2: Execução Defensiva e Testes**
   - Após a confirmação do usuário, implemente o código aplicando as regras de `defensive-coding` e `security-audit`.
   - Escreva ou atualize os testes automatizados (JUnit/Mockito no backend, Vitest/React Testing Library no front).
   - Execute a skill `refactor` para garantir Clean Code e remoção de redundâncias.

3. **FASE 3: Finalização Automática (Commit + Memória)**
   - Assim que o código e os testes estiverem concluídos, execute **automaticamente**:
     1. Skill `commit` para gerar os commits no padrão Conventional Commits.
     2. Skill `session-memory` para atualizar a seção "Estado Atual & Memória" deste arquivo.
     3. Skill `session-doc` para gerar o log em `.session-logs/`.

---

## Autonomia de Execução
- Assim que o usuário aprovar o plano inicial (FASE 1), você possui permissão total para criar, editar, excluir arquivos e executar comandos de terminal necessários sem solicitar confirmação adicional para cada etapa intermediária.
- Execute todas as alterações sequencialmente até concluir a FASE 2 e a FASE 3.

## Ativação Automática de Skills
Você tem acesso às skills em `.agents/skills/`. Ative-as **automaticamente** de acordo com a etapa do fluxo acima ou contexto da tarefa:
- Ao planejar a tarefa: ative **`plan`**.
- Ao escrever ou modificar lógica de negócios/endpoints: ative **`defensive-coding`** e **`security-audit`**.
- Antes de entregar qualquer código finalizado: rode **`refactor`**.
- Ao finalizar a tarefa: execute **`commit`**, **`session-memory`** e **`session-doc`**.

---

## Diretrizes Gerais e Regras do Projeto
- **Diretrizes:** Mantenha respostas enxutas e focadas. Siga os padrões do projeto sem reescrever arquivos inteiros, apenas os trechos alterados.
- **Backend:** Java 17+ com Spring Boot 3 (Arquitetura em camadas: Controller, Service, Repository, DTOs imutáveis).
- **Frontend:** React com TypeScript e componentes funcionais.

---

## Estado Atual & Memória
- **O que foi feito:** Frontend React integrado à API REST do backend via `axios`. Módulo Visualizador consome `GET /trace` com animação passo-a-passo. Módulo de Exercícios conecta `POST /verify` com Monaco Editor.
- **Correção CI/CD (28/08/2026):** Adicionado `working-directory: ./backend` no workflow. Configurado Vitest + React Testing Library no frontend. Imports `React` corrigidos para `verbatimModuleSyntax`.
- **Melhoria de UI (28/08/2026):** Adicionado controle de velocidade (Lento/Médio/Rápido) no VisualizerModule com ícone `Gauge` e step indicator. ExerciseModule reorganizado: botão "Executar Testes" no header do editor, editor com `max-h-[40vh]`, output compacto com `max-h-[160px]`. Estilo visual clean minimalista: fundo `slate-950`, bordas `slate-800`, tabs com fundo semi-transparente, TheoryModule com borda sutil.
- **Próximos Passos:** Melhorar Monaco Editor (sandbox), adicionar mais algoritmos, ou configurar autenticação.
- **Decisões de Arquitetura:** Frontend = representação visual apenas. Backend = lógica de passo e validação. Vitest com jsdom para testes frontend.