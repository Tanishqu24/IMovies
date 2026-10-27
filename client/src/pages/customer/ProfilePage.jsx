import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Lock, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await API.put('/auth/profile', {
        fullName,
        phone,
        city
      });
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#27324A] pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage your personal cinema profile and account security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Overview */}
        <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] text-center space-y-4 h-fit">
          <img
            src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || 'User')}`}
            alt=""
            className="w-24 h-24 rounded-full mx-auto border-2 border-[#7C3AED] shadow-xl object-cover"
          />

          <div>
            <h2 className="text-lg font-bold text-white">{user?.fullName}</h2>
            <p className="text-xs text-[#94A3B8]">{user?.email}</p>
          </div>

          <div className="pt-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/30">
              Role: {user?.role}
            </span>
          </div>

          <div className="text-[11px] text-[#94A3B8] pt-2 border-t border-[#27324A]">
            City Preference: <span className="text-white font-medium">{user?.city || 'Mumbai'}</span>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Form */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Edit Profile Form */}
          <form onSubmit={handleUpdateProfile} className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-[#27324A] pb-3">
              <User className="w-4 h-4 text-[#A855F7]" />
              <span>Personal Information</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-[#11182B]/50 text-sm text-[#94A3B8] p-2.5 rounded-xl border border-[#27324A] cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Preferred City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 flex items-center space-x-2 shadow-md shadow-[#7C3AED]/30 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdatingProfile ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-[#27324A] pb-3">
              <Lock className="w-4 h-4 text-[#A855F7]" />
              <span>Change Password</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#11182B] text-sm text-white p-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#11182B] hover:bg-[#1E2642] border border-[#27324A] hover:border-[#7C3AED] transition-all disabled:opacity-50"
              >
                <span>{isChangingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;

