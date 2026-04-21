import { useState, useRef } from 'react';
import { Building2, Image, DollarSign, Globe, Upload, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../shared/utils/api';
import { useAuthStore } from '../features/auth/hooks/useAuth';

type Tab = 'company' | 'branding' | 'pricing' | 'preferences';

const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'branding', label: 'Logo & Branding', icon: Image },
  { id: 'pricing', label: 'Pricing Defaults', icon: DollarSign },
  { id: 'preferences', label: 'Preferences', icon: Globe },
];

function SaveButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-strong disabled:opacity-60 text-white text-[15px] font-bold rounded-full transition-all shadow-floating"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
      {loading ? 'Saving…' : 'Save Changes'}
    </button>
  );
}

// ── Company Profile Tab ──────────────────────────────────────────────────────
function CompanyProfileTab() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', gstNumber: '', website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/companies/me', form);
      toast.success('Company profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <Field label="Company Name" id="name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Bright Solar Co." />
        <Field label="Phone" id="phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+91 98765 43210" />
      </div>
      <Field label="Address" id="address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} placeholder="123 Solar Street, Mumbai 400001" />
      <div className="grid grid-cols-2 gap-5">
        <Field label="GST Number (optional)" id="gstNumber" value={form.gstNumber} onChange={v => setForm(f => ({ ...f, gstNumber: v }))} placeholder="29ABCDE1234F1Z5" />
        <Field label="Website (optional)" id="website" value={form.website} onChange={v => setForm(f => ({ ...f, website: v }))} placeholder="https://yoursolar.com" />
      </div>
      <div className="flex justify-end pt-2">
        <SaveButton loading={loading} />
      </div>
    </form>
  );
}

// ── Logo & Branding Tab ──────────────────────────────────────────────────────
function BrandingTab() {
  const [loading, setLoading] = useState(false);
  const [sigLoading, setSigLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [sigPreview, setSigPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const sigRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ headerText: '', footerText: '' });
  const [textLoading, setTextLoading] = useState(false);

  const uploadFile = async (file: File, endpoint: string, onSuccess: (url: string) => void, setLoad: (v: boolean) => void) => {
    setLoad(true);
    const fd = new FormData();
    const fieldName = endpoint.includes('signature') ? 'signature' : 'logo';
    fd.append(fieldName, file);
    try {
      const res = await api.put(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = res.data.data.logoUrl ?? res.data.data.signatureUrl ?? '';
      onSuccess(url);
      toast.success('Uploaded successfully');
    } catch {
      toast.error('Upload failed');
    } finally {
      setLoad(false);
    }
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoPreview(URL.createObjectURL(f));
    uploadFile(f, '/companies/me/logo', () => {}, setLoading);
  };

  const handleSig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSigPreview(URL.createObjectURL(f));
    uploadFile(f, '/companies/me/quote-settings/signature', () => {}, setSigLoading);
  };

  const saveText = async (e: React.FormEvent) => {
    e.preventDefault();
    setTextLoading(true);
    try {
      await api.put('/companies/me/quote-settings', form);
      toast.success('Branding text saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setTextLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo Upload */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1 mb-3">Company Logo</h3>
        <div
          className="border-2 border-dashed border-border rounded-[24px] p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-primary hover:bg-primary-soft transition-all"
          onClick={() => logoRef.current?.click()}
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Logo preview" className="h-20 object-contain" />
          ) : (
            <>
              <div className="w-14 h-14 bg-primary-soft rounded-[16px] flex items-center justify-center">
                {loading ? <Loader2 className="w-6 h-6 text-primary-strong animate-spin" /> : <Upload className="w-6 h-6 text-primary-strong" />}
              </div>
              <p className="text-[15px] text-textSoft font-medium">Click to upload logo <span className="text-textMuted">(PNG, JPG, max 5MB)</span></p>
            </>
          )}
        </div>
        <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
      </div>

      {/* Signature Upload */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1 mb-3">Authorised Signature <span className="text-textSoft font-medium normal-case tracking-normal">(appears in PDF footer)</span></h3>
        <div
          className="border-2 border-dashed border-border rounded-[24px] p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-primary hover:bg-primary-soft transition-all"
          onClick={() => sigRef.current?.click()}
        >
          {sigPreview ? (
            <img src={sigPreview} alt="Signature preview" className="h-14 object-contain" />
          ) : (
            <>
              <div className="w-12 h-12 bg-surfaceMuted rounded-[14px] flex items-center justify-center">
                {sigLoading ? <Loader2 className="w-5 h-5 text-textMuted animate-spin" /> : <Upload className="w-5 h-5 text-textMuted" />}
              </div>
              <p className="text-[15px] text-textSoft font-medium">Upload signature image</p>
            </>
          )}
        </div>
        <input ref={sigRef} type="file" accept="image/*" className="hidden" onChange={handleSig} />
      </div>

      {/* PDF Text */}
      <form onSubmit={saveText} className="space-y-5">
        <Field label="Header Text (appears at top of PDF)" id="headerText" value={form.headerText} onChange={v => setForm(f => ({ ...f, headerText: v }))} placeholder="Professional Solar Installation Services" />
        <Field label="Footer Text (appears at bottom of PDF)" id="footerText" value={form.footerText} onChange={v => setForm(f => ({ ...f, footerText: v }))} placeholder="Thank you for choosing us. Prices valid for 30 days." />
        <div className="flex justify-end">
          <SaveButton loading={textLoading} />
        </div>
      </form>
    </div>
  );
}

// ── Pricing Defaults Tab ─────────────────────────────────────────────────────
function PricingTab() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    defaultPanelCostPerKW: '', defaultInverterCost: '', defaultInstallationCost: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/companies/me/pricing-config', {
        defaultPanelCostPerKW: Number(form.defaultPanelCostPerKW),
        defaultInverterCost: Number(form.defaultInverterCost),
        defaultInstallationCost: Number(form.defaultInstallationCost),
      });
      toast.success('Pricing defaults saved');
    } catch {
      toast.error('Failed to save pricing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-slate-500">These values will auto-fill the quotation form. You can always override per quote.</p>
      <div className="grid grid-cols-1 gap-5">
        <NumberField label="Default Panel Cost per kW (₹)" id="panelCost" value={form.defaultPanelCostPerKW} onChange={v => setForm(f => ({ ...f, defaultPanelCostPerKW: v }))} placeholder="e.g. 35000" />
        <NumberField label="Default Inverter Cost (₹)" id="inverterCost" value={form.defaultInverterCost} onChange={v => setForm(f => ({ ...f, defaultInverterCost: v }))} placeholder="e.g. 18000" />
        <NumberField label="Default Installation Cost (₹)" id="installCost" value={form.defaultInstallationCost} onChange={v => setForm(f => ({ ...f, defaultInstallationCost: v }))} placeholder="e.g. 12000" />
      </div>
      <div className="flex justify-end">
        <SaveButton loading={loading} />
      </div>
    </form>
  );
}

