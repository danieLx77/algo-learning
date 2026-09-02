import type { FC } from 'react';
import { ArrowRight, Boxes, Check, Clock3, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CONTENT = `
## Como pensar em arrays

Um array guarda valores do **mesmo tipo** em posições contíguas. Cada posição tem um índice, começando em **zero**, que funciona como o endereço direto do valor.

### A intuição
Imagine uma fileira numerada de gavetas. Se você conhece o número da gaveta, abre exatamente aquela posição. Para inserir uma nova gaveta no meio, porém, precisa deslocar as seguintes.

### Quanto custa cada operação?

| Operação | Complexidade | Motivo |
| --- | --- | --- |
| Acessar por índice | **O(1)** | O endereço é calculado diretamente |
| Atualizar por índice | **O(1)** | Apenas uma posição muda |
| Percorrer | **O(n)** | Cada item precisa ser visitado |
| Inserir/remover no meio | **O(n)** | Outros itens precisam se deslocar |
`;

const RULES = [
  'Índices válidos vão de 0 até length - 1.',
  'O tamanho de um array Java é fixado na criação.',
  'A ordem dos elementos faz parte da estrutura.',
];

export const ArrayTheoryModule: FC = () => (
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
    <article className="violet-panel overflow-hidden rounded-[22px]">
      <div className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-5 sm:px-8">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.08] text-amber-300"><Lightbulb size={20} /></span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">Fundamentos</p>
          <p className="mt-1 text-sm text-zinc-500">Visualize memória, índices e custos antes de codificar.</p>
        </div>
      </div>
      <div className="prose prose-invert prose-zinc max-w-none px-6 py-7 prose-headings:tracking-tight prose-headings:text-white prose-h2:mb-4 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-lg prose-p:leading-7 prose-p:text-zinc-400 prose-strong:text-zinc-200 prose-table:text-sm prose-th:border-white/10 prose-th:text-zinc-300 prose-td:border-white/[0.06] prose-td:text-zinc-400 sm:px-8 sm:py-9">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{CONTENT}</ReactMarkdown>
      </div>
    </article>

    <aside className="flex flex-col gap-5">
      <div className="rounded-[22px] border border-violet-300/15 bg-gradient-to-b from-violet-500/[0.10] to-zinc-950/60 p-6">
        <div className="flex items-center justify-between">
          <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Boxes size={19} /></span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-violet-300/60">3 regras</span>
        </div>
        <h3 className="mt-5 text-lg font-semibold text-white">O contrato do array</h3>
        <ol className="mt-5 space-y-4">
          {RULES.map((rule, index) => (
            <li key={rule} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-violet-300/20 bg-violet-500/10 font-mono text-[10px] text-violet-300">{index + 1}</span>
              <p className="text-sm leading-6 text-slate-400">{rule}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.045] p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300"><Check size={14} /> Vantagem principal</p>
        <p className="mt-3 text-sm leading-6 text-emerald-100/60">Acesso previsível e imediato quando o índice é conhecido.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <Clock3 size={17} className="text-amber-300" />
        <p className="mt-3 text-sm font-medium text-white">Tamanho fixo, custo claro</p>
        <p className="mt-2 text-xs leading-5 text-zinc-600">Listas dinâmicas abstraem o redimensionamento; arrays deixam esse limite explícito.</p>
        <span className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-violet-300">Próximo: visualizar <ArrowRight size={12} /></span>
      </div>
    </aside>
  </div>
);
