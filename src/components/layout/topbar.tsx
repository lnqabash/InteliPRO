'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, HelpCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const pageTitles: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/opportunities': 'Opportunities',
  '/profile':       'Company Profile',
  '/documents':     'Document Repository',
  '/ai-control':    'AI Control Center',
  '/notifications': 'Notifications',
};

export function Topbar() {
  const pathname = usePathname();
  const { user }  = useAuth();

  const title = Object.entries(pageTitles)
    .find(([key]) => pathname === key || pathname.startsWith(key + '/'))?.[1] || 'InteliPro';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tenders..."
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent"
          />
        </div>

        {/* Help */}
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10B981] rounded-full" />
        </Link>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full bg-[#050A30] flex items-center justify-center text-white text-sm font-semibold ml-1">
          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
