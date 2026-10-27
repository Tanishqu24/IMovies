import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Trash2, Check, X, UserCheck } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      params.append('page', page);
      params.append('limit', 12);

      const res = await API.get(`/users?${params.toString()}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load user records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}`, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await API.put(`/users/${userId}`, { isActive: !currentStatus });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await API.delete(`/users/${userToDelete._id}`);
      toast.success('User account deleted');
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="User & Role Management"
        subtitle="Manage user permissions, assign theatre manager roles, and oversee accounts"
      />

      <div className="p-8 space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#11182B] text-xs font-semibold text-white px-3 py-2.5 rounded-xl border border-[#27324A]"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="manager">Managers</option>
              <option value="customer">Customers</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Phone & City</th>
                  <th className="py-4 px-6">Assigned Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Registered</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#11182B]/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.fullName)}`}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-[#27324A]"
                          />
                          <div>
                            <span className="font-bold text-white block">{u.fullName}</span>
                            <span className="text-xs text-[#94A3B8]">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white block font-medium">{u.city || 'N/A'}</span>
                        <span className="text-xs text-[#94A3B8]">{u.phone || 'No phone'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className={`text-xs font-bold py-1 px-2.5 rounded-lg border focus:outline-none ${
                            u.role === 'admin'
                              ? 'bg-[#7C3AED]/20 border-[#7C3AED] text-[#A855F7]'
                              : u.role === 'manager'
                              ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                              : 'bg-[#11182B] border-[#27324A] text-white'
                          }`}
                        >
                          <option value="customer" className="bg-[#171D33] text-white">Customer</option>
                          <option value="manager" className="bg-[#171D33] text-white">Theatre Manager</option>
                          <option value="admin" className="bg-[#171D33] text-white">Super Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleStatusToggle(u._id, u.isActive)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                            u.isActive
                              ? 'bg-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/30'
                              : 'bg-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/30'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#94A3B8]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setUserToDelete(u);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#11182B]"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#27324A]">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        </div>

      </div>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete User Account?"
        message={`Are you sure you want to permanently delete the account of ${userToDelete?.fullName}?`}
        confirmText="Delete Account"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />

    </div>
  );
};

export default AdminUsersPage;

