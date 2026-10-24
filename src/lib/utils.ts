import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Timestamp } from 'firebase/firestore';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Timestamp | Date | string, pattern = 'dd MMM yyyy'): string {
  if (!date) return 'N/A';
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);
  return format(d, pattern);
}

export function formatRelativeDate(date: Timestamp | Date | string): string {
  if (!date) return 'N/A';
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getDaysUntilClosing(date: Timestamp | Date | string): number {
  if (!date) return 0;
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);
  return differenceInDays(d, new Date());
}

export function formatCurrency(amount: number, currency = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getMatchScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (score >= 60) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (score >= 40) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

export function getReadinessScoreColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

export function getRiskSeverityColor(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-700 border-red-200';
    case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
  }
}

export function getDocumentStatusColor(status: string): string {
  switch (status) {
    case 'valid': return 'bg-emerald-100 text-emerald-700';
    case 'expiring': return 'bg-amber-100 text-amber-700';
    case 'expired': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Northern Cape',
];

export const INDUSTRIES = [
  'Construction',
  'Engineering',
  'Information Technology',
  'Health & Medical',
  'Education & Training',
  'Professional Services',
  'Logistics & Transport',
  'Agriculture',
  'Mining',
  'Energy & Utilities',
  'Finance & Insurance',
  'Retail & Wholesale',
  'Manufacturing',
  'Government & Public Sector',
];

export const SERVICE_CATEGORIES = [
  'Civil Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Structural Engineering',
  'Software Development',
  'IT Infrastructure',
  'Cybersecurity',
  'Data Analytics',
  'Healthcare Services',
  'Training & Development',
  'Consulting',
  'Auditing',
  'Legal Services',
  'Facilities Management',
  'Security Services',
  'Cleaning Services',
  'Catering',
  'Transportation',
  'Supply of Goods',
  'Environmental Services',
];

export const TENDER_CATEGORIES = [
  'Infrastructure',
  'ICT',
  'Health',
  'Education',
  'Professional Services',
  'Goods & Supplies',
  'Transport & Logistics',
  'Energy',
  'Water & Sanitation',
  'Housing',
  'Security',
  'Environmental',
  'Agriculture',
  'Mining',
];
