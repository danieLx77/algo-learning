import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

const BinarySearchPage = lazy(async () => {
  const module = await import('./pages/BinarySearchPage');
  return { default: module.BinarySearchPage };
});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={(
          <div className="flex min-h-screen items-center justify-center bg-[#08080b] text-sm text-zinc-500">
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
