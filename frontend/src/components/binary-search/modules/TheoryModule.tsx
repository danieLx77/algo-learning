import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownContent = `
# Busca Binária

A **Busca Binária** é um algoritmo eficiente para encontrar um item em uma lista **ordenada**. Ele funciona dividindo repetidamente pela metade a parte da lista que pode conter o item, até reduzir as possibilidades a apenas uma.

## Intuição
Imagine procurar uma palavra num dicionário. Você não lê página por página; você abre na metade e decide se a palavra está na primeira ou segunda metade, repetindo o processo.

## Complexidade de Tempo (Big O)
- **Melhor caso:** $O(1)$ (O elemento é o do meio logo na primeira tentativa)
- **Pior caso:** $O(log n)$ (O elemento não está na lista ou precisa de todas as divisões)
- **Caso médio:** $O(log n)$

## Requisitos
O array **deve** estar previamente ordenado.
`;

export const TheoryModule: FC = () => {
  return (
    <div className="prose prose-invert prose-slate max-w-none bg-slate-900 border border-slate-800 p-8 rounded-xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};
