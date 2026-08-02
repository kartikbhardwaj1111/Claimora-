import React, { useState, useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, Bell } from 'lucide-react';
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
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [viewingDoc, setViewingDoc] = useState(null); // { url, name }
  const [reviewingClaim, setReviewingClaim] = useState(null); // claim object

  const addToast = (title, desc, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

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

    // Live real-time polling every 2.5 seconds to sync across tab sessions & roles
    const interval = setInterval(() => {
      api
        .getClaims()
        .then((latestClaims) => {
          setClaims((prevClaims) => {
            latestClaims.forEach((newClaim) => {
              const oldClaim = prevClaims.find(
                (c) => (c._id || c.claimId) === (newClaim._id || newClaim.claimId)
              );
              if (oldClaim && oldClaim.status !== newClaim.status) {
                addToast(
                  `Real-Time Update: Claim ${newClaim.claimId} ${newClaim.status}`,
                  `Status updated to ${newClaim.status}${
                    newClaim.status === 'Approved'
                      ? ` (Approved Amount: ₹${(newClaim.approvedAmount || 0).toLocaleString()})`
                      : ''
                  }`,
                  newClaim.status === 'Approved' ? 'success' : 'danger'
                );
              }
            });
            return latestClaims;
          });
        })
        .catch((err) => console.error('Realtime sync error:', err));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleRoleSwitch = async (newRole) => {
    setCurrentRole(newRole);
    fetchClaims(); // Instantly pull latest data from MongoDB when role changes
    try {
      const res = await api.demoLogin(newRole);
      setCurrentUser(res.user);
      addToast(
        `Switched to ${newRole === 'patient' ? 'Patient Portal' : 'Insurer Control Center'}`,
        `Active Role: ${res.user.name}`,
        'info'
      );
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  const handleCreateClaim = async (formData) => {
    await api.createClaim(formData);
    addToast('Claim Submitted Successfully', 'Your claim is now listed under Pending Review.', 'success');
    await fetchClaims();
  };

  const handleReviewSubmit = async (claimId, reviewData) => {
    try {
      await api.reviewClaim(claimId, reviewData);
      setReviewingClaim(null);
      addToast(
        'Review Decision Saved',
        `Claim status updated to ${reviewData.status} with approved amount ₹${(reviewData.approvedAmount || 0).toLocaleString()}`,
        'success'
      );
      await fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review decision');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <div className="toast-icon">
              {t.type === 'success' ? (
                <CheckCircle2 size={22} color="#059669" />
              ) : t.type === 'danger' ? (
                <AlertCircle size={22} color="#dc2626" />
              ) : (
                <Bell size={22} color="#2563eb" />
              )}
            </div>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div className="toast-desc">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>

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
