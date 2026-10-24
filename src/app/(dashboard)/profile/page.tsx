'use client';

import React, { useState } from 'react';
import {
  Building2, MapPin, Briefcase, Award, Save, CheckCircle2, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { PROVINCES, INDUSTRIES, SERVICE_CATEGORIES } from '@/lib/utils';

const BUSINESS_TYPES = [
  { value: 'pty_ltd', label: '(Pty) Ltd' },
  { value: 'sole_proprietor', label: 'Sole Proprietor' },
  { value: 'cc', label: 'Close Corporation (CC)' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'npo', label: 'Non-Profit Organisation' },
  { value: 'cooperative', label: 'Cooperative' },
];

const EMPLOYEE_RANGES = ['1-5', '6-10', '11-50', '51-200', '201-500', '500+'];
const TURNOVER_RANGES = ['< R1M', 'R1M-R5M', 'R5M-R20M', 'R20M-R100M', '> R100M'];
const BBBEE_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(['Software Development', 'IT Infrastructure']);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(['Gauteng', 'Western Cape']);

  const [form, setForm] = useState({
    companyName: 'TechBuild Solutions (Pty) Ltd',
    registrationNumber: '2020/123456/07',
    taxNumber: '1234567890',
    vatNumber: '',
    businessType: 'pty_ltd',
    industry: 'Information Technology',
    province: 'Gauteng',
    city: 'Johannesburg',
    address: '123 Tech Park, Sandton, 2196',
    bbbeeLevel: '3',
    cidbGrade: '',
    yearEstablished: '2020',
    numberOfEmployees: '11-50',
    annualTurnover: 'R1M-R5M',
    contactName: 'Thembi Dlamini',
    contactEmail: 'thembi@techbuild.co.za',
    contactPhone: '011 000 0000',
    website: 'www.techbuild.co.za',
    description: 'TechBuild Solutions is a Gauteng-based IT company specialising in software development, cloud infrastructure and digital transformation for the public sector.',
  });

  // Completeness calculation
  const fields = [form.companyName, form.registrationNumber, form.taxNumber, form.businessType, form.industry, form.province, form.city, form.address, form.bbbeeLevel, form.contactName, form.contactEmail, form.contactPhone, form.description, selectedServices.length > 0 ? 'ok' : '', selectedProvinces.length > 0 ? 'ok' : ''];
  const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleService = (s: string) => {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleProvince = (p: string) => {
    setSelectedProvinces(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your profile powers AI matching. Keep it accurate for better results.</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Profile'}
        </Button>
      </div>

      {/* Completeness */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
            <span className={`text-sm font-bold ${completeness >= 80 ? 'text-emerald-600' : completeness >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {completeness}%
            </span>
          </div>
          <Progress value={completeness} indicatorColor={completeness >= 80 ? '#10B981' : completeness >= 60 ? '#F59E0B' : '#EF4444'} />
          {completeness < 80 && (
            <p className="text-xs text-gray-500 mt-1.5">Complete your profile to improve match accuracy</p>
          )}
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-[#00A6A6]" />Business Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Company Name *</Label>
            <Input className="mt-1.5" value={form.companyName} onChange={e => setForm(f => ({...f, companyName: e.target.value}))} />
          </div>
          <div>
            <Label>Registration Number *</Label>
            <Input className="mt-1.5" value={form.registrationNumber} onChange={e => setForm(f => ({...f, registrationNumber: e.target.value}))} placeholder="2020/123456/07" />
          </div>
          <div>
            <Label>Tax Number *</Label>
            <Input className="mt-1.5" value={form.taxNumber} onChange={e => setForm(f => ({...f, taxNumber: e.target.value}))} />
          </div>
          <div>
            <Label>VAT Number (optional)</Label>
            <Input className="mt-1.5" value={form.vatNumber} onChange={e => setForm(f => ({...f, vatNumber: e.target.value}))} placeholder="4123456789" />
          </div>
          <div>
            <Label>Business Type *</Label>
            <Select value={form.businessType} onValueChange={v => setForm(f => ({...f, businessType: v}))}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Year Established</Label>
            <Input className="mt-1.5" type="number" value={form.yearEstablished} onChange={e => setForm(f => ({...f, yearEstablished: e.target.value}))} placeholder="2020" />
          </div>
          <div>
            <Label>Number of Employees</Label>
            <Select value={form.numberOfEmployees} onValueChange={v => setForm(f => ({...f, numberOfEmployees: v}))}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {EMPLOYEE_RANGES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Annual Turnover</Label>
            <Select value={form.annualTurnover} onValueChange={v => setForm(f => ({...f, annualTurnover: v}))}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TURNOVER_RANGES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Company Description *</Label>
            <textarea
              className="mt-1.5 w-full min-h-[80px] rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6A6] resize-none"
              value={form.description}
              onChange={e => setForm(f => ({...f, description: e.target.value}))}
              placeholder="Describe your company's main activities, expertise and what you do..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Industry & Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#00A6A6]" />Industry & Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Primary Industry *</Label>
            <Select value={form.industry} onValueChange={v => setForm(f => ({...f, industry: v}))}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Service Categories * <span className="text-gray-400 font-normal">(select all that apply)</span></Label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_CATEGORIES.map(s => (
                <button
                  key={s}
                  onClick={() => toggleService(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedServices.includes(s)
                      ? 'bg-[#0A2540] text-white border-[#0A2540]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#00A6A6] hover:text-[#00A6A6]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-[#00A6A6]" />Business Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Registered Province *</Label>
              <Select value={form.province} onValueChange={v => setForm(f => ({...f, province: v}))}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City *</Label>
              <Input className="mt-1.5" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input className="mt-1.5" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Operating Provinces <span className="text-gray-400 font-normal">(where you can deliver work)</span></Label>
            <div className="flex flex-wrap gap-2">
              {PROVINCES.map(p => (
                <button
                  key={p}
                  onClick={() => toggleProvince(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedProvinces.includes(p)
                      ? 'bg-[#00A6A6] text-white border-[#00A6A6]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#00A6A6]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-[#00A6A6]" />Certifications & Accreditations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>BBBEE Level</Label>
            <Select value={form.bbbeeLevel} onValueChange={v => setForm(f => ({...f, bbbeeLevel: v}))}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not certified</SelectItem>
                {BBBEE_LEVELS.map(l => <SelectItem key={l} value={String(l)}>Level {l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>CIDB Grade</Label>
            <Input className="mt-1.5" value={form.cidbGrade} onChange={e => setForm(f => ({...f, cidbGrade: e.target.value}))} placeholder="e.g. 5CE (leave blank if not applicable)" />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-[#00A6A6]" />Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Contact Person *</Label>
            <Input className="mt-1.5" value={form.contactName} onChange={e => setForm(f => ({...f, contactName: e.target.value}))} />
          </div>
          <div>
            <Label>Email *</Label>
            <Input className="mt-1.5" type="email" value={form.contactEmail} onChange={e => setForm(f => ({...f, contactEmail: e.target.value}))} />
          </div>
          <div>
            <Label>Phone *</Label>
            <Input className="mt-1.5" value={form.contactPhone} onChange={e => setForm(f => ({...f, contactPhone: e.target.value}))} />
          </div>
          <div>
            <Label>Website</Label>
            <Input className="mt-1.5" value={form.website} onChange={e => setForm(f => ({...f, website: e.target.value}))} placeholder="www.yourcompany.co.za" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-6">
        <Button size="lg" onClick={handleSave} className="gap-2">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Profile Saved!' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}
