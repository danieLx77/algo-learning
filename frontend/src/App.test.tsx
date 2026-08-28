import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the learning homepage and its journey', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /encontre a resposta/i })).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: /etapas de aprendizagem/i })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: /entenda/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('opens the visualizer from the homepage call to action', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /explorar visualizador/i }));

    expect(screen.getByRole('heading', { name: /veja cada decisão/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /visualize/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard navigation between learning tabs', () => {
    render(<App />);
    const theoryTab = screen.getByRole('tab', { name: /entenda/i });

    theoryTab.focus();
    fireEvent.keyDown(theoryTab, { key: 'ArrowRight' });

    expect(screen.getByRole('tab', { name: /visualize/i })).toHaveFocus();
    expect(screen.getByRole('tab', { name: /visualize/i })).toHaveAttribute('aria-selected', 'true');
  });
});
