import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Plus,
  Trash2,
  UploadCloud,
  FileText,
  DollarSign,
  Calendar,
  Building,
  CheckCircle2,
  Receipt,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useCreateExpenseClaimMutation, useUploadReceiptMutation } from '../api/expensesApi';
import { createExpenseClaimSchema, type CreateExpenseClaimFormData } from '../schemas/expenses.schemas';
import type { ExpenseCategory } from '../types/expenses.types';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [createClaim, { isLoading: isSubmitting }] = useCreateExpenseClaimMutation();
  const [uploadReceipt, { isLoading: isUploadingFile }] = useUploadReceiptMutation();

  const [uploadedReceipts, setUploadedReceipts] = useState<
    { name: string; url: string; size?: number }[]
  >([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateExpenseClaimFormData>({
    resolver: zodResolver(createExpenseClaimSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'TRAVEL',
      currency: 'USD',
      items: [
        {
          date: new Date().toISOString().split('T')[0],
          merchant: '',
          category: 'TRAVEL',
          description: '',
          amount: 0,
          taxAmount: 0,
        },
      ],
      receiptUrls: [],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchItems = watch('items') || [];
  const selectedCurrency = watch('currency') || 'USD';

  // Live Calculations
  const totalAmount = watchItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const totalTax = watchItems.reduce((acc, item) => acc + (Number(item.taxAmount) || 0), 0);
  const netAmount = totalAmount - totalTax;

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await uploadReceipt(formData).unwrap();
        setUploadedReceipts((prev) => [
          ...prev,
          { name: file.name, url: res.url, size: file.size },
        ]);
        toast.success(`Uploaded ${file.name}`, 'Receipt Uploaded');
      } catch (err: any) {
        toast.error(
          err?.data?.message || `Failed to upload ${file.name}. Please try again.`,
          'Upload Failed'
        );
      }
    }
    // reset input
    e.target.value = '';
  };

  const handleRemoveReceipt = (index: number) => {
    setUploadedReceipts((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateExpenseClaimFormData) => {
    try {
      const receiptUrls = uploadedReceipts.map((r) => r.url);
      await createClaim({
        ...data,
        receiptUrls,
      }).unwrap();

      toast.success('Expense claim submitted successfully for approval!', 'Claim Submitted');
      reset();
      setUploadedReceipts([]);
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit expense claim. Please check inputs and try again.',
        'Submission Error'
      );
    }
  };

  const categories: { value: ExpenseCategory; label: string }[] = [
    { value: 'TRAVEL', label: 'Travel & Transport' },
    { value: 'MEALS', label: 'Meals & Subsistence' },
    { value: 'LODGING', label: 'Hotel & Lodging' },
    { value: 'OFFICE_SUPPLIES', label: 'Office Supplies' },
    { value: 'SOFTWARE', label: 'Software & Tools' },
    { value: 'EQUIPMENT', label: 'Hardware / Equipment' },
    { value: 'CLIENT_ENTERTAINMENT', label: 'Client Entertainment' },
    { value: 'TRAINING', label: 'Training & Certs' },
    { value: 'OTHER', label: 'Other Miscellaneous' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-3xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-gray-50/50 dark:bg-[#1f1f1f]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="claim-modal-title"
                className="text-lg font-bold text-gray-900 dark:text-[#ececec]"
              >
                New Expense Claim
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Submit expenditures with itemized breakdowns and receipt attachments for reimbursement.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
            {/* General Claim Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Claim Title"
                  placeholder="e.g. Q4 Client Workshop & Travel Expenses"
                  error={errors.title?.message}
                  {...register('title')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Currency
                </label>
                <select
                  {...register('currency')}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="SGD">SGD ($)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Primary Category
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Line Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-[#ececec]">
                    Itemized Expenses
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Add each merchant transaction and receipt detail.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      date: new Date().toISOString().split('T')[0],
                      merchant: '',
                      category: 'TRAVEL',
                      description: '',
                      amount: 0,
                      taxAmount: 0,
                    })
                  }
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Item
                </Button>
              </div>

              {errors.items?.message && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.items.message}
                </p>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#212121]/60 border border-gray-200/80 dark:border-zinc-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                        Item #{index + 1}
                      </span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Input
                          label="Date"
                          type="date"
                          inputSize="sm"
                          leftIcon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}
                          error={errors.items?.[index]?.date?.message}
                          {...register(`items.${index}.date`)}
                        />
                      </div>

                      <div>
                        <Input
                          label="Merchant / Vendor"
                          placeholder="e.g. Uber, Hilton, Amazon"
                          inputSize="sm"
                          leftIcon={<Building className="w-3.5 h-3.5 text-gray-400" />}
                          error={errors.items?.[index]?.merchant?.message}
                          {...register(`items.${index}.merchant`)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                          Category
                        </label>
                        <select
                          {...register(`items.${index}.category`)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <Input
                          label="Description"
                          placeholder="Purpose / item description"
                          inputSize="sm"
                          error={errors.items?.[index]?.description?.message}
                          {...register(`items.${index}.description`)}
                        />
                      </div>

                      <div>
                        <Input
                          label="Amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          inputSize="sm"
                          leftIcon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}
                          error={errors.items?.[index]?.amount?.message}
                          {...register(`items.${index}.amount`, { valueAsNumber: true })}
                        />
                      </div>

                      <div>
                        <Input
                          label="Tax Amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          inputSize="sm"
                          leftIcon={<DollarSign className="w-3.5 h-3.5 text-gray-400" />}
                          error={errors.items?.[index]?.taxAmount?.message}
                          {...register(`items.${index}.taxAmount`, { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary Calculation Card */}
            <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-semibold text-brand-900 dark:text-brand-300">
                  Total Claim Calculation
                </span>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Subtotal: {selectedCurrency} {netAmount.toFixed(2)} + Tax: {selectedCurrency} {totalTax.toFixed(2)}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-xs uppercase font-medium text-gray-500 dark:text-zinc-400">
                  Grand Total
                </span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCurrency} {totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Receipt File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300">
                Receipt Attachments (PDF, PNG, JPG)
              </label>

              <div className="border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-brand-500 rounded-2xl p-4 text-center transition-colors">
                <input
                  type="file"
                  id="receipt-file-input"
                  multiple
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploadingFile}
                />
                <label
                  htmlFor="receipt-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="p-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                    {isUploadingFile ? (
                      <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                    {isUploadingFile ? 'Uploading file...' : 'Click or drag receipts here to upload'}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                    Supports PDF, PNG, JPG up to 10MB per file
                  </span>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedReceipts.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {uploadedReceipts.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-[#212121] border border-gray-200/60 dark:border-zinc-800 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span className="truncate font-medium text-gray-800 dark:text-zinc-200">
                          {rec.name}
                        </span>
                        {rec.size && (
                          <span className="text-[10px] text-gray-400">
                            ({(rec.size / 1024).toFixed(0)} KB)
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveReceipt(i)}
                        className="text-gray-400 hover:text-rose-500 p-1 transition-colors"
                        title="Remove attachment"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Notes & Comments (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Include project codes, client references, or approval notes..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-[#1f1f1f]/50 flex items-center justify-end gap-3 flex-shrink-0">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || totalAmount <= 0}
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Expense Claim
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
