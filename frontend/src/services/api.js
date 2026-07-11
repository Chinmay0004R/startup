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

export const fetchPosts = async (authorId) =>
  request(authorId ? `/api/v1/posts/?author_id=${authorId}` : '/api/v1/posts/');

export const createPost = async (post) =>
  request('/api/v1/posts/', {
    method: 'POST',
    body: JSON.stringify(post),
  });

export const fetchDoctorById = async (doctorId) => request(`/api/v1/doctors/${doctorId}`);

export const likePost = async (postId) =>
  request(`/api/v1/posts/${postId}/like`, {
    method: 'POST',
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
