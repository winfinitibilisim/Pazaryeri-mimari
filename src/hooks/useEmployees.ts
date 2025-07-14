import { useState } from 'react';

export interface Employee {
  id: string;
  name: string;
}

// Mock employee data for demo; replace with API integration as needed
type UseEmployeesResult = {
  employees: Employee[];
};

export function useEmployees(): UseEmployeesResult {
  // This could be replaced with real API call or context
  const [employees] = useState<Employee[]>([
    { id: '1', name: 'Ali Veli' },
    { id: '2', name: 'Ayşe Yılmaz' },
    { id: '3', name: 'Fatma Kaya' },
    { id: '4', name: 'Mehmet Demir' },
  ]);
  return { employees };
}
