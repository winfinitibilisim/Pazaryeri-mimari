import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { mockInvoices } from '../data/mockData';
import PurchaseInvoiceForm from '../components/forms/PurchaseInvoiceForm';

const CreatePurchaseInvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit/');

  const initialData = useMemo(() => {
    if (id) {
      const invoice = mockInvoices.find(inv => inv.id === id);
      if (invoice) {
        return invoice;
      }
    }
    return null;
  }, [id]);

  const handleSaveInvoice = (data: any) => {
    console.log('Invoice Saved:', data);
    // Here you would typically handle the API call to save the invoice
  };

  const handleSaveAsDraft = (data: any) => {
    console.log('Draft Saved:', data);
    // Here you would handle the API call to save the draft
  };

  if (id && !initialData) {
    return <div>Fatura bulunamadı!</div>;
  }

  return (
    <PurchaseInvoiceForm
      initialData={initialData}
      onSave={handleSaveInvoice}
      onSaveAsDraft={handleSaveAsDraft}
      isEditMode={isEditMode}
    />
  );
};

export default CreatePurchaseInvoicePage;
