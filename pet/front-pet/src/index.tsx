import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { AnimalsProvider } from './context/AnimalsProvider';
import MainLayout from './Components/Layout/MainLayout/MainLayout';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AnimalsProvider>
          <MainLayout />
        </AnimalsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
