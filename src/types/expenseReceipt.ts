export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Project {
  id: string;
  name: string;
  projectCode?: string;
}

export interface TaxInfo {
  taxRate?: number; // e.g., 18 for 18%
  taxAmount?: number;
  isTaxIncluded?: boolean;
}

export interface ExpenseReceipt {
  id: string;
  receiptNumber: string;
  expenseDate: string; // ISO 8601 format (YYYY-MM-DD)
  amount: number;
  vatAmount?: number; // Optional VAT Amount
  currency: string; // e.g., 'TRY', 'USD'
  expenseCategory: string;
  expenseSubCategory?: string;
  paymentMethod?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Paid';
  vendor?: Vendor;
  project?: Project;
  notes?: string;
  attachments?: Array<{ fileName: string; url: string; type?: string }>;
  taxInfo?: TaxInfo;
  userId?: string; // User who created/owns the receipt
  createdAt?: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
  approvedBy?: string; // User ID of approver
  approvalDate?: string; // ISO 8601 format
  rejectionReason?: string;
  isRecurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// You can add other related types or enums here if needed
