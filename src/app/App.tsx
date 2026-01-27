import { useState } from 'react';
import { AuthProvider } from '@/app/context/AuthContext';
import { MainApp } from '@/app/components/MainApp';

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}