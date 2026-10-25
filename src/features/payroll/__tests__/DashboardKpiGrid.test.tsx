import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardKpiGrid } from '../components/DashboardKpiGrid';

describe('DashboardKpiGrid Component (Minimal Mode)', () => {
  it('renders all 8 payroll module launcher cards with titles', () => {
    render(<DashboardKpiGrid activeId="overview" />);

    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Payroll Batches & Lifecycle')).toBeDefined();
    expect(screen.getByText('Payslips')).toBeDefined();
    expect(screen.getByText('Salary Structures (CTC)')).toBeDefined();
    expect(screen.getByText('Pay Components Catalog')).toBeDefined();
    expect(screen.getByText('Statutory Engine')).toBeDefined();
    expect(screen.getByText('EPFO PF & ECR Compliance')).toBeDefined();
    expect(screen.getByText('Tax Declarations')).toBeDefined();
  });

  it('keeps cards minimal by omitting verbose descriptions and CTA rows', () => {
    render(<DashboardKpiGrid activeId="overview" />);

    // Extra verbose descriptions and CTA texts should be omitted from cards
    expect(screen.queryByText('Open Payroll Overview')).toBeNull();
    expect(screen.queryByText('Review Tax Proofs')).toBeNull();
    expect(screen.queryByText('Consolidated payroll analytics, ₹42.5L net payout tracking')).toBeNull();
  });

  it('triggers onSelect with card id when clicked', () => {
    const handleSelect = vi.fn();
    render(<DashboardKpiGrid activeId="overview" onSelect={handleSelect} />);

    const taxCard = screen.getByText('Tax Declarations');
    fireEvent.click(taxCard);

    expect(handleSelect).toHaveBeenCalledWith('tax');
  });

  it('marks active card with aria-selected true', () => {
    render(<DashboardKpiGrid activeId="structures" />);

    const card = screen.getByRole('button', { name: /Salary Structures/i });
    expect(card.getAttribute('aria-selected')).toBe('true');
  });
});
