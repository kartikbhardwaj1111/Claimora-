import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, XCircle, FileText, Edit3, DollarSign, Layers } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function InsurerDashboard({ claims, onSelectReview, onViewDocument }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Compute stats
  const totalClaimsCount = claims.length;
  const pendingCount = claims.filter((c) => c.status === 'Pending').length;
  const approvedCount = claims.filter((c) => c.status === 'Approved').length;
  const rejectedCount = claims.filter((c) => c.status === 'Rejected').length;

  const totalClaimedValue = claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0);
  const totalApprovedValue = claims
    .filter((c) => c.status === 'Approved')
    .reduce((sum, c) => sum + (c.approvedAmount || 0), 0);

  // Filter & Search Logic
  const filteredClaims = claims
    .filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = c.patientName?.toLowerCase().includes(q);
        const emailMatch = c.patientEmail?.toLowerCase().includes(q);
        const idMatch = c.claimId?.toLowerCase().includes(q);
        return nameMatch || emailMatch || idMatch;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.submissionDate) - new Date(a.submissionDate);
      if (sortBy === 'oldest') return new Date(a.submissionDate) - new Date(b.submissionDate);
      if (sortBy === 'amount-high') return b.claimAmount - a.claimAmount;
      if (sortBy === 'amount-low') return a.claimAmount - b.claimAmount;
      return 0;
    });

  return (
    <div>
      {/* Header Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Insurer Control Center</h1>
          <p className="page-subtitle">Inspect submitted claim details, review uploaded receipts, and issue approval decisions.</p>
        </div>
      </div>

      {/* Stats Header Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <span>Total Submitted Claims</span>
            <div className="stat-icon-wrapper primary">
              <Layers size={18} />
            </div>
          </div>
          <div className="stat-value">{totalClaimsCount}</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <span>Pending Approvals</span>
            <div className="stat-icon-wrapper warning">
              <Clock size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#d97706' }}>{pendingCount}</div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <span>Approved Reimbursement</span>
            <div className="stat-icon-wrapper success">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#059669' }}>₹{totalApprovedValue.toLocaleString()}</div>
        </div>

        <div className="stat-card primary">
          <div className="stat-header">
            <span>Total Claimed Value</span>
            <div className="stat-icon-wrapper primary">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="stat-value">₹{totalClaimedValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.6rem' }}
              placeholder="Search by Patient Name, Email, or Claim ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#64748b" />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses ({totalClaimsCount})</option>
              <option value="Pending">Pending ({pendingCount})</option>
              <option value="Approved">Approved ({approvedCount})</option>
              <option value="Rejected">Rejected ({rejectedCount})</option>
            </select>
          </div>

          {/* Sort By */}
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Date (Newest)</option>
            <option value="oldest">Sort: Date (Oldest)</option>
            <option value="amount-high">Sort: Amount (High to Low)</option>
            <option value="amount-low">Sort: Amount (Low to High)</option>
          </select>
        </div>

        {/* Quick Filter Pills Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter by Status:</span>
          <div className="filter-pills">
            <button
              className={`filter-pill ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              All ({totalClaimsCount})
            </button>
            <button
              className={`filter-pill ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`filter-pill ${statusFilter === 'Approved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Approved')}
            >
              Approved ({approvedCount})
            </button>
            <button
              className={`filter-pill ${statusFilter === 'Rejected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Rejected')}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Claims Queue Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="card-title">
            <span>Claims Processing Queue</span>
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Showing {filteredClaims.length} of {totalClaimsCount} claims</span>
        </div>

        {filteredClaims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
            <FileText size={40} color="#94a3b8" style={{ margin: '0 auto 0.85rem' }} />
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#334155' }}>No claims match your filter criteria</div>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try resetting the search query or status filter to view all claims.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Patient Info</th>
                  <th>Submission Date</th>
                  <th>Claimed Amount</th>
                  <th>Approved Amount</th>
                  <th>Status</th>
                  <th>Document</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((c) => (
                  <tr key={c._id || c.claimId}>
                    <td style={{ fontWeight: '800', color: '#2563eb' }}>{c.claimId}</td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{c.patientName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.patientEmail}</div>
                    </td>
                    <td style={{ fontWeight: '600', color: '#64748b' }}>{new Date(c.submissionDate).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '700' }}>₹{c.claimAmount?.toLocaleString()}</td>
                    <td style={{ fontWeight: '700', color: c.status === 'Approved' ? '#059669' : '#64748b' }}>
                      {c.status === 'Approved' ? `₹${c.approvedAmount?.toLocaleString()}` : '-'}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewDocument(c.documentUrl, c.documentOriginalName)}
                      >
                        <FileText size={14} color="#2563eb" /> View Document
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelectReview(c)}
                      >
                        <Edit3 size={14} /> Review Claim
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
