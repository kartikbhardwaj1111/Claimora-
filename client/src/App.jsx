import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PatientDashboard from './pages/PatientDashboard';
import InsurerDashboard from './pages/InsurerDashboard';
import DocumentViewer from './components/DocumentViewer';
import ReviewClaimModal from './components/ReviewClaimModal';
import { api } from './services/api';

export default function App() {
  const [currentRole, setCurrentRole] = useState('patient');
  const [currentUser, setCurrentUser] = useState({
    name: 'Rahul Sharma',
    email: 'patient@aarogya.com',
    role: 'patient',
  });
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [viewingDoc, setViewingDoc] = useState(null); // { url, name }
  const [reviewingClaim, setReviewingClaim] = useState(null); // claim object

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const data = await api.getClaims();
      setClaims(data);
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleRoleSwitch = async (newRole) => {
    setCurrentRole(newRole);
    try {
      const res = await api.demoLogin(newRole);
      setCurrentUser(res.user);
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  const handleCreateClaim = async (formData) => {
    await api.createClaim(formData);
    await fetchClaims();
  };

  const handleReviewSubmit = async (claimId, reviewData) => {
    try {
      await api.reviewClaim(claimId, reviewData);
      setReviewingClaim(null);
      await fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review decision');
    }
  };

  return (
    <div className="app-container">
      <Navbar
        currentRole={currentRole}
        onRoleSwitch={handleRoleSwitch}
        currentUser={currentUser}
      />

      <main className="main-content">
        {currentRole === 'patient' ? (
          <PatientDashboard
            currentUser={currentUser}
            claims={claims}
            onSubmitClaim={handleCreateClaim}
            onViewDocument={(url, name) => setViewingDoc({ url, name })}
          />
        ) : (
          <InsurerDashboard
            claims={claims}
            onSelectReview={(claim) => setReviewingClaim(claim)}
            onViewDocument={(url, name) => setViewingDoc({ url, name })}
          />
        )}
      </main>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewer
          documentUrl={viewingDoc.url}
          documentName={viewingDoc.name}
          onClose={() => setViewingDoc(null)}
        />
      )}

      {/* Insurer Review Modal */}
      {reviewingClaim && (
        <ReviewClaimModal
          claim={reviewingClaim}
          onClose={() => setReviewingClaim(null)}
          onSubmitReview={handleReviewSubmit}
          onViewDocument={(url, name) => setViewingDoc({ url, name })}
        />
      )}
    </div>
  );
}
