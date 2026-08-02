import React from 'react';
import { X, FileText, ExternalLink, Download } from 'lucide-react';

export default function DocumentViewer({ documentUrl, documentName, onClose }) {
  if (!documentUrl) return null;

  const baseUrl = import.meta.env.VITE_API_URL || '';
  const fullUrl = documentUrl.startsWith('/uploads') ? `${baseUrl}${documentUrl}` : documentUrl;

  const isPdf = fullUrl.toLowerCase().endsWith('.pdf') || documentName?.toLowerCase().endsWith('.pdf');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <FileText size={20} color="#2563eb" />
            <span>Document Preview: {documentName || 'Claim Medical Receipt'}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ minHeight: '450px', background: '#f8fafc', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
          {isPdf ? (
            <object
              data={fullUrl}
              type="application/pdf"
              width="100%"
              height="480px"
              style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <iframe
                src={fullUrl}
                title="PDF Preview"
                width="100%"
                height="480px"
                style={{ border: 'none', borderRadius: '8px' }}
              >
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <FileText size={48} color="#2563eb" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Unable to inline preview PDF</p>
                  <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <ExternalLink size={16} /> Open PDF File
                  </a>
                </div>
              </iframe>
            </object>
          ) : (
            <img
              src={fullUrl}
              alt="Receipt Preview"
              style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
          )}
        </div>

        <div className="modal-footer">
          <a
            href={fullUrl}
            download={documentName || 'medical-receipt'}
            className="btn btn-secondary"
          >
            <Download size={16} /> Download
          </a>
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <ExternalLink size={16} /> Open in New Tab
          </a>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
