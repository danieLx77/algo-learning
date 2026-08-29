import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Binary,
  BookOpenCheck,
  Boxes,
  Braces,
  CheckCircle2,
  Code2,
  GitBranch,
  Layers3,
  PlayCircle,
  Search,
  Sparkles,
  Timer,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';

interface UpcomingAlgorithm {
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
}

const UPCOMING_ALGORITHMS: UpcomingAlgorithm[] = [
  {
    title: 'Ordenação',
    category: 'Arrays',
    description: 'Compare estratégias como Merge Sort e Quick Sort visualmente.',
    icon: Layers3,
  },
  {
    title: 'Estruturas de dados',
    category: 'Fundamentos',
    description: 'Pilhas, filas e árvores construídas passo a passo.',
    icon: Boxes,
  },
  {
    title: 'Grafos',
    category: 'Caminhos',
    description: 'Percorra conexões com BFS, DFS e caminhos mínimos.',
    icon: GitBranch,
  },
];

const LEARNING_FLOW = [
  { label: 'Entenda', detail: 'Teoria direta ao ponto', icon: BookOpenCheck },
  { label: 'Visualize', detail: 'Cada decisão em movimento', icon: PlayCircle },
  { label: 'Pratique', detail: 'Código validado na hora', icon: Code2 },
];

export const HomePage: FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(59,130,246,0.15),transparent_25%),radial-gradient(circle_at_80%_16%,rgba(139,92,246,0.11),transparent_24%)]" />
      <div className="page-grid pointer-events-none absolute inset-x-0 top-0 h-[850px] opacity-40" />

      <SiteHeader
        action={(
          <a
            href="#algoritmos"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            Explorar catálogo
            <ArrowRight size={14} />
          </a>
        )}
      />

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.06fr_0.94fr] lg:gap-20 lg:pb-32">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
              <Sparkles size={14} />
              Aprender pode ser visual
            </div>

            <h1 className="text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.35rem]">
              Algoritmos deixam de ser abstratos quando você{' '}
              <span className="text-gradient">vê acontecer.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-400 sm:text-xl">
              Entenda a lógica, acompanhe cada passo e transforme conhecimento em código com experiências interativas feitas para quem está aprendendo.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#algoritmos"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                Escolher um algoritmo
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/algoritmos/busca-binaria"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                <PlayCircle size={17} className="text-blue-400" />
                Começar agora
              </Link>
            </div>

            <div className="mt-11 flex flex-wrap gap-x-9 gap-y-4 border-t border-white/8 pt-7">
              <div>
                <p className="font-mono text-xl font-semibold text-white">01</p>
                <p className="mt-1 text-xs text-slate-500">Algoritmo disponível</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold text-white">3 formas</p>
                <p className="mt-1 text-xs text-slate-500">Entender, ver e praticar</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xl font-semibold text-white">
                  <CheckCircle2 size={19} className="text-emerald-400" /> Java
                </p>
                <p className="mt-1 text-xs text-slate-500">Executor protegido</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute -inset-10 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/10 bg-slate-900/75 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="rounded-[22px] border border-white/[0.06] bg-[#090f1c] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Seu mapa de aprendizado</p>
                    <p className="mt-2 text-lg font-semibold text-white">Do conceito ao código</p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-300">
                    <Braces size={20} />
                  </span>
                </div>

                <div className="relative mt-8 space-y-3">
                  <div className="absolute bottom-8 left-5 top-8 w-px bg-gradient-to-b from-blue-400 via-violet-400/50 to-transparent" />
                  {LEARNING_FLOW.map((step, index) => (
                    <div key={step.label} className="relative flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                      <span className={`z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                        index === 0
                          ? 'border-blue-400/30 bg-blue-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.3)]'
                          : 'border-white/[0.08] bg-[#0d1422] text-slate-500'
                      }`}>
                        <step.icon size={17} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{step.label}</p>
                        <p className="mt-1 text-xs text-slate-600">{step.detail}</p>
                      </div>
                      <span className="ml-auto font-mono text-[10px] text-slate-700">0{index + 1}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-4 py-3">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  <p className="text-xs text-emerald-200/75">Aprenda no seu ritmo, direto no navegador</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="algoritmos" className="scroll-mt-24 border-t border-white/[0.06] bg-[#070b13]/75 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Biblioteca interativa</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Escolha o que aprender.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Cada trilha combina explicação, visualização e exercício prático em uma experiência completa.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-slate-500">
                <Zap size={13} className="text-amber-300" /> Novos conteúdos em breve
              </span>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <Link
                to="/algoritmos/busca-binaria"
                className="group relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/[0.13] via-slate-900/70 to-violet-500/[0.08] p-6 transition hover:-translate-y-1 hover:border-blue-400/35 hover:shadow-2xl hover:shadow-blue-950/30 sm:p-7"
              >
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-blue-500/15" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/15 text-blue-300">
                      <Binary size={23} />
                    </span>
                    <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Disponível</span>
                  </div>
                  <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">Busca · O(log n)</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Busca Binária</h3>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
                    Aprenda a reduzir o espaço de busca pela metade e encontre respostas com eficiência.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-blue-300">
                    Abrir trilha
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {UPCOMING_ALGORITHMS.map((algorithm) => (
                  <article key={algorithm.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
                        <algorithm.icon size={18} />
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-700">Em breve</span>
                    </div>
                    <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">{algorithm.category}</p>
                    <h3 className="mt-2 text-sm font-semibold text-slate-300">{algorithm.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{algorithm.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="flex size-11 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.07] text-amber-300">
                <Search size={20} />
              </span>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">Mais clareza. Menos decoreba.</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
                Cada módulo foi pensado para conectar intuição e implementação, com feedback imediato durante a prática.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: 'Visual', label: 'Estados e decisões visíveis', icon: PlayCircle },
                { value: 'Prático', label: 'Editor Java integrado', icon: Braces },
                { value: 'Seguro', label: 'Execução com limites', icon: Timer },
              ].map((feature) => (
                <div key={feature.value} className="rounded-2xl border border-white/[0.06] bg-slate-900/55 p-5">
                  <feature.icon size={17} className="text-blue-300" />
                  <p className="mt-6 text-sm font-semibold text-white">{feature.value}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{feature.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-[#070b13]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Algoritmos para entender, visualizar e praticar.</p>
          <p className="font-mono">AlgoLearning · Java + React</p>
        </div>
      </footer>
    </div>
  );
};
