import { useState, useEffect } from 'react';

export interface ExpenseReceiptItem {
  itemId: string;
  date: string;
  status: 'paid' | 'pending' | 'cancelled';
  cashAndBank: string;
  amount: number;
  balance: number;
}

export interface ReceiptHistoryEvent {
  date: string;
  user: string;
  action: string;
  details?: string;
}

export interface Document {
  id: string;
  name: string;
  size: number; // in bytes
  url: string;
}

export interface ExpenseReceipt {
  id: string;
  receiptNumber: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'cancelled';
  items: ExpenseReceiptItem[];
  history: ReceiptHistoryEvent[];
  documents: Document[];
}

const mockReceipts: ExpenseReceipt[] = [
    {
        id: '1',
        receiptNumber: 'ER-001',
        date: '2024-07-01',
        category: 'Travel',
        description: 'Business trip to Ankara',
        amount: 1555.00,
        currency: 'TRY',
        status: 'paid',
        items: [
            { itemId: '1-1', date: '2024-07-01', status: 'paid', cashAndBank: 'Corporate Credit Card', amount: 55.00, balance: 55.00 },
            { itemId: '1-2', date: '2024-07-01', status: 'paid', cashAndBank: 'Corporate Credit Card', amount: 1500.00, balance: 1500.00 },
        ],
        history: [
            { date: '2024-07-01T10:00:00Z', user: 'Ahmet Durmaz', action: 'receiptCreated', details: 'Receipt for business trip to Ankara created.' },
            { date: '2024-07-02T14:30:00Z', user: 'Ayşe Yılmaz', action: 'paymentAdded', details: 'Payment of 1555.00 TRY added via Corporate Credit Card.' },
            { date: '2024-07-02T14:35:00Z', user: 'System', action: 'statusChanged', details: 'Status changed to Paid.' },
        ],
        documents: [
            { id: 'doc-1', name: 'flight-ticket.pdf', size: 123456, url: '#' },
            { id: 'doc-2', name: 'hotel-receipt.jpg', size: 789012, url: '#' },
        ]
    },
    {
        id: '2',
        receiptNumber: 'ER-002',
        date: '2024-07-03',
        category: 'Office Supplies',
        description: 'Monthly office supply purchase',
        amount: 120.50,
        currency: 'TRY',
        status: 'pending',
        items: [
            { itemId: '2-1', date: '2024-07-03', status: 'pending', cashAndBank: 'Main Safe', amount: 120.50, balance: 120.50 }
        ],
        history: [
            { date: '2024-07-03T11:00:00Z', user: 'Mehmet Öztürk', action: 'receiptCreated', details: 'Receipt for office supplies created.' },
            { date: '2024-07-04T09:00:00Z', user: 'Zeynep Kaya', action: 'receiptUpdated', details: 'Description updated to "Monthly office supply purchase".' },
        ],
        documents: [
            { id: 'doc-3', name: 'stationery-invoice.pdf', size: 345678, url: '#' }
        ]
    },
    {
        id: '3',
        receiptNumber: 'ER-003',
        date: '2024-07-05',
        category: 'Meals',
        description: 'Client lunch meeting',
        amount: 250.75,
        currency: 'TRY',
        status: 'pending',
        items: [
            { itemId: '3-1', date: '2024-07-05', status: 'pending', cashAndBank: 'Employee Advance', amount: 250.75, balance: 250.75 }
        ],
        history: [],
        documents: []
    },
    {
        id: '4',
        receiptNumber: 'ER-004',
        date: '2024-06-28',
        category: 'Software',
        description: 'Annual subscription for design tool',
        amount: 1500.00,
        currency: 'USD',
        status: 'paid',
        items: [
            { itemId: '4-1', date: '2024-06-28', status: 'paid', cashAndBank: 'Company Bank Account', amount: 1500.00, balance: 1500.00 }
        ],
        history: [],
        documents: []
    },
    {
        id: '5',
        receiptNumber: 'ER-005',
        date: '2024-07-10',
        category: 'Travel',
        description: 'Hotel booking for conference',
        amount: 2200.00,
        currency: 'EUR',
        status: 'pending',
        items: [
            { itemId: '5-1', date: '2024-07-10', status: 'pending', cashAndBank: 'Corporate Credit Card', amount: 2200.00, balance: 2200.00 }
        ],
        history: [],
        documents: []
    },
    {
        id: '6',
        receiptNumber: 'ER-006',
        date: '2024-07-11',
        category: 'Utilities',
        description: 'Office internet bill',
        amount: 350.00,
        currency: 'TRY',
        status: 'paid',
        items: [
            { itemId: '6-1', date: '2024-07-11', status: 'paid', cashAndBank: 'Main Safe', amount: 350.00, balance: 350.00 }
        ],
        history: [],
        documents: []
    },
    {
        id: '7',
        receiptNumber: 'ER-007',
        date: '2024-07-12',
        category: 'Meals',
        description: 'Team dinner',
        amount: 850.00,
        currency: 'TRY',
        status: 'cancelled',
        items: [
            { itemId: '7-1', date: '2024-07-12', status: 'cancelled', cashAndBank: 'Employee Advance', amount: 850.00, balance: 850.00 }
        ],
        history: [],
        documents: []
    },
];

export const useExpenseReceipts = () => {
  const [receipts, setReceipts] = useState<ExpenseReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReceipts(mockReceipts);
      setLoading(false);
    }, 500);
  }, []);

  return { receipts, loading };
};
