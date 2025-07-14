export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  date: string;
  vat: number;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}
