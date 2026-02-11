'use client';

import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[var(--dark-gray-50)]">
        <div className="flex w-1/2 items-center justify-center px-8">
          <div className="w-full max-w-[651px]">{children}</div>
        </div>
        <div className="flex w-1/2 items-stretch p-0">
          <div className="w-full rounded-none bg-[var(--dark-gray-100)]" />
        </div>
      </div>
    </AuthProvider>
  );
}
