import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Binary,
  BookOpenCheck,
  Boxes,
  Braces,
  Code2,
  GitBranch,
  Layers3,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlgorithmLandscape } from '../components/layout/AlgorithmLandscape';
import { SiteHeader } from '../components/layout/SiteHeader';

interface UpcomingAlgorithm {
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
}

const UPCOMING_ALGORITHMS: UpcomingAlgorithm[] = [
  { title: 'Ordenação', category: 'Arrays', description: 'Compare Merge Sort e Quick Sort visualmente.', icon: Layers3 },
  { title: 'Estruturas de dados', category: 'Fundamentos', description: 'Pilhas, filas e árvores construídas passo a passo.', icon: Boxes },
  { title: 'Grafos', category: 'Caminhos', description: 'Percorra conexões com BFS, DFS e caminhos mínimos.', icon: GitBranch },
];

const LEARNING_FLOW = [
  { label: 'Entenda', detail: 'Teoria direta ao ponto', icon: BookOpenCheck, number: '01' },
  { label: 'Visualize', detail: 'Cada decisão em movimento', icon: PlayCircle, number: '02' },
  { label: 'Pratique', detail: 'Código validado na hora', icon: Code2, number: '03' },
];

export const HomePage: FC = () => {
  return (
    <div className="site-canvas">
      <div className="site-frame text-zinc-200">
        <SiteHeader
          action={(
            <a href="#algoritmos" className="primary-pill px-4 py-2 text-[11px]">
              Explorar <ArrowRight size={13} />
            </a>
          )}
        />

        <main className="relative z-10">
          <section className="mx-auto max-w-[1120px] px-4 pt-16 text-center sm:px-8 sm:pt-20">
            <div className="hero-kicker"><Sparkles size={12} /> Aprender pode ser visual</div>

            <h1 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.25rem]">
              Algoritmos deixam de ser abstratos quando você{' '}
              <span className="text-gradient">vê acontecer.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-pretty text-sm leading-6 text-zinc-500 sm:text-base">
              Entenda a lógica, acompanhe cada decisão e transforme conhecimento em código em uma experiência interativa.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/algoritmos/busca-binaria" className="primary-pill px-6 py-3 text-xs">
                Começar agora <ArrowRight size={14} />
              </Link>
              <a
                href="#algoritmos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-6 py-3 text-xs font-medium text-zinc-300 backdrop-blur transition hover:border-violet-300/20 hover:bg-violet-300/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-violet-300"
              >
                Ver biblioteca
              </a>
            </div>
          </section>

          <div className="mx-auto max-w-[1120px] px-2 sm:px-6">
            <AlgorithmLandscape />
          </div>

          <section id="algoritmos" className="scroll-mt-24 border-t border-white/[0.055] bg-black/15 py-20 sm:py-28">
            <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">Biblioteca interativa</p>
                  <h2 className="mt-4 text-3xl font-medium tracking-[-0.035em] text-white sm:text-5xl">Escolha o que aprender.</h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                    Uma trilha completa para sair da intuição e chegar ao código, no seu ritmo.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  Novos conteúdos em breve
                </span>
              </div>

              <div className="mt-11 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                <Link
                  to="/algoritmos/busca-binaria"
                  className="violet-panel group relative min-h-[350px] overflow-hidden rounded-[26px] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-300/25 sm:p-9"
                >
                  <div className="absolute -bottom-28 -right-20 size-80 rounded-full bg-violet-600/20 blur-3xl transition group-hover:bg-violet-500/25" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex size-12 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/10 text-violet-300"><Binary size={23} /></span>
                      <span className="rounded-full border border-violet-300/15 bg-violet-300/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-violet-200">Disponível</span>
                    </div>
                    <p className="mt-16 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/65">Busca · O(log n)</p>
                    <h3 className="mt-3 text-3xl font-medium tracking-tight text-white">Busca Binária</h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">Reduza o espaço de busca pela metade e encontre respostas com eficiência.</p>
                    <span className="mt-auto flex items-center gap-2 pt-8 text-xs font-semibold text-violet-200">
                      Abrir trilha <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {UPCOMING_ALGORITHMS.map((algorithm) => (
                    <article key={algorithm.title} className="group rounded-2xl border border-white/[0.055] bg-white/[0.018] p-5 transition hover:border-violet-300/10 hover:bg-violet-300/[0.025]">
                      <div className="flex items-center gap-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-zinc-600 transition group-hover:text-violet-300"><algorithm.icon size={18} /></span>
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-700">{algorithm.category}</p>
                          <h3 className="mt-1 text-sm font-medium text-zinc-300">{algorithm.title}</h3>
                        </div>
                        <span className="ml-auto text-[8px] uppercase tracking-wider text-zinc-700">Em breve</span>
                      </div>
                      <p className="mt-4 text-xs leading-5 text-zinc-600">{algorithm.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="metodo" className="scroll-mt-24 border-t border-white/[0.055] py-20 sm:py-28">
            <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-violet-300/15 bg-violet-400/[0.07] text-violet-300"><Braces size={18} /></span>
                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">Uma jornada, três movimentos</p>
                <h2 className="mt-4 text-3xl font-medium tracking-[-0.035em] text-white sm:text-5xl">Mais clareza. Menos decoreba.</h2>
              </div>

              <div className="mt-12 grid gap-3 md:grid-cols-3">
                {LEARNING_FLOW.map((step) => (
                  <article key={step.label} className="rounded-[22px] border border-white/[0.055] bg-white/[0.02] p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.06] text-violet-300"><step.icon size={17} /></span>
                      <span className="font-mono text-[10px] text-zinc-700">{step.number}</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white">{step.label}</h3>
                    <p className="mt-2 text-xs leading-5 text-zinc-600">{step.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-white/[0.055]">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 py-8 text-[11px] text-zinc-700 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>Algoritmos para entender, visualizar e praticar.</p>
            <p className="font-mono">AlgoLearning · Java + React</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
