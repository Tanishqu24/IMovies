import React, { useState, useEffect } from 'react';
import { CreditCard, Search, DollarSign, CheckCircle2, RotateCcw } from 'lucide-react';
import API from '../../services/api';
import AdminHeader from '../../components/admin/AdminHeader';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (methodFilter !== 'all') params.append('method', methodFilter);
      params.append('page', page);
      params.append('limit', 15);

      const res = await API.get(`/payments?${params.toString()}`);
      setPayments(res.data.payments || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load payment transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, search, methodFilter]);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Payment Gateways & Logs"
        subtitle="Simulated and verified transactions, UPI references, and refund logs"
      />

      <div className="p-8 space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search Transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#11182B] text-sm text-white placeholder-[#94A3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#27324A] focus:outline-none focus:border-[#7C3AED]"
              />
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-[#11182B] text-xs font-semibold text-white px-3 py-2.5 rounded-xl border border-[#27324A]"
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI</option>
              <option value="card">Cards</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="rounded-2xl bg-[#171D33] border border-[#27324A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#11182B] text-xs font-bold uppercase tracking-wider text-white border-b border-[#27324A]">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Booking Ref</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27324A]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                      Loading payment transactions...
                    </td>
                  </tr>
                ) : payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p._id} className="hover:bg-[#11182B]/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-white text-xs">
                        {p.transactionId}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium block">{p.userId?.fullName || 'Customer'}</span>
                        <span className="text-xs text-[#94A3B8]">{p.userId?.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[#A855F7] font-mono font-bold text-xs">
                          #{p.bookingId?.bookingId || 'IM-REF'}
                        </span>
                      </td>
                      <td className="py-4 px-6 uppercase font-bold text-xs text-white">
                        {p.paymentMethod}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        ₹{p.amount}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            p.paymentStatus === 'success'
                              ? 'bg-[#22C55E]/20 text-[#22C55E]'
                              : 'bg-[#EF4444]/20 text-[#EF4444]'
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-xs text-[#94A3B8]">
                        {new Date(p.paymentDate || p.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                      No transactions found.
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
    </div>
  );
};

export default AdminPaymentsPage;

