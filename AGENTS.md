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
- **O que foi feito:** O frontend em React foi integrado à API REST do backend via `axios`. O Módulo Visualizador agora consome o endpoint `GET /trace` gerenciando a renderização visual e controles de animação passo-a-passo através de uma máquina de estados baseada nos dados do backend. O Módulo de Exercícios (com `@monaco-editor`) conecta o botão de execução com `POST /verify`, renderizando respostas de teste formatadas no console. (Correção adicional feita no Frontend para resolver erros de sintaxe no ESLint causados por escapes literais).
- **Correção CI/CD (28/08/2026):** Corrigido workflow `.github/workflows/ci.yml`: adicionado `defaults.run.working-directory: ./backend` no job `backend-ci` para resolver `./mvnw: No such file or directory`. No frontend, instalado `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`, criado script `test` no `package.json`, adicionado `vitest.config.ts` e `src/test-setup.ts`, e configurado smoke test em `App.test.tsx`. Corrigidos imports `React` não utilizados em todos os componentes TSX (substituídos por `import type { FC } from 'react'` e `import { useState } from 'react'` separados) para compatibilidade com `verbatimModuleSyntax` e `noUnusedLocals` do tsconfig.
- **Próximos Passos:** Melhorar a compilação do Monaco Editor (para testar o código real via Sandbox se necessário), adicionar mais algoritmos à plataforma, ou configurar autenticação e banco de dados de usuários.
- **Decisões de Arquitetura:** Delegação total da lógica de passo (Visualizador) e validação (Exercícios) para o Backend, mantendo o frontend (React) responsável estritamente pela representação visual. Tratamento de exceções (Defensive UI) aplicado contra indisponibilidade do backend. Framework de testes frontend: Vitest com jsdom e React Testing Library.