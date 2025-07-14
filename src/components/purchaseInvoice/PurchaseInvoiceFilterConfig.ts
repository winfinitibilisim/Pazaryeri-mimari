export const getPurchaseInvoiceFilterConfig = (t: any) => [
  {
    id: 'status',
    label: t('status'),
    type: 'select' as const,
    options: [
      { value: 'paid', label: t('paid') },
      { value: 'pending', label: t('pending') },
      { value: 'overdue', label: t('overdue') },
      { value: 'cancelled', label: t('cancelled') },
      { value: 'draft', label: t('draft') }
    ]
  },
  {
    id: 'invoiceDateStart',
    label: t('invoiceDateStart'),
    type: 'date' as const
  },
  {
    id: 'invoiceDateEnd',
    label: t('invoiceDateEnd'),
    type: 'date' as const
  },
  {
    id: 'amountMin',
    label: t('amountMin'),
    type: 'number' as const
  },
  {
    id: 'amountMax',
    label: t('amountMax'),
    type: 'number' as const
  },
  {
    id: 'supplierName',
    label: t('supplierName'),
    type: 'text' as const
  }
];
