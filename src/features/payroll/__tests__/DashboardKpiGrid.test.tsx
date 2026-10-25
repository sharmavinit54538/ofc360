import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardKpiGrid } from '../components/DashboardKpiGrid';
import { DASHBOARD_LAUNCHER_CARDS } from '../components/dashboardKpiCards.data';

describe('DashboardKpiGrid Component', () => {
  it('renders all 8 payroll module launcher cards', () => {
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

  it('displays badges, capability tags, and CTA actions for modules', () => {
    render(<DashboardKpiGrid activeId="overview" />);

    expect(screen.getByText('LIVE CYCLE')).toBeDefined();
    expect(screen.getByText('100% DISBURSED')).toBeDefined();
    expect(screen.getByText('₹42.5L Payout')).toBeDefined();
    expect(screen.getByText('All Grades Mapped')).toBeDefined();
    expect(screen.getByText('Open Payroll Overview')).toBeDefined();
    expect(screen.getByText('Review Tax Proofs')).toBeDefined();
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

