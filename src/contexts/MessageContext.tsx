/**
 * MessageContext
 * 
 * Bu context, uygulama genelinde merkezi bir mesaj dialog sistemi sağlar.
 * Herhangi bir bileşenden kolayca mesaj dialogları gösterilebilir.
 */

import React, { createContext, useState, useContext, ReactNode } from 'react';
import MessageDialog, { MessageType } from '../components/common/MessageDialog';

// MessageContext için arayüz
interface MessageContextType {
  showMessage: (options: ShowMessageOptions) => void;
  hideMessage: () => void;
}

// showMessage fonksiyonu için parametreler
interface ShowMessageOptions {
  title: string;
  message: string;
  secondaryMessage?: string;
  type?: MessageType;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showConfirmOnly?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Context'in varsayılan değeri
const defaultContextValue: MessageContextType = {
  showMessage: () => {},
  hideMessage: () => {},
};

// Context oluştur
const MessageContext = createContext<MessageContextType>(defaultContextValue);

// MessageProvider props
interface MessageProviderProps {
  children: ReactNode;
}

/**
 * MessageProvider bileşeni
 */
export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  // Dialog durumu
  const [isOpen, setIsOpen] = useState(false);
  // Dialog özellikleri
  const [dialogProps, setDialogProps] = useState<Omit<ShowMessageOptions, 'onConfirm' | 'onCancel'> & {
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    title: '',
    message: '',
  });

  // Mesaj gösterme fonksiyonu
  const showMessage = (options: ShowMessageOptions) => {
    setDialogProps(options);
    setIsOpen(true);
  };

  // Mesaj gizleme fonksiyonu
  const hideMessage = () => {
    setIsOpen(false);
  };

  return (
    <MessageContext.Provider value={{ showMessage, hideMessage }}>
      {children}
      <MessageDialog
        open={isOpen}
        onClose={hideMessage}
        title={dialogProps.title}
        message={dialogProps.message}
        secondaryMessage={dialogProps.secondaryMessage}
        type={dialogProps.type}
        confirmButtonText={dialogProps.confirmButtonText}
        cancelButtonText={dialogProps.cancelButtonText}
        onConfirm={dialogProps.onConfirm}
        onCancel={dialogProps.onCancel}
        showConfirmOnly={dialogProps.showConfirmOnly}
        maxWidth={dialogProps.maxWidth}
      />
    </MessageContext.Provider>
  );
};

/**
 * useMessage hook
 * 
 * Bu hook, MessageContext'e erişim sağlar.
 * Bileşenler içinde mesaj dialoglarını göstermek için kullanılır.
 */
export const useMessage = () => useContext(MessageContext);

export default MessageContext;
