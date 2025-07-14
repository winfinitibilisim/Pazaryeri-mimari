export interface FilterOption {
  value: string;
  labelKey: string; // Translation key for the option label
}

export interface FilterConfigItem {
  id: string; // Unique identifier for the filter
  labelKey: string; // Translation key for the filter group title
  type: 'date-range' | 'select' | 'number-range';
  options?: FilterOption[]; // For 'select' type
  placeholderMinKey?: string; // For 'number-range' min input placeholder
  placeholderMaxKey?: string; // For 'number-range' max input placeholder
}

export const expenseReceiptFilterConfig: FilterConfigItem[] = [
  {
    id: 'expenseDate',
    labelKey: 'filterByExpenseDate',
    type: 'date-range',
  },
  {
    id: 'expenseCategory',
    labelKey: 'filterByExpenseCategory',
    type: 'select',
    options: [
      // These should ideally come from a dynamic source or a more comprehensive static list
      { value: 'Office Supplies', labelKey: 'categoryOfficeSupplies' },
      { value: 'Travel', labelKey: 'categoryTravel' },
      { value: 'Utilities', labelKey: 'categoryUtilities' },
      { value: 'Marketing', labelKey: 'categoryMarketing' },
      { value: 'Equipment', labelKey: 'categoryEquipment' },
      { value: 'Other', labelKey: 'categoryOther' }, // Adding a generic 'Other'
    ],
  },
  {
    id: 'approvalStatus',
    labelKey: 'filterByApprovalStatus',
    type: 'select',
    options: [
      { value: 'approved', labelKey: 'statusApproved' },
      { value: 'pending', labelKey: 'statusPending' },
      { value: 'rejected', labelKey: 'statusRejected' },
    ],
  },
  {
    id: 'paymentMethod',
    labelKey: 'filterByPaymentMethod',
    type: 'select',
    options: [
      { value: 'creditCard', labelKey: 'paymentMethodCreditCard' },
      { value: 'bankTransfer', labelKey: 'paymentMethodBankTransfer' },
      { value: 'cash', labelKey: 'paymentMethodCash' },
      // Add other payment methods if necessary
    ],
  },
  {
    id: 'currency',
    labelKey: 'filterByCurrency',
    type: 'select',
    options: [
      { value: 'TRY', labelKey: 'currencyTRY' },
      { value: 'USD', labelKey: 'currencyUSD' },
      { value: 'EUR', labelKey: 'currencyEUR' },
      { value: 'GBP', labelKey: 'currencyGBP' },
      { value: 'JPY', labelKey: 'currencyJPY' },
      { value: 'CNY', labelKey: 'currencyCNY' },
      { value: 'RUB', labelKey: 'currencyRUB' },
      { value: 'SAR', labelKey: 'currencySAR' },
      { value: 'AED', labelKey: 'currencyAED' },
    ],
  },
  {
    id: 'expenseAmount',
    labelKey: 'filterByExpenseAmount',
    type: 'number-range',
    placeholderMinKey: 'minAmount',
    placeholderMaxKey: 'maxAmount',
  },
  {
    id: 'vatAmount',
    labelKey: 'filterByVatAmount',
    type: 'number-range',
    placeholderMinKey: 'minVatAmount',
    placeholderMaxKey: 'maxVatAmount',
  },
];
