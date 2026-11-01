import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  PageHeader,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Slider,
} from '..';

describe('shared UI primitives', () => {
  it('opens an accessible Dialog, closes on Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open job editor</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit job</DialogTitle>
            <DialogDescription>Update the job details.</DialogDescription>
          </DialogHeader>
          <button type="button">Save</button>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Open job editor' });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Edit job' });
    expect(dialog).toHaveAttribute('aria-describedby');
    expect(screen.getByText('Update the job details.')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('opens a Sheet with its selected side and accessible title', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open filters</SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>Recruitment filters</SheetTitle>
          <p>Choose a job status.</p>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByRole('button', { name: 'Open filters' }));
    const sheet = await screen.findByRole('dialog', { name: 'Recruitment filters' });
    expect(sheet.className).toContain('left-0');
  });

  it('exposes determinate and indeterminate Progress semantics', () => {
    const { rerender } = render(<Progress value={42} label="Application completion" />);
    const progress = screen.getByRole('progressbar', { name: 'Application completion' });
    expect(progress).toHaveAttribute('aria-valuenow', '42');
    expect(progress.firstElementChild).toHaveStyle({ width: '42%' });

    rerender(<Progress value={null} label="Loading candidates" />);
    expect(screen.getByRole('progressbar', { name: 'Loading candidates' })).not.toHaveAttribute('aria-valuenow');
  });

  it('supports a labelled Checkbox and calls onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Publish this job</Checkbox>);

    const checkbox = screen.getByRole('checkbox', { name: 'Publish this job' });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('keeps Slider keyboard-operable and reports the changed number', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider aria-label="Minimum salary" min={0} max={10} defaultValue={4} onValueChange={onValueChange} />);

    const slider = screen.getByRole('slider', { name: 'Minimum salary' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveValue('5');
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it('supports selection and change notification in RadioGroup', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Job status" defaultValue="draft" onValueChange={onValueChange}>
        <RadioGroupItem value="draft">Draft</RadioGroupItem>
        <RadioGroupItem value="published">Published</RadioGroupItem>
      </RadioGroup>,
    );

    const published = screen.getByRole('radio', { name: 'Published' });
    await user.click(published);
    expect(published).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('published');
  });

  it('renders PageHeader heading, description, and actions', () => {
    render(
      <PageHeader
        eyebrow="Talent"
        title="Open roles"
        description="Manage hiring activity across teams."
        actions={<button type="button">Create job</button>}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Open roles' })).toBeInTheDocument();
    expect(screen.getByText('Manage hiring activity across teams.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create job' })).toBeInTheDocument();
  });

  it('retains the compound Select API and exports its optional parts', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose department" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Teams</SelectLabel>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectSeparator />
            <SelectItem value="design">Design</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Engineering' }));
    expect(onValueChange).toHaveBeenCalledWith('engineering');
    expect(screen.getByRole('combobox')).toHaveTextContent('Engineering');
  });
});
