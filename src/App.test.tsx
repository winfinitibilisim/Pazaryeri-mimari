import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock the router components to avoid navigation issues in tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Navigate: () => <div>Navigate</div>,
  useNavigate: () => jest.fn(),
}));

// Mock the language context
jest.mock('./context/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useLanguage: () => ({ isRTL: false, language: 'tr', setLanguage: jest.fn() }),
}));

// Mock the notification context
jest.mock('./context/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNotification: () => ({ notifications: [], addNotification: jest.fn(), removeNotification: jest.fn() }),
}));

test('renders without crashing', () => {
  // This test just verifies the App component renders without throwing an error
  expect(() => render(<App />)).not.toThrow();
});
