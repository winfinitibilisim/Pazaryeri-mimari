import { FilterField } from '../components/common/AccordionFilter';

/**
 * Alış faturaları filtreleri
 * @param t - Çeviri fonksiyonu
 */
export const getPurchaseInvoiceFilterConfig = (t: any): FilterField[] => [
  {
    id: 'invoiceNumber',
    label: t('filterLabelInvoiceNumber', { defaultValue: 'Invoice Number' }),
    type: 'text',
  },
  {
    id: 'supplierName',
    label: t('filterLabelSupplierName', { defaultValue: 'Supplier Name' }),
    type: 'text',
  },
  {
    id: 'status',
    label: t('status', { defaultValue: 'Status' }),
    type: 'select',
    options: [
      { value: '', label: t('filterOptionAll', { defaultValue: 'All' }) },
      { value: 'paid', label: t('filterOptionPaid', { defaultValue: 'Paid' }) },
      { value: 'unpaid', label: t('filterOptionUnpaid', { defaultValue: 'Unpaid' }) }, // Assuming 'unpaid' is a valid status for purchase invoices
      { value: 'pending_payment', label: t('filterOptionPendingPayment', { defaultValue: 'Pending Payment' }) },
      { value: 'partial_payment', label: t('filterOptionPartialPayment', { defaultValue: 'Partial Payment' }) },
      { value: 'overdue', label: t('filterOptionOverdue', { defaultValue: 'Overdue' }) },
      { value: 'cancelled', label: t('filterOptionCancelled', { defaultValue: 'Cancelled' }) },
      { value: 'draft', label: t('filterOptionDraft', { defaultValue: 'Draft' }) },
      { value: 'received', label: t('filterOptionReceived', { defaultValue: 'Received' }) }
    ]
  },
  {
    id: 'invoiceDate',
    label: t('filterLabelInvoiceDateRange', { defaultValue: 'Invoice Date Range' }),
    type: 'daterange',
  },
  {
    id: 'totalAmount',
    label: t('filterLabelAmountRange', { defaultValue: 'Amount Range' }),
    type: 'numberrange',
  }
];
