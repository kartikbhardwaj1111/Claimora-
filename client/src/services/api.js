import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${BASE_URL}/api`;

export const api = {
  // Auth API
  demoLogin: async (role) => {
    const res = await axios.post(`${API_BASE}/auth/demo-login`, { role });
    return res.data;
  },

  login: async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return res.data;
  },

  register: async (name, email, password, role) => {
    const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password, role });
    return res.data;
  },

  // Claims API
  createClaim: async (formData) => {
    const res = await axios.post(`${API_BASE}/claims`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getClaims: async (params = {}) => {
    const res = await axios.get(`${API_BASE}/claims`, { params });
    return res.data;
  },

  getMyClaims: async (email) => {
    const res = await axios.get(`${API_BASE}/claims/my-claims`, { params: { email } });
    return res.data;
  },

  reviewClaim: async (claimId, reviewData) => {
    const res = await axios.patch(`${API_BASE}/claims/${claimId}/review`, reviewData);
    return res.data;
  },
};
