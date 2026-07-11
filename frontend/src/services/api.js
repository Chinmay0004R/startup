const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
};

export const fetchHealth = async () => request('/');

export const fetchDoctors = async () => request('/api/v1/doctors/');

export const createDoctor = async (doctor) =>
  request('/api/v1/doctors/', {
    method: 'POST',
    body: JSON.stringify(doctor),
  });

export const fetchSafetyAlerts = async () => request('/api/v1/safety/alerts/');

export const createSafetyAlert = async (alert) =>
  request('/api/v1/safety/alerts/', {
    method: 'POST',
    body: JSON.stringify(alert),
  });

export const fetchComplaints = async () => request('/api/v1/complaints/');

export const createComplaint = async (complaint) =>
  request('/api/v1/complaints/', {
    method: 'POST',
    body: JSON.stringify(complaint),
  });

export const registerUser = async (payload) =>
  request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const verifyUser = async (payload) =>
  request('/api/v1/auth/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const loginUser = async (payload) =>
  request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
