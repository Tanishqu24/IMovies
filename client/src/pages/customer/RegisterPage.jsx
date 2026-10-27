import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, Mail, Lock, Phone, MapPin, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { selectedCity, availableCities } = useCity();
  const [city, setCity] = useState(selectedCity);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const user = await register({
        fullName,
        email,
        password,
        phone,
        city
      });
      toast.success(`Welcome to IMovies, ${user.fullName.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-xl font-bold text-white tracking-tight">Create your account</h2>
          <p className="text-xs text-[#94A3B8]">
            Join thousands of cinema lovers booking the best seats
          </p>
        </div>

        {/* Register Card */}
        <div className="p-8 rounded-3xl bg-[#171D33] border border-[#27324A] shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-3 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                />
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Email Address *
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
                Password * (min 6 chars)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-3 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-9 pr-3 py-3 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#11182B] text-sm text-white py-3 px-3 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c} className="bg-[#171D33] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 shadow-lg shadow-[#7C3AED]/40 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-[#94A3B8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#A855F7] font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

