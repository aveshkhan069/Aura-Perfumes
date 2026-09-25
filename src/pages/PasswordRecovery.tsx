import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const authPanel = (
  <div className="hidden lg:flex lg:col-span-5 bg-[#111111] text-white p-10 flex-col justify-between relative overflow-hidden">
    <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#c5a880]/15 rounded-full blur-3xl pointer-events-none" />
    <div>
      <p className="font-serif-luxury text-2xl tracking-[0.25em]">AURA</p>
      <p className="text-[9px] tracking-[0.35em] text-[#c5a880] uppercase">PERFUMES</p>
    </div>
    <div className="relative z-10">
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880]">A private ritual</span>
      <h2 className="font-serif-luxury text-4xl mt-3">Your collection, protected.</h2>
      <p className="text-xs text-stone-400 leading-relaxed mt-3">We will help you return to your AURA account securely.</p>
    </div>
    <span className="text-[10px] tracking-[0.2em] text-stone-500 uppercase">AURA · Maison de Parfum</span>
  </div>
);

export const ForgotPassword: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await requestPasswordReset(email);
    setIsLoading(false);
    if (result.success) setSent(true);
    showToast(result.message, result.success ? 'success' : 'error');
  };

  return (
    <main className="min-h-[70vh] bg-[#faf9f5] py-12 px-4 flex items-center justify-center">
      <section className="w-full max-w-4xl bg-white border border-stone-200 shadow-2xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {authPanel}
        <div className="lg:col-span-7 p-7 sm:p-12 flex flex-col justify-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500 hover:text-black mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#b4986b]">Account recovery</span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-2">Forgot your password?</h1>
          <p className="text-xs leading-relaxed text-stone-500 mt-3 mb-7">
            {sent ? 'If an account exists for that email, a secure recovery link is on its way.' : 'Enter your account email and we will send a secure link to reset your password.'}
          </p>
          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-xs font-semibold text-stone-700">
                Email address
                <span className="relative block mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-[#faf9f5] border border-stone-300 pl-10 pr-3 py-3 text-xs focus:outline-none focus:border-black" placeholder="you@example.com" />
                </span>
              </label>
              <button disabled={isLoading} className="w-full bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold py-3.5 hover:bg-[#252525] disabled:opacity-50">
                {isLoading ? 'Sending…' : 'Send recovery link'}
              </button>
            </form>
          )}
          {sent && <Link to="/login" className="text-xs font-semibold underline underline-offset-4">Return to sign in</Link>}
        </div>
      </section>
    </main>
  );
};

export const ResetPassword: React.FC = () => {
  const { updatePassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      showToast('Choose a password with at least 8 characters.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Your passwords do not match.', 'error');
      return;
    }
    setIsLoading(true);
    const result = await updatePassword(password);
    setIsLoading(false);
    showToast(result.message, result.success ? 'success' : 'error');
    if (result.success) navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-[70vh] bg-[#faf9f5] py-12 px-4 flex items-center justify-center">
      <section className="w-full max-w-4xl bg-white border border-stone-200 shadow-2xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {authPanel}
        <div className="lg:col-span-7 p-7 sm:p-12 flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#b4986b]">Secure account access</span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 mt-2">Create a new password</h1>
          <p className="text-xs leading-relaxed text-stone-500 mt-3 mb-7">Use at least 8 characters. Your password is encrypted and managed securely by Supabase Auth.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs font-semibold text-stone-700">
              New password
              <span className="relative block mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-[#faf9f5] border border-stone-300 pl-10 pr-3 py-3 text-xs focus:outline-none focus:border-black" />
              </span>
            </label>
            <label className="block text-xs font-semibold text-stone-700">
              Confirm password
              <span className="relative block mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full bg-[#faf9f5] border border-stone-300 pl-10 pr-3 py-3 text-xs focus:outline-none focus:border-black" />
              </span>
            </label>
            <button disabled={isLoading} className="w-full bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold py-3.5 hover:bg-[#252525] disabled:opacity-50">
              {isLoading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};
