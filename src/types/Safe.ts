export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'RUB' | 'SAR' | 'AED';

// Represents a cash or bank safe in the system
export interface Safe {
  id: string;
  type: 'cash' | 'bank' | 'other';
  name: string;
  iban?: string;
  balance: number;
  currency: Currency;
  isActive: boolean;
  description?: string;
  accountName?: string;
  openingDate?: string;
  bankName?: string;
  branchName?: string;
  accountNumber?: string;
  branch?: string;
  accountHolder?: string;
  countryCode?: string;
}
