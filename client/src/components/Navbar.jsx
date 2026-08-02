import React from 'react';
import { ShieldCheck, UserCheck, Building2 } from 'lucide-react';

export default function Navbar({ currentRole, onRoleSwitch, currentUser }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={22} color="#ffffff" />
        </div>
        <span>Claimora</span>
      </div>

      <div className="demo-bar">
        <span className="demo-label">Role Switcher:</span>
        <button
          className={`role-btn ${currentRole === 'patient' ? 'active' : ''}`}
          onClick={() => onRoleSwitch('patient')}
        >
          <UserCheck size={16} />
          Patient Portal
        </button>
        <button
          className={`role-btn ${currentRole === 'insurer' ? 'active' : ''}`}
          onClick={() => onRoleSwitch('insurer')}
        >
          <Building2 size={16} />
          Insurer Portal
        </button>
      </div>

      <div className="user-chip">
        <div className="user-avatar">{getInitials(currentUser?.name)}</div>
        <span>{currentUser?.name || 'Rahul Sharma'}</span>
        <div className="online-dot" title="Connected to MongoDB Atlas"></div>
      </div>
    </nav>
  );
}
