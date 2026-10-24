'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Search, Building2, FileText,
  Bot, Bell, LogOut, ChevronLeft, ChevronRight, Handshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

const navigation = [
  { name: 'Dashboard',       href: '/dashboard',     icon: LayoutDashboard },
  { name: 'Opportunities',   href: '/opportunities',  icon: Search          },
  { name: 'Company Profile', href: '/profile',        icon: Building2       },
  { name: 'Documents',       href: '/documents',      icon: FileText        },
  { name: 'AI Control',      href: '/ai-control',     icon: Bot             },
  { name: 'Notifications',   href: '/notifications',  icon: Bell            },
];

export function Sidebar() {
  const pathname         = usePathname();
  const { user, logOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-[#050A30] text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0000FF] flex items-center justify-center">
              <Handshake className="w-5 h-5 text-[#00FFFF]" />
            </div>
            <span className="text-lg font-bold tracking-tight">InteliPro</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#0000FF] flex items-center justify-center mx-auto">
            <Handshake className="w-5 h-5 text-[#00FFFF]" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white ml-auto"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft  className="w-4 h-4" />}
        </button>
      </div>

      {/* AI Mode Badge */}
      {!collapsed && (
        <div className="mx-4 mt-3 px-3 py-1.5 bg-[#00FFFF]/10 rounded-lg border border-[#00FFFF]/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse" />
            <span className="text-xs text-[#00FFFF] font-medium">Supervised Mode</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-[#0000FF]/40 text-white border border-[#00FFFF]/20'
                  : 'text-white/60 hover:bg-white/10 hover:text-white',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && item.name === 'Notifications' && (
                <span className="ml-auto bg-[#10B981] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/10">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#0000FF] flex items-center justify-center text-white text-sm font-semibold">
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-white/50 truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={logOut}
              className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logOut}
            className="w-full flex justify-center p-2 rounded hover:bg-white/10 text-white/50 hover:text-white"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
