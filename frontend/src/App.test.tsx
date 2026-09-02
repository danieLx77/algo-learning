import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('renders the algorithm catalog homepage', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /algoritmos deixam de ser abstratos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Busca Binária' })).toBeInTheDocument();
    expect(screen.getByText('Trilha disponível')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver biblioteca/i })).toHaveAttribute('href', '#algoritmos');
    expect(screen.getAllByText('Em breve')).toHaveLength(3);
  });

  it('navigates from the homepage to the binary search trail', async () => {
    render(<App />);
    document.documentElement.scrollTop = 320;

    fireEvent.click(screen.getByRole('link', { name: /começar agora/i }));

    expect(await screen.findByRole('heading', { name: /encontre a resposta/i })).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: /etapas de aprendizagem/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/algoritmos/busca-binaria');
    await waitFor(() => expect(document.documentElement.scrollTop).toBe(0));
  });

  it('opens the visualizer from the algorithm page call to action', async () => {
    window.history.pushState({}, '', '/algoritmos/busca-binaria');
    render(<App />);

    fireEvent.click(await screen.findByRole('button', { name: /explorar visualizador/i }));

    expect(screen.getByRole('heading', { name: /veja cada decisão/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /visualize/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard navigation between learning tabs', async () => {
    window.history.pushState({}, '', '/algoritmos/busca-binaria');
    render(<App />);
    const theoryTab = await screen.findByRole('tab', { name: /entenda/i });

    theoryTab.focus();
    fireEvent.keyDown(theoryTab, { key: 'ArrowRight' });

    expect(screen.getByRole('tab', { name: /visualize/i })).toHaveFocus();
    expect(screen.getByRole('tab', { name: /visualize/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates to the arrays learning trail', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: /arrays/i }));

    expect(await screen.findByRole('heading', { name: /cada posição guarda/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/algoritmos/arrays');
    expect(screen.getByRole('tablist', { name: /etapas de aprendizagem/i })).toBeInTheDocument();
  });

  it('runs an array operation in the visualizer', async () => {
    vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: [{ values: [4, 8, 15, 16, 23, 42], activeIndex: 2, shiftedIndices: [], description: 'Acesso direto ao índice 2: valor 15.', completed: true }],
    });
    window.history.pushState({}, '', '/algoritmos/arrays');
    render(<App />);

    fireEvent.click(await screen.findByRole('button', { name: /explorar operações/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Executar' }));

    expect(await screen.findByText(/acesso direto ao índice 2/i)).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/algorithms/arrays/trace',
      expect.objectContaining({ operation: 'ACCESS', index: 2 }),
    );
  });
});
