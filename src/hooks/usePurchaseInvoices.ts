import { useState, useEffect } from 'react';
import { PurchaseInvoice } from 'types/PurchaseInvoice';

const mockInvoices: PurchaseInvoice[] = [
  {
    id: '1',
    invoiceNumber: 'AL-2024-001',
    supplier: 'Ana Tedarikçi Ltd.',
    date: '2024-06-15',
    vat: 650.0,
    amount: 3250.0,
    status: 'Paid',
  },
  {
    id: '2',
    invoiceNumber: 'AL-2024-002',
    supplier: 'Hammadde A.Ş.',
    date: '2024-05-20',
    vat: 3560.1,
    amount: 17800.5,
    status: 'Pending',
  },
  {
    id: '3',
    invoiceNumber: 'AL-2024-003',
    supplier: 'Lojistik Partneri',
    date: '2024-04-10',
    vat: 240.0,
    amount: 1200.0,
    status: 'Overdue',
  },
  {
    id: '4',
    invoiceNumber: 'AL-2024-004',
    supplier: 'Yedek Parça A.Ş.',
    date: '2024-05-22',
    vat: 3080.0,
    amount: 15400.0,
    status: 'Pending',
  },
  {
    id: '5',
    invoiceNumber: 'AL-2024-005',
    supplier: 'Ofis Malzemeleri',
    date: '2024-05-01',
    vat: 1330.15,
    amount: 6650.75,
    status: 'Paid',
  },
  {
    id: '6',
    invoiceNumber: 'AL-2024-006',
    supplier: 'Bilişim Hizmetleri',
    date: '2024-05-25',
    vat: 2900.0,
    amount: 14500.0,
    status: 'Pending',
  },
];

export const usePurchaseInvoices = () => {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Simulating a network request
      setTimeout(() => {
        setInvoices(mockInvoices);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch purchase invoices.');
      setLoading(false);
    }
  }, []);

  return { invoices, loading, error };
};
