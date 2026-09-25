import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginRegister: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const isRegisterRoute = location.pathname === '/register';
  const [isRegister, setIsRegister] = useState(isRegisterRoute);

  // Form states
  const [email, setEmail] = useState('aveshkhan069@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegister) {
      if (!name.trim()) {
        showToast('Please enter your full name', 'error');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        setIsLoading(false);
        return;
      }
      const res = await register(name, email, password);
      setIsLoading(false);
      if (res.success) {
        showToast(res.message);
        navigate('/account');
      } else {
        showToast(res.message, 'error');
      }
    } else {
      const res = await login(email, password);
      setIsLoading(false);
      if (res.success) {
        showToast(res.message);
        navigate('/account');
      } else {
        showToast(res.message, 'error');
      }
    }
  };

  const handleOAuthDemo = (provider: string) => {
    showToast(`Signing in via ${provider}...`);
    login(`${provider.toLowerCase()}user@auraperfumes.com`, 'oauthDemoPass').then(() => {
      navigate('/account');
    });
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white border border-stone-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Luxury Dark Panel - Wireframe Panel 04 */}
        <div className="lg:col-span-5 bg-[#111111] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a880]/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex flex-col mb-8">
              <span className="font-serif-luxury text-2xl tracking-[0.25em] font-medium text-white uppercase">
                AURA
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#c5a880] uppercase font-sans">
                PERFUMES
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-medium tracking-tight leading-snug">
              Welcome Back
            </h2>
            <p className="text-xs text-stone-300 font-light mt-2 leading-relaxed">
              Sign in to your account and continue your private fragrance journey. Track orders,
              curate your wishlist, and unlock inner circle privileges.
            </p>
          </div>

          <div className="my-8 relative aspect-square max-w-[220px] mx-auto overflow-hidden rounded border border-stone-800 shadow-xl">
            <img
              src="/src/assets/images/hero_aura_perfume_1790347541852.jpg"
              alt="AURA Luxury Flacon"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
            <span>Encrypted client authentication & data privacy</span>
          </div>
        </div>

        {/* Right Column: Interactive Form - Wireframe Panel 04 */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          {/* Segmented Tab Controls */}
          <div className="flex border-b border-stone-200 mb-8">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold text-center transition-colors relative cursor-pointer ${
                !isRegister ? 'text-black' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Login
              {!isRegister && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold text-center transition-colors relative cursor-pointer ${
                isRegister ? 'text-black' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Register
              {isRegister && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#faf9f5] border border-stone-300 pl-10 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#faf9f5] border border-stone-300 pl-10 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#faf9f5] border border-stone-300 pl-10 pr-10 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-[#faf9f5] border border-stone-300 pl-10 pr-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-black"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your email address', 'info')}
                  className="text-stone-500 hover:text-black underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3.5 transition-colors cursor-pointer mt-4"
            >
              {isLoading ? 'Processing...' : isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          {/* Social OAuth Options - Wireframe Panel 04 */}
          <div className="my-6 flex items-center gap-3">
            <span className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] uppercase tracking-wider text-stone-400">or</span>
            <span className="flex-1 h-px bg-stone-200" />
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleOAuthDemo('Google')}
              className="w-full border border-stone-300 hover:border-black bg-white text-stone-800 text-xs font-semibold py-2.5 px-4 flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthDemo('Facebook')}
              className="w-full border border-stone-300 hover:border-black bg-white text-stone-800 text-xs font-semibold py-2.5 px-4 flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-stone-500">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-semibold text-stone-900 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-semibold text-stone-900 hover:underline cursor-pointer"
                >
                  Register
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
