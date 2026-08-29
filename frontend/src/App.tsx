import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

const BinarySearchPage = lazy(async () => {
  const module = await import('./pages/BinarySearchPage');
  return { default: module.BinarySearchPage };
});

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={(
          <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-500">
            Carregando experiência...
          </div>
        )}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/algoritmos/busca-binaria" element={<BinarySearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
