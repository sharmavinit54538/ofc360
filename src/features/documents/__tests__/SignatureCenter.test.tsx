/**
 * @file SignatureCenter.test.tsx
 * @description Integration tests for SignatureCenter workspace: KPI cards, tab switching,
 * requests filter table, attention list, and settings tab.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { ToastProvider } from '@/shared/ui/Toast';
import { SignatureCenter } from '../components/SignatureCenter';
import * as mockDb from '../api/signaturesMock';

const renderSignatureCenter = (props = { onBackToVault: vi.fn() }) => {
  return render(
    <Provider store={store}>
      <ToastProvider>
        <MemoryRouter>
          <SignatureCenter {...props} />
        </MemoryRouter>
      </ToastProvider>
    </Provider>
  );
};

describe('SignatureCenter Workspace Integration', () => {
  beforeEach(() => {
    mockDb.resetMockDatabase();
  });

  it('renders overview header and KPI metric cards', async () => {
    renderSignatureCenter();

    expect(screen.getByText('Back to Documents & Policies Vault')).toBeDefined();
    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Awaiting My Signature')).toBeDefined();
    expect(screen.getByText('Waiting on Others')).toBeDefined();
    expect(screen.getByText('Completed (Last 30d)')).toBeDefined();
    expect(screen.getByText('Needs Attention (0)')).toBeDefined();
    expect(screen.getByText('Quick-Start Workflows')).toBeDefined();
  });

  it('switches between tabs: Overview, Requests, To Sign, Templates & Settings', async () => {
    renderSignatureCenter();

    // Switch to Requests tab
    const requestsTab = screen.getByText(/Requests \(/i);
    fireEvent.click(requestsTab);

    // Requests table filter bar
    expect(await screen.findByPlaceholderText(/Search reference, title/i)).toBeDefined();
    expect(screen.getByText('All Statuses')).toBeDefined();
    expect(screen.getByText('All Document Types')).toBeDefined();

    // Switch to To Sign tab
    const toSignTab = screen.getByText(/To Sign/i);
    fireEvent.click(toSignTab);
    expect(await screen.findByText(/Documents awaiting your electronic signature/i)).toBeDefined();

    // Switch to Templates & Settings tab
    const settingsTab = screen.getByText('Templates & Settings');
    fireEvent.click(settingsTab);
    expect(await screen.findByText('Digital Signatures & E-Sign Configuration')).toBeDefined();
    expect(screen.getByText('Provider Adapter')).toBeDefined();
    expect(screen.getByText('Default Validity Duration')).toBeDefined();
  });

  it('triggers onBackToVault callback when clicking back button', () => {
    const onBack = vi.fn();
    renderSignatureCenter({ onBackToVault: onBack });

    const backBtn = screen.getByText('Back to Documents & Policies Vault');
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();
  });
});
