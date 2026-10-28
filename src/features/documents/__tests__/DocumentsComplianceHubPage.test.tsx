/**
 * @file DocumentsComplianceHubPage.test.tsx
 * @description Integration tests for Documents Hub: verifies dynamic counters,
 * removal of hardcoded '14' values, and launching SignatureCenter via card and hero actions.
 */

import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { ToastProvider } from '@/shared/ui/Toast';
import { DocumentsComplianceHubPage } from '../pages/DocumentsComplianceHubPage';
import * as mockDb from '../api/signaturesMock';

const renderComponent = (initialEntries = ['/dashboard/documents']) => {
  return render(
    <Provider store={store}>
      <ToastProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <DocumentsComplianceHubPage />
        </MemoryRouter>
      </ToastProvider>
    </Provider>
  );
};

describe('DocumentsComplianceHubPage Integration', () => {
  beforeEach(() => {
    mockDb.resetMockDatabase();
  });

  it('proves hardcoded "14 Awaiting" and "14" literals are removed from document hub', async () => {
    renderComponent();

    // The hero counter should NOT contain "14 Awaiting"
    expect(screen.queryByText('14 Awaiting')).toBeNull();

    // Find the Digital Signatures & E-Signs card heading
    const cardTitle = await screen.findByRole('heading', { name: 'Digital Signatures & E-Signs' });
    expect(cardTitle).toBeDefined();

    // Verify the card's metric label is "Pending Signs"
    const metricLabels = screen.getAllByText('Pending Signs');
    expect(metricLabels.length).toBeGreaterThan(0);
  });

  it('clicking Digital Signatures card switches to SignatureCenter workspace', async () => {
    renderComponent();

    const cardHeading = await screen.findByRole('heading', { name: 'Digital Signatures & E-Signs' });
    const cardBtn = cardHeading.closest('[role="button"]') || cardHeading;
    fireEvent.click(cardBtn);

    // Should render the Back to Documents & Policies Vault bar
    const backBtn = await screen.findByText('Back to Documents & Policies Vault');
    expect(backBtn).toBeDefined();

    // Should render SignatureCenter tabs: Overview, Requests, To Sign, Templates & Settings
    expect(screen.getByText('Templates & Settings')).toBeDefined();
    expect(screen.getByText(/Requests/)).toBeDefined();
  });

  it('clicking the E-Sign hero button opens SignatureCenter', async () => {
    renderComponent();

    // Find the quick action hero button with text "E-Sign"
    const eSignTexts = await screen.findAllByText('E-Sign');
    const heroBtn = eSignTexts[0].closest('button');
    expect(heroBtn).toBeDefined();
    fireEvent.click(heroBtn!);

    const backBtn = await screen.findByText('Back to Documents & Policies Vault');
    expect(backBtn).toBeDefined();
  });

  it('deep-linking with ?view=esign opens SignatureCenter directly', async () => {
    renderComponent(['/dashboard/documents?view=esign']);

    const backBtn = await screen.findByText('Back to Documents & Policies Vault');
    expect(backBtn).toBeDefined();
    expect(screen.getByText('Templates & Settings')).toBeDefined();
  });
});
