import { useState } from 'react';

export interface EmployeeSalary {
  id: string;
  employeeId: string;
  employeeName: string;
  paymentDate: string;
  amount: number;
  currency: 'TRY' | 'USD' | 'EUR';
  status: 'Paid' | 'Pending' | 'Overdue';
}

const initialSalaries: EmployeeSalary[] = [
    { id: '1', employeeId: 'E001', employeeName: 'Ahmet Yılmaz', paymentDate: '2025-06-30', amount: 15000, currency: 'TRY', status: 'Paid' },
    { id: '2', employeeId: 'E002', employeeName: 'Ayşe Kaya', paymentDate: '2025-06-30', amount: 2500, currency: 'USD', status: 'Paid' },
    { id: '3', employeeId: 'E003', employeeName: 'Mehmet Demir', paymentDate: '2025-07-31', amount: 16000, currency: 'TRY', status: 'Pending' },
    { id: '4', employeeId: 'E004', employeeName: 'Fatma Çelik', paymentDate: '2025-05-31', amount: 14500, currency: 'TRY', status: 'Overdue' },
    { id: '5', employeeId: 'E005', employeeName: 'John Doe', paymentDate: '2025-06-30', amount: 3000, currency: 'EUR', status: 'Paid' },
    { id: '6', employeeId: 'E006', employeeName: 'Zeynep Aslan', paymentDate: '2025-07-31', amount: 17500, currency: 'TRY', status: 'Pending' },
    { id: '7', employeeId: 'E007', employeeName: 'Mustafa Öztürk', paymentDate: '2025-06-30', amount: 22000, currency: 'TRY', status: 'Paid' },
    { id: '8', employeeId: 'E008', employeeName: 'Emily White', paymentDate: '2025-04-30', amount: 2800, currency: 'USD', status: 'Overdue' },
    { id: '9', employeeId: 'E009', employeeName: 'Hans Schmidt', paymentDate: '2025-07-31', amount: 3200, currency: 'EUR', status: 'Pending' },
    { id: '10', employeeId: 'E010', employeeName: 'Ali Veli', paymentDate: '2025-06-30', amount: 13000, currency: 'TRY', status: 'Paid' },
];

export const useEmployeeSalaries = () => {
  const [salaries, setSalaries] = useState<EmployeeSalary[]>(initialSalaries);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  return { salaries, loading, error, setSalaries };
};
