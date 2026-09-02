import { useState } from 'react';
import type { FC } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Braces, CheckCircle2, Clock3, Code2, LoaderCircle, Play, Terminal, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ExerciseResult {
  passed: boolean;
  executionTimeMs: number;
  message: string;
}

type ExecutionStatus = 'idle' | 'running' | 'passed' | 'failed' | 'error';

const DEFAULT_CODE = `class Solution {
    public int[] reverse(int[] nums) {
        // Inverta o array sem usar APIs prontas

        return nums;
    }
}`;

const STATUS_DISPLAY: Record<ExecutionStatus, { label: string; className: string; icon?: LucideIcon }> = {
  idle: { label: 'Aguardando', className: 'text-slate-600' },
  running: { label: 'Processando', className: 'text-amber-300', icon: LoaderCircle },
  passed: { label: 'Aprovado', className: 'text-emerald-300', icon: CheckCircle2 },
  failed: { label: 'Reprovado', className: 'text-rose-300', icon: XCircle },
  error: { label: 'Erro', className: 'text-rose-300', icon: XCircle },
};

export const ArrayExerciseModule: FC = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('> Pronto para executar...');
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [loading, setLoading] = useState(false);
  const statusDisplay = STATUS_DISPLAY[status];
  const StatusIcon = statusDisplay.icon;

  const runTests = async () => {
    setLoading(true);
    setStatus('running');
    setOutput('> Executando casos de teste em ambiente isolado...');
    try {
      const response = await axios.post<ExerciseResult>('http://localhost:8080/api/v1/algorithms/arrays/verify', { code });
      const result = response.data;
      setStatus(result.passed ? 'passed' : 'failed');
      setOutput(`> ${result.message}\n> Tempo de execução: ${result.executionTimeMs}ms\n> Status: ${result.passed ? 'APROVADO' : 'REPROVADO'}`);
    } catch {
      setStatus('error');
      setOutput('> Não foi possível executar os testes. Verifique a conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
      <section className="violet-panel overflow-hidden rounded-[22px]">
        <div className="border-b border-white/[0.06] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-300"><Braces size={20} /></span>
            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Nível inicial</span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300/80">Desafio 01</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Inverta um array</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Receba um <code className="rounded bg-white/[0.05] px-1.5 py-1 font-mono text-xs text-blue-300">int[] nums</code> e retorne seus valores na ordem inversa. Faça as trocas manualmente, sem APIs prontas.
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-7">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"><Clock3 size={16} className="text-amber-300" /><p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-slate-600">Meta</p><p className="mt-1 font-mono text-sm font-semibold text-white">O(n)</p></div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"><Code2 size={16} className="text-blue-300" /><p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-slate-600">Linguagem</p><p className="mt-1 font-mono text-sm font-semibold text-white">Java</p></div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Exemplo</p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06] bg-[#09090d] p-4 font-mono text-xs leading-6">
              <p><span className="text-slate-600">entrada</span> <span className="text-slate-500">=</span> <span className="text-blue-300">[1, 2, 3, 4, 5]</span></p>
              <p className="mt-2 border-t border-white/[0.05] pt-2"><span className="text-slate-600">saída</span> <span className="text-slate-500">=</span> <span className="text-emerald-300">[5, 4, 3, 2, 1]</span></p>
            </div>
          </div>
          <p className="flex items-start gap-2.5 rounded-xl border border-blue-400/10 bg-blue-400/[0.045] p-4 text-xs leading-5 text-blue-200/70"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-blue-300" />Mantenha a assinatura do método. Sua solução será validada com arrays ímpares, pares e unitários.</p>
        </div>
      </section>

      <section className="flex min-w-0 flex-col gap-4">
        <div className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#09090d] shadow-xl shadow-black/10">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.025] px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3"><div className="flex gap-1.5"><span className="size-2 rounded-full bg-rose-400/60" /><span className="size-2 rounded-full bg-amber-400/60" /><span className="size-2 rounded-full bg-emerald-400/60" /></div><span className="truncate font-mono text-[11px] text-slate-500">Solution.java</span></div>
            <button type="button" onClick={() => { void runTests(); }} disabled={loading} className="flex shrink-0 items-center gap-2 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-emerald-400"><Play size={12} fill="currentColor" />{loading ? 'Executando...' : 'Executar testes'}</button>
          </div>
          <div className="h-[420px] min-h-[320px] max-h-[55vh]">
            <Editor height="100%" defaultLanguage="java" theme="vs-dark" value={code} onChange={(value) => setCode(value ?? '')} options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace", padding: { top: 20 }, scrollBeyondLastLine: false, overviewRulerLanes: 0, hideCursorInOverviewRuler: true, overviewRulerBorder: false }} />
          </div>
        </div>
        <div className="violet-panel overflow-hidden rounded-[22px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5"><span className="flex items-center gap-2 text-xs font-medium text-slate-400"><Terminal size={14} /> Console</span><span className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusDisplay.className}`}>{StatusIcon && <StatusIcon size={12} className={status === 'running' ? 'animate-spin' : undefined} />}{statusDisplay.label}</span></div>
          <div className="max-h-[160px] min-h-24 overflow-y-auto whitespace-pre-wrap p-4 font-mono text-xs leading-6 text-slate-400 sm:px-5" aria-live="polite">{output}</div>
        </div>
      </section>
    </div>
  );
};
