import { useState } from 'react';
import type { FC } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Play } from 'lucide-react';

interface ExerciseResult {
  passed: boolean;
  executionTimeMs: number;
  message: string;
}

export const ExerciseModule: FC = () => {
  const defaultCode = `class Solution {
    public int search(int[] nums, int target) {
        // Implemente sua busca binária aqui

        return -1;
    }
}`;

  const [code, setCode] = useState<string>(defaultCode);
  const [output, setOutput] = useState<string>('> Pronto para executar...');
  const [loading, setLoading] = useState(false);

  const handleRunTests = async () => {
    setLoading(true);
    setOutput('> Executando testes na nuvem...');

    try {
      const payload = {
        array: [-1, 0, 3, 5, 9, 12],
        target: 9,
        code
      };

      const response = await axios.post<ExerciseResult>(
        'http://localhost:8080/api/v1/algorithms/binary-search/verify',
        payload
      );

      const result = response.data;
      if (result.passed) {
        setOutput(`> ${result.message}\n> Tempo de execução: ${result.executionTimeMs}ms\n> Status: APROVADO`);
      } else {
        setOutput(`> ${result.message}\n> Tempo de execução: ${result.executionTimeMs}ms\n> Status: REPROVADO`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setOutput(`> Erro de conexão com o servidor: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">Exercício: Busca Binária Clássica</h2>
        <div className="prose prose-invert prose-slate prose-sm flex-grow">
          <p>
            Dado um array de inteiros <code>nums</code> ordenado em ordem crescente,
            e um inteiro <code>target</code>, escreva uma função para pesquisar <code>target</code> em <code>nums</code>.
          </p>
          <p>
            Se o alvo existir, retorne seu índice. Caso contrário, retorne <code>-1</code>.
          </p>
          <p>
            <strong>Restrição:</strong> Você deve escrever um algoritmo com complexidade de tempo de <code>O(log n)</code>.
          </p>

          <h3>Exemplo 1:</h3>
          <pre className="bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm">
            Input: nums = [-1,0,3,5,9,12], target = 9{'\n'}
            Output: 4
          </pre>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2 border-b border-slate-800">
            <span className="text-sm font-medium text-slate-400">Solution.java</span>
            <button
              onClick={handleRunTests}
              disabled={loading}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Play size={12} />
              {loading ? 'Executando...' : 'Executar Testes'}
            </button>
          </div>
          <div className="h-[40vh]">
            <Editor
              height="100%"
              defaultLanguage="java"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
              }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-800">
            <span className="text-sm font-medium text-slate-400">Output</span>
          </div>
          <div className="font-mono text-sm text-slate-400 p-4 max-h-[160px] overflow-y-auto whitespace-pre-wrap">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
};
