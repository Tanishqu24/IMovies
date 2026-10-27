import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Mail, Lock, LogIn, Sparkles, User, Shield, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Login Demo Account Fillers
  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.success(`Demo credentials loaded for ${demoEmail}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#7C3AED]/40">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">
              I<span className="text-[#A855F7]">MOVIES</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Sign in to your account</h2>
          <p className="text-xs text-[#94A3B8]">
            Access your bookings, saved seats, and cinema privileges
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-[#171D33] border border-[#27324A] shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-3 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                />
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-3 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 shadow-lg shadow-[#7C3AED]/40 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="pt-4 border-t border-[#27324A] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block text-center">
              Quick Demo Fill (Capstone Evaluation)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@imovies.com', 'Password123!')}
                className="p-2 rounded-xl bg-[#11182B] hover:bg-[#1E2642] border border-[#7C3AED]/40 text-center transition-all group"
              >
                <Shield className="w-4 h-4 text-[#A855F7] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-white block">Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('rajesh.manager@imovies.com', 'Password123!')}
                className="p-2 rounded-xl bg-[#11182B] hover:bg-[#1E2642] border border-[#27324A] hover:border-[#7C3AED] text-center transition-all group"
              >
                <Compass className="w-4 h-4 text-[#22C55E] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-white block">Manager</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('aarav@gmail.com', 'Password123!')}
                className="p-2 rounded-xl bg-[#11182B] hover:bg-[#1E2642] border border-[#27324A] hover:border-[#7C3AED] text-center transition-all group"
              >
                <User className="w-4 h-4 text-[#38BDF8] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-white block">Customer</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#A855F7] font-bold hover:underline">
              Sign up now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

