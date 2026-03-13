'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  FileBadge, 
  Trash2, 
  Network, 
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function Home() {
  const [activeTab, setActiveTab] = useState('issue');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-semibold tracking-tight">CertVerify</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Blockchain-backed Certificate System
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
            <TabButton 
              active={activeTab === 'issue'} 
              onClick={() => setActiveTab('issue')}
              icon={<FileBadge className="w-5 h-5" />}
              label="Issue Certificate"
            />
            <TabButton 
              active={activeTab === 'verify'} 
              onClick={() => setActiveTab('verify')}
              icon={<ShieldCheck className="w-5 h-5" />}
              label="Verify Certificate"
            />
            <TabButton 
              active={activeTab === 'delete'} 
              onClick={() => setActiveTab('delete')}
              icon={<Trash2 className="w-5 h-5" />}
              label="Delete Certificate"
            />
            <TabButton 
              active={activeTab === 'merkle'} 
              onClick={() => setActiveTab('merkle')}
              icon={<Network className="w-5 h-5" />}
              label="Merkle Root"
            />
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'issue' && <IssueForm key="issue" />}
              {activeTab === 'verify' && <VerifyForm key="verify" />}
              {activeTab === 'delete' && <DeleteForm key="delete" />}
              {activeTab === 'merkle' && <MerkleView key="merkle" />}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function IssueForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{type: 'success' | 'error', message: string} | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${BACKEND_URL}/input`, {
        method: 'POST',
        body: formData,
      });
      
      const text = await response.text();
      
      if (response.ok) {
        setResult({ type: 'success', message: text });
        (e.target as HTMLFormElement).reset();
      } else {
        setResult({ type: 'error', message: text || 'Failed to issue certificate' });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'Network error. Is the backend running?' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 md:p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Issue New Certificate</h2>
        <p className="text-slate-500">Enter the details to generate and store a new certificate.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="credential_id" className="text-sm font-medium text-slate-700">Credential ID</label>
            <input required type="text" id="credential_id" name="credential_id" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. CERT-2026-001" />
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">Recipient Name</label>
            <input required type="text" id="name" name="name" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Jane Doe" />
          </div>
          <div className="space-y-2">
            <label htmlFor="designation" className="text-sm font-medium text-slate-700">Designation</label>
            <input required type="text" id="designation" name="designation" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Software Engineer" />
          </div>
          <div className="space-y-2">
            <label htmlFor="course" className="text-sm font-medium text-slate-700">Course / Program</label>
            <input required type="text" id="course" name="course" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Advanced Blockchain" />
          </div>
          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-medium text-slate-700">Year</label>
            <input required type="number" id="year" name="year" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 2026" min="1900" max="2100" />
          </div>
          <div className="space-y-2">
            <label htmlFor="expiry" className="text-sm font-medium text-slate-700">Expiry Date (Optional)</label>
            <input type="date" id="expiry" name="expiry" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileBadge className="w-5 h-5" />}
            {loading ? 'Issuing...' : 'Issue Certificate'}
          </button>
        </div>

        {result && (
          <ResultAlert type={result.type} message={result.message} />
        )}
      </form>
    </motion.div>
  );
}

function VerifyForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${BACKEND_URL}/verify`, {
        method: 'POST',
        body: formData,
      });
      
      const text = await response.text();
      
      if (text.includes('Certificate verified')) {
        setResult({ type: 'success', message: text });
      } else if (text.includes('TAMPERED')) {
        setResult({ type: 'error', message: text });
      } else {
        setResult({ type: 'warning', message: text });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'Network error. Is the backend running?' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 md:p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Verify Certificate</h2>
        <p className="text-slate-500">Check the authenticity and integrity of a certificate.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <label htmlFor="verify_credential_id" className="text-sm font-medium text-slate-700">Credential ID</label>
          <input required type="text" id="verify_credential_id" name="credential_id" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg" placeholder="Enter Credential ID" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          {loading ? 'Verifying...' : 'Verify Authenticity'}
        </button>

        {result && (
          <ResultAlert type={result.type} message={result.message} />
        )}
      </form>
    </motion.div>
  );
}

function DeleteForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${BACKEND_URL}/delete`, {
        method: 'POST',
        body: formData,
      });
      
      const text = await response.text();
      
      if (text.includes('Certificate deleted')) {
        setResult({ type: 'success', message: text });
        (e.target as HTMLFormElement).reset();
      } else {
        setResult({ type: 'warning', message: text });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'Network error. Is the backend running?' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 md:p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2 text-red-600">Delete Certificate</h2>
        <p className="text-slate-500">Permanently remove a certificate from the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <label htmlFor="delete_credential_id" className="text-sm font-medium text-slate-700">Credential ID</label>
          <input required type="text" id="delete_credential_id" name="credential_id" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-lg" placeholder="Enter Credential ID" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          {loading ? 'Deleting...' : 'Delete Certificate'}
        </button>

        {result && (
          <ResultAlert type={result.type} message={result.message} />
        )}
      </form>
    </motion.div>
  );
}

function MerkleView() {
  const [loading, setLoading] = useState(false);
  const [root, setRoot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchMerkleRoot() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/merkle`);
      const text = await response.text();
      
      if (response.ok) {
        const hash = text.replace('Merkle Root:', '').trim();
        setRoot(hash);
      } else {
        setError(text || 'Failed to fetch Merkle root');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 md:p-8 h-full flex flex-col"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Merkle Root</h2>
        <p className="text-slate-500">View the current cryptographic root of all issued certificates.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-8 py-12">
        <button 
          onClick={fetchMerkleRoot}
          disabled={loading}
          className="px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-lg"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Network className="w-6 h-6" />}
          {loading ? 'Calculating...' : 'Compute Merkle Root'}
        </button>

        <AnimatePresence>
          {root && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3"
            >
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Root Hash</div>
              <div className="font-mono text-lg md:text-xl text-indigo-600 break-all bg-white p-4 rounded-lg border border-indigo-100 shadow-inner">
                {root}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
        active 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <div className={`${active ? 'text-indigo-600' : 'text-slate-400'}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}

function ResultAlert({ type, message }: { type: 'success' | 'error' | 'warning', message: string }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${styles[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="whitespace-pre-wrap font-medium">{message}</div>
    </motion.div>
  );
}
