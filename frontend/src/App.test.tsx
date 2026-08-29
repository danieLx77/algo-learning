import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders the algorithm catalog homepage', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /algoritmos deixam de ser abstratos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Busca Binária' })).toBeInTheDocument();
    expect(screen.getAllByText('Em breve')).toHaveLength(3);
  });

  it('navigates from the homepage to the binary search trail', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: /começar agora/i }));

    expect(await screen.findByRole('heading', { name: /encontre a resposta/i })).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: /etapas de aprendizagem/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/algoritmos/busca-binaria');
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
});
