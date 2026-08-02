import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, FileText, DollarSign, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ReviewClaimModal({ claim, onClose, onSubmitReview, onViewDocument }) {
  if (!claim) return null;

  const [status, setStatus] = useState(claim.status === 'Pending' ? 'Approved' : claim.status);
  const [approvedAmount, setApprovedAmount] = useState(claim.approvedAmount || claim.claimAmount);
  const [insurerComments, setInsurerComments] = useState(claim.insurerComments || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (status === 'Approved') {
      const numAmt = Number(approvedAmount);
      if (isNaN(numAmt) || numAmt < 0) {
        setError('Approved amount must be a valid positive number');
        return;
      }
      if (numAmt > claim.claimAmount) {
        setError(`Approved amount cannot exceed requested claim amount (₹${claim.claimAmount?.toLocaleString()})`);
        return;
      }
    }

    onSubmitReview(claim._id || claim.id, {
      status,
      approvedAmount: status === 'Approved' ? Number(approvedAmount) : 0,
      insurerComments,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Review Claim</span>
              <span style={{ color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.9rem' }}>{claim.claimId}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Patient: <strong>{claim.patientName}</strong> ({claim.patientEmail})
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Claim Quick Details Header */}
            <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '12px', marginBottom: '1.35rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Requested Amount</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#2563eb', marginTop: '2px' }}>₹{claim.claimAmount?.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Current Status</div>
                  <div style={{ marginTop: '4px' }}><StatusBadge status={claim.status} /></div>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.85rem', lineHeight: '1.4' }}>
                <strong style={{ color: '#0f172a' }}>Description:</strong> {claim.description}
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onViewDocument(claim.documentUrl, claim.documentOriginalName)}
              >
                <FileText size={15} color="#2563eb" /> Inspect Uploaded Document
              </button>
            </div>

            {/* Decision Selector Cards */}
            <div className="form-group">
              <label className="form-label">Review Decision</label>
              <div className="decision-grid">
                <div
                  className={`decision-card ${status === 'Approved' ? 'selected-approve' : ''}`}
                  onClick={() => {
                    setStatus('Approved');
                    setApprovedAmount(claim.claimAmount);
                  }}
                >
                  <CheckCircle2 size={22} color={status === 'Approved' ? '#059669' : '#94a3b8'} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Approve Claim</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Authorize payment</div>
                  </div>
                </div>

                <div
                  className={`decision-card ${status === 'Rejected' ? 'selected-reject' : ''}`}
                  onClick={() => {
                    setStatus('Rejected');
                    setApprovedAmount(0);
                  }}
                >
                  <XCircle size={22} color={status === 'Rejected' ? '#dc2626' : '#94a3b8'} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Reject Claim</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Decline reimbursement</div>
                  </div>
                </div>
              </div>
            </div>

            {status === 'Approved' && (
              <div className="form-group">
                <label className="form-label">Approved Amount (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#64748b' }}>₹</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ paddingLeft: '2.2rem' }}
                    value={approvedAmount}
                    max={claim.claimAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    placeholder="Enter approved amount"
                    required
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>Max allowed: ₹{claim.claimAmount?.toLocaleString()}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Insurer Remarks & Remarks</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={insurerComments}
                onChange={(e) => setInsurerComments(e.target.value)}
                placeholder="Add official reviewer remarks, policy clause references, or reasons for decision..."
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Review Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