// ── Preferences Tab ──────────────────────────────────────────────────────────
function PreferencesTab() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ currency: 'INR', dateFormat: 'DD/MM/YYYY' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/companies/me/settings', form);
      toast.success('Preferences saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="currency" className="block text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Currency</label>
          <select
            id="currency"
            value={form.currency}
            onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className="flex h-[52px] w-full items-center justify-between rounded-md border border-border bg-input px-4 py-2 text-[15px] text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-150"
          >
            <option value="INR">₹ INR — Indian Rupee</option>
            <option value="USD">$ USD — US Dollar</option>
            <option value="EUR">€ EUR — Euro</option>
            <option value="GBP">£ GBP — British Pound</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="dateFormat" className="block text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Date Format</label>
          <select
            id="dateFormat"
            value={form.dateFormat}
            onChange={e => setForm(f => ({ ...f, dateFormat: e.target.value }))}
            className="flex h-[52px] w-full items-center justify-between rounded-md border border-border bg-input px-4 py-2 text-[15px] text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-150"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <SaveButton loading={loading} />
      </div>
    </form>
  );
}

// ── Reusable Field ───────────────────────────────────────────────────────────
function Field({ label, id, value, onChange, placeholder }: {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-[52px] w-full rounded-md border border-border bg-input px-4 py-2 text-[15px] text-text ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-textSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150"
      />
    </div>
  );
}

function NumberField({ label, id, value, onChange, placeholder }: {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">{label}</label>
      <input
        id={id}
        type="number"
        min="0"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-[52px] w-full rounded-md border border-border bg-input px-4 py-2 text-[15px] text-text ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-textSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150"
      />
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('company');
  const user = useAuthStore(s => s.user);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text tracking-tight">Settings</h1>
        <p className="text-textSoft font-medium mt-1">Manage your company profile, branding, and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar tabs */}
        <nav className="w-full md:w-64 shrink-0 space-y-1.5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] text-[15px] font-bold transition-all text-left ${
                activeTab === id
                  ? 'bg-primary-soft text-primary-strong shadow-sm'
                  : 'text-textMuted hover:bg-surfaceMuted hover:text-text'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="flex-1 bg-surface rounded-[24px] border border-border shadow-floating p-8">
          {/* Plan notice */}
          {user?.plan === 'FREE' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex gap-3 items-start">
              <span className="text-lg">⚠️</span>
              <span>You're on the <strong>FREE plan</strong>. Upgrade to unlock unlimited leads and advanced features.</span>
            </div>
          )}

          {activeTab === 'company' && <CompanyProfileTab />}
          {activeTab === 'branding' && <BrandingTab />}
          {activeTab === 'pricing' && <PricingTab />}
          {activeTab === 'preferences' && <PreferencesTab />}
        </div>
      </div>
    </div>
  );
}
