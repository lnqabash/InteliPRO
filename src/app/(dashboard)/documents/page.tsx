'use client';

import React, { useState } from 'react';
import {
  Upload, FileText, Trash2, Eye, CheckCircle2, AlertTriangle, XCircle,
  Plus, Calendar, Shield, Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatFileSize } from '@/lib/utils';

const DOCUMENT_TYPES = [
  { id: 'company_registration',  label: 'Company Registration',  description: 'CIPC company registration documents',               icon: '🏢', mandatory: true  },
  { id: 'tax_clearance',         label: 'Tax Clearance',          description: 'SARS Tax Compliance Status PIN or certificate',     icon: '📋', mandatory: true  },
  { id: 'bbbee_certificate',     label: 'BBBEE Certificate',      description: 'Valid BBBEE verification certificate',              icon: '⭐', mandatory: true  },
  { id: 'cidb_certificate',      label: 'CIDB Certificate',       description: 'Construction Industry Development Board registration', icon: '🏗️', mandatory: false },
  { id: 'company_profile',       label: 'Company Profile',        description: 'Capability statement or company brochure',          icon: '📄', mandatory: false },
  { id: 'financial_statements',  label: 'Financial Statements',   description: 'Latest audited annual financial statements',        icon: '💰', mandatory: false },
];

type DocStatus = 'valid' | 'expiring' | 'expired';

type UploadedDoc = {
  id: string;
  docType: string;
  fileName: string;
  fileSize: number;
  status: DocStatus;
  uploadedAt: Date;
  expiryDate?: Date;
  version: number;
};

const INITIAL_DOCS: UploadedDoc[] = [
  { id: '1', docType: 'company_registration', fileName: 'company_registration_2020.pdf', fileSize: 245000, status: 'valid',    uploadedAt: new Date('2024-01-15'), version: 1 },
  { id: '2', docType: 'tax_clearance',         fileName: 'tax_clearance_2026.pdf',        fileSize: 120000, status: 'valid',    uploadedAt: new Date('2026-02-01'), expiryDate: new Date('2027-02-01'), version: 2 },
  { id: '3', docType: 'bbbee_certificate',     fileName: 'bbbee_level3_2025.pdf',         fileSize: 890000, status: 'expiring', uploadedAt: new Date('2025-10-01'), expiryDate: new Date('2026-11-15'), version: 1 },
];

function StatusBadge({ status }: { status: DocStatus }) {
  if (status === 'valid')    return <Badge variant="success"     className="gap-1"><CheckCircle2  className="w-3 h-3" />Valid</Badge>;
  if (status === 'expiring') return <Badge variant="warning"     className="gap-1"><AlertTriangle className="w-3 h-3" />Expiring</Badge>;
  return                            <Badge variant="destructive" className="gap-1"><XCircle       className="w-3 h-3" />Expired</Badge>;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<UploadedDoc[]>(INITIAL_DOCS);
  const [uploading, setUploading] = useState<string | null>(null);

  const getDocForType = (typeId: string) => documents.find(d => d.docType === typeId);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|doc|docx|jpg|jpeg|png)$/i)) {
      alert('Please upload a PDF, Word document, or image file.');
      return;
    }

    setUploading(docType);

    // Simulate a brief upload delay — no real Storage needed
    await new Promise(r => setTimeout(r, 1200));

    const existing = getDocForType(docType);
    const newDoc: UploadedDoc = {
      id: String(Date.now()),
      docType,
      fileName: file.name,
      fileSize: file.size,
      status: 'valid',
      uploadedAt: new Date(),
      version: existing ? existing.version + 1 : 1,
    };

    setDocuments(prev => [...prev.filter(d => d.docType !== docType), newDoc]);
    setUploading(null);

    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const totalUploaded = documents.length;
  const validCount    = documents.filter(d => d.status === 'valid').length;
  const expiringCount = documents.filter(d => d.status === 'expiring').length;
  const expiredCount  = documents.filter(d => d.status === 'expired').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Repository</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Upload and manage your compliance documents for bid readiness assessments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Uploaded',      value: totalUploaded, icon: FileText,       color: 'text-blue-600',    bg: 'bg-blue-50'    },
          { label: 'Valid',         value: validCount,    icon: CheckCircle2,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Expiring Soon', value: expiringCount, icon: AlertTriangle,  color: 'text-amber-600',   bg: 'bg-amber-50'   },
          { label: 'Expired',       value: expiredCount,  icon: XCircle,        color: 'text-red-600',     bg: 'bg-red-50'     },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
        <div>
          <strong>Document metadata is stored in Firestore.</strong> File contents are held locally in this
          session. Connect Firebase Storage (Blaze plan) to enable persistent cloud file storage.
        </div>
      </div>

      {/* Document Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-[#0A2540]" />
          <h2 className="font-semibold text-gray-900">Compliance Documents</h2>
        </div>

        {DOCUMENT_TYPES.map(docType => {
          const uploaded    = getDocForType(docType.id);
          const isUploading = uploading === docType.id;

          return (
            <Card
              key={docType.id}
              className={`transition-all ${uploaded ? 'border-gray-100' : 'border-dashed border-gray-200'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                    {docType.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">{docType.label}</span>
                      {docType.mandatory && <Badge variant="outline" className="text-xs">Required</Badge>}
                      {uploaded && <StatusBadge status={uploaded.status} />}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{docType.description}</p>

                    {uploaded ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {uploaded.fileName}
                          </span>
                          <span className="text-gray-400">{formatFileSize(uploaded.fileSize)}</span>
                          {uploaded.version > 1 && (
                            <Badge variant="info" className="text-xs">v{uploaded.version}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                          <span>Uploaded {formatDate(uploaded.uploadedAt)}</span>
                          {uploaded.expiryDate && (
                            <span className={`flex items-center gap-1 ${uploaded.status === 'expiring' ? 'text-amber-600 font-medium' : ''}`}>
                              <Calendar className="w-3 h-3" />
                              Expires {formatDate(uploaded.expiryDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No document uploaded</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {uploaded && (
                      <>
                        <button
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          title="Preview (coming soon)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                          title="Delete"
                          onClick={() => deleteDocument(uploaded.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Hidden file input + visible button */}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        disabled={isUploading}
                        onChange={e => handleFileSelect(e, docType.id)}
                      />
                      <Button
                        variant={uploaded ? 'outline' : 'default'}
                        size="sm"
                        disabled={isUploading}
                        asChild={false}
                        className="gap-1.5 pointer-events-none"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                            Uploading…
                          </>
                        ) : (
                          <>
                            {uploaded ? <Upload className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            {uploaded ? 'Replace' : 'Upload'}
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer note */}
      <Card className="bg-[#0A2540]/3 border-[#0A2540]/10">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#0A2540] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#0A2540]">Documents power your Bid Readiness score</p>
            <p className="text-xs text-gray-600 mt-0.5">
              Agent 4 (Bid Readiness) compares your uploaded documents against each tender&apos;s requirements
              to calculate a readiness score and identify gaps before you bid.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
