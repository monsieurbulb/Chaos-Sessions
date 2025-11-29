
import React, { useState } from 'react';
import { Terminal, Lock } from 'lucide-react';
import { adminLogin } from '../services/mockServices';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await adminLogin(password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('Access Denied: Invalid Key');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-md bg-black border border-chaos-border p-8 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Decorative header line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-chaos-organic to-chaos-accent"></div>
        
        <div className="flex items-center gap-3 mb-8">
          <Terminal className="w-6 h-6 text-chaos-accent" />
          <h2 className="text-xl font-mono text-white tracking-widest uppercase">System Access</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-chaos-muted mb-2">ENTER ADMIN KEY</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-chaos-panel border border-chaos-border text-white font-mono px-4 py-3 rounded focus:border-chaos-accent focus:outline-none transition-colors"
                placeholder="••••••••"
                autoFocus
              />
              <Lock className="absolute right-3 top-3 w-5 h-5 text-chaos-muted" />
            </div>
            {error && <div className="mt-2 text-red-500 text-xs font-mono">{error}</div>}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-chaos-border text-chaos-muted font-mono text-xs hover:text-white hover:border-white transition-colors rounded"
            >
              ABORT
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-chaos-organic/20 border border-chaos-organic text-chaos-accent font-mono text-xs hover:bg-chaos-organic/30 transition-colors rounded flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">AUTHENTICATING...</span>
              ) : (
                'INITIALIZE'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-4 border-t border-chaos-border text-[10px] text-chaos-muted font-mono text-center">
          RESTRICTED AREA. ALL ATTEMPTS LOGGED.
        </div>
      </div>
    </div>
  );
};
