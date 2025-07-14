import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Safe } from '../types/Safe';
import axios from 'axios';
import { useNotifications } from '../contexts/NotificationContext';

export * from '../types/Safe';



const API_URL = '/safes'; // Replace with your actual API endpoint

export const useSafes = () => {
  const [safes, setSafes] = useState<Safe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotifications();
  const { t } = useTranslation();

  const fetchSafes = useCallback(async () => {
    console.log('--- Running MOCKED fetchSafes ---'); // Diagnostic log
    setLoading(true);
    // MOCK: Return mock data to bypass server error
    const mockSafes: Safe[] = [
      { id: '1', name: 'Merkez Kasa (TRY)', currency: 'TRY', balance: 12500.75, type: 'cash', isActive: true },
      { id: '2', name: 'Döviz Kasası (USD)', currency: 'USD', balance: 5200.50, type: 'cash', isActive: true },
      { id: '3', name: 'Personel Kasası (TRY)', currency: 'TRY', balance: 8750.00, type: 'cash', isActive: true },
    ];

    setTimeout(() => {
      setSafes(mockSafes);
      setError(null);
      setLoading(false);
    }, 500); // Simulate network latency
  }, [t]);

  useEffect(() => {
    fetchSafes();
  }, [fetchSafes]);

  const addSafe = useCallback(async (safeData: Partial<Safe>) => {
    try {
      const response = await axios.post<Safe>(API_URL, safeData);
      setSafes(prev => [...prev, response.data]);
      showSuccess(t('safes.addSuccess'));
    } catch (err) {
      setError(t('safes.addError'));
      showError(t('safes.addError'));
      console.error(err);
    }
  }, [showSuccess, showError, t]);

  const updateSafe = useCallback(async (id: string, safeData: Partial<Safe>) => {
    try {
      const response = await axios.put<Safe>(`${API_URL}/${id}`, safeData);
      setSafes(prev => prev.map(s => s.id === id ? response.data : s));
      showSuccess(t('safes.updateSuccess'));
    } catch (err) {
      setError(t('safes.updateError'));
      showError(t('safes.updateError'));
      console.error(err);
    }
  }, [showSuccess, showError, t]);

    const getSafeById = useCallback(async (id: string): Promise<Safe | undefined> => {
    try {
      const response = await axios.get<Safe>(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      setError(t('safes.fetchByIdError'));
      showError(t('safes.fetchByIdError'));
      console.error(err);
      return undefined;
    }
  }, [showError, t]);

  const deleteSafe = useCallback(async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSafes(prev => prev.filter(s => s.id !== id));
      showSuccess(t('safes.deleteSuccess'));
    } catch (err) {
      setError(t('safes.deleteError'));
      showError(t('safes.deleteError'));
      console.error(err);
    }
  }, [showSuccess, showError, t]);

  return { safes, loading, error, fetchSafes, addSafe, updateSafe, deleteSafe, getSafeById };
};
