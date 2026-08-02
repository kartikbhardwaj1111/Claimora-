import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  if (status === 'Approved') {
    return (
      <span className="status-badge status-approved">
        <CheckCircle2 size={14} /> Approved
      </span>
    );
  }
  if (status === 'Rejected') {
    return (
      <span className="status-badge status-rejected">
        <XCircle size={14} /> Rejected
      </span>
    );
  }
  return (
    <span className="status-badge status-pending">
      <Clock size={14} /> Pending
    </span>
  );
}
