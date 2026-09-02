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
- **O que foi feito:** Frontend React integrado à API REST via `axios`; trilhas seguem o fluxo Entenda, Visualize e Pratique com Monaco Editor.
- **Correção CI/CD (28/08/2026):** Adicionado `working-directory: ./backend` no workflow. Configurado Vitest + React Testing Library no frontend. Imports `React` corrigidos para `verbatimModuleSyntax`.
- **Homepage e catálogo (28/08/2026):** `/` agora apresenta a plataforma e o catálogo escalável. Busca Binária foi movida para `/algoritmos/busca-binaria`; React Router e lazy loading evitam carregar Monaco na home.
- **Redesign visual (29/08/2026):** Homepage e trilha ocupam toda a viewport em preto, com relevo violeta em CSS, navegação suspensa, cartões translúcidos e tipografia editorial. Módulos seguem o mesmo design system.
- **Trilha Arrays (02/09/2026):** `/algoritmos/arrays` ensina índices e complexidades, visualiza acesso/atualização/inserção/remoção/percurso e propõe inversão de array em Java.
- **Acessibilidade e UX:** Abas usam semântica ARIA e navegação por setas/Home/End. Rotas retornam ao topo; layout validado em desktop e mobile sem overflow ou erros no console.
- **Sandbox Java:** Executor compartilhado valida contratos `Solution.search` e `Solution.reverse`, bloqueia APIs/imports/reflexão e executa apenas em JVM filha.
- **Segurança:** Annotation processing desativado, módulos limitados a `java.base`, ambiente limpo e processo destruído em timeout. DOMPurify fixado em 3.4.14; `npm audit` sem vulnerabilidades.
- **Contratos da API:** Arrays expõe `POST /api/v1/algorithms/arrays/trace` e `/verify`; erros semânticos retornam Problem Details com HTTP 400.
- **Documentação local (29/08/2026):** `.session-logs/` foi removida do versionamento e ignorada integralmente; os registros de sessão permanecem somente no ambiente local.
- **Testes atuais:** Frontend com 6 testes Vitest/RTL, lint e build verdes. Backend com 32 testes JUnit, incluindo operações de Arrays e casos ofensivos do sandbox.
- **Próximos Passos:** Adicionar novos algoritmos ao catálogo e, antes de publicar, configurar autenticação e rate limiting por identidade.
- **Decisões de Arquitetura:** Abas e sandbox são compartilhados entre trilhas; DTOs são imutáveis e a execução de código nunca ocorre no processo Spring.
