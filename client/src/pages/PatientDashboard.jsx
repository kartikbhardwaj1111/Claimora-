import React, { useState, useEffect } from 'react';
import { PlusCircle, Upload, FileText, CheckCircle2, Clock, DollarSign, ArrowUpRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function PatientDashboard({ currentUser, claims, onSubmitClaim, onViewDocument }) {
  const [patientName, setPatientName] = useState(currentUser?.name || 'Rahul Sharma');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || 'patient@aarogya.com');
  const [claimAmount, setClaimAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name);
      setPatientEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!claimAmount || Number(claimAmount) <= 0) {
      setError('Please enter a valid claim amount greater than zero.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('patientName', patientName);
      formData.append('patientEmail', patientEmail);
      formData.append('claimAmount', claimAmount);
      formData.append('description', description);
      if (selectedFile) {
        formData.append('document', selectedFile);
      }

      await onSubmitClaim(formData);
      setMessage('Claim submitted successfully! Your claim is now under review.');
      setClaimAmount('');
      setDescription('');
      setSelectedFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const myClaims = claims.filter((c) => c.patientEmail?.toLowerCase() === patientEmail.toLowerCase());
  const totalSubmitted = myClaims.length;
  const totalApprovedAmt = myClaims
    .filter((c) => c.status === 'Approved')
    .reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  const pendingCount = myClaims.filter((c) => c.status === 'Pending').length;

  return (
    <div>
      {/* Header Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Patient Portal</h1>
          <p className="page-subtitle">Submit healthcare reimbursement claims and track processing status in real time.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <span>Total Claims Submitted</span>
            <div className="stat-icon-wrapper primary">
              <FileText size={20} />
            </div>
          </div>
          <div className="stat-value">{totalSubmitted}</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <span>Pending Reviews</span>
            <div className="stat-icon-wrapper warning">
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#d97706' }}>{pendingCount}</div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <span>Total Approved Reimbursement</span>
            <div className="stat-icon-wrapper success">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#059669' }}>₹{totalApprovedAmt.toLocaleString()}</div>
        </div>
      </div>

      {/* Submit Form Card */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: '1.35rem' }}>
          <PlusCircle size={22} color="#2563eb" />
          <span>Submit a New Medical Claim</span>
        </div>

        {message && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.85rem 1.1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.85rem 1.1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Patient Full Name</label>
              <input
                type="text"
                className="form-input"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Requested Claim Amount (₹)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#64748b' }}>₹</span>
              <input
                type="number"
                className="form-input"
                style={{ paddingLeft: '2.2rem' }}
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                placeholder="e.g. 15000"
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Claim Reason & Treatment Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe medical treatment, hospital visit, or prescription details..."
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Medical Document (Receipt / Prescription)</label>
            <div className="file-dropzone" onClick={() => document.getElementById('file-upload-input').click()}>
              <Upload size={28} color="#2563eb" style={{ margin: '0 auto 0.6rem' }} />
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>Click to select or Drag & Drop file here</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Supports PNG, JPG, or PDF files (Max 10MB)</div>
              <input
                id="file-upload-input"
                type="file"
                style={{ display: 'none' }}
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
            </div>

            {selectedFile && (
              <div className="file-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#2563eb" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</span>
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedFile(null)}>Remove</button>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', marginTop: '0.5rem' }}>
            {submitting ? 'Submitting Claim...' : 'Submit Claim Request'}
          </button>
        </form>
      </div>

      {/* My Submitted Claims Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="card-title">My Submitted Claims</h3>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{myClaims.length} Claims Total</span>
        </div>

        {myClaims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
            <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#334155' }}>No claims submitted yet</div>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Fill out the form above to submit your first reimbursement request.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Claimed Amount</th>
                  <th>Approved Amount</th>
                  <th>Status</th>
                  <th>Insurer Remarks</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody>
                {myClaims.map((c) => (
                  <tr key={c._id || c.claimId}>
                    <td style={{ fontWeight: '800', color: '#2563eb' }}>{c.claimId}</td>
                    <td style={{ fontWeight: '600', color: '#64748b' }}>{new Date(c.submissionDate).toLocaleDateString()}</td>
                    <td style={{ maxWidth: '220px', lineHeight: '1.4' }}>{c.description}</td>
                    <td style={{ fontWeight: '700' }}>₹{c.claimAmount?.toLocaleString()}</td>
                    <td style={{ fontWeight: '700', color: c.status === 'Approved' ? '#059669' : '#64748b' }}>
                      {c.status === 'Approved' ? `₹${c.approvedAmount?.toLocaleString()}` : '-'}
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '180px' }}>{c.insurerComments || 'No comments yet'}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewDocument(c.documentUrl, c.documentOriginalName)}
                      >
                        <FileText size={14} color="#2563eb" /> View
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
