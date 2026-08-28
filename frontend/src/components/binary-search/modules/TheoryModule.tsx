import type { FC } from 'react';
import { ArrowRight, Check, Lightbulb, Route, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownContent = `
## Como pensar em busca binária

A busca binária encontra um item em uma lista **ordenada** eliminando metade das possibilidades a cada comparação. Em vez de percorrer todos os valores, ela pergunta: *o alvo está antes ou depois do elemento central?*

### A intuição
Imagine procurar uma palavra em um dicionário. Você abre aproximadamente na metade, compara a palavra encontrada e decide qual metade ainda pode conter a resposta. O algoritmo repete exatamente esse raciocínio.

### Por que ela é tão eficiente?

| Cenário | Complexidade | O que acontece |
| --- | --- | --- |
| Melhor caso | **O(1)** | O alvo já está no meio |
| Caso médio | **O(log n)** | O intervalo é reduzido várias vezes |
| Pior caso | **O(log n)** | O alvo está no limite ou não existe |
`;

const SEARCH_STEPS = [
  'Observe o elemento central do intervalo.',
  'Compare esse valor com o alvo procurado.',
  'Descarte a metade que não pode conter a resposta.',
];

export const TheoryModule: FC = () => {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/65 shadow-xl shadow-black/10">
        <div className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-5 sm:px-8">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.08] text-amber-300">
            <Lightbulb size={20} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">Fundamentos</p>
            <p className="mt-1 text-sm text-slate-500">Construa o modelo mental antes de codificar.</p>
          </div>
        </div>

        <div className="prose prose-invert prose-slate max-w-none px-6 py-7 prose-headings:tracking-tight prose-headings:text-white prose-h2:mb-4 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-lg prose-p:leading-7 prose-p:text-slate-400 prose-strong:text-slate-200 prose-table:text-sm prose-th:border-white/10 prose-th:text-slate-300 prose-td:border-white/[0.06] prose-td:text-slate-400 sm:px-8 sm:py-9">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      </article>

      <aside className="flex flex-col gap-5">
        <div className="rounded-2xl border border-blue-400/15 bg-gradient-to-b from-blue-500/[0.10] to-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
              <Route size={19} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-300/60">3 movimentos</span>
          </div>

          <h3 className="mt-5 text-lg font-semibold text-white">O ciclo da busca</h3>
          <ol className="mt-5 space-y-4">
            {SEARCH_STEPS.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 font-mono text-[10px] text-blue-300">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-400">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.045] p-6">
          <div className="flex items-center gap-2 text-emerald-300">
            <Zap size={16} />
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">Regra de ouro</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            O array precisa estar <strong className="font-semibold text-white">ordenado</strong>. Sem isso, não é seguro eliminar nenhuma metade.
          </p>
          <div className="mt-5 flex items-center gap-2 border-t border-emerald-400/10 pt-4 text-xs text-emerald-200/70">
            <Check size={14} />
            Pronto para visualizar
            <ArrowRight size={13} className="ml-auto" />
          </div>
        </div>
      </aside>
    </div>
  );
};
