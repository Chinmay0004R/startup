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
    const text = await response.text();
    throw new Error(`Request failed with ${response.status}: ${text}`);
  }

  // Some endpoints may return empty body
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return text;
  }
};

export const fetchHealth = async () => request('/');

export const fetchDoctors = async (search = '') => {
  const query = search?.trim();
  const suffix = query ? `?search=${encodeURIComponent(query)}` : '';
  return request(`/api/v1/doctors/${suffix}`);
};

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

export const createPost = async (post, token) =>
  request('/api/v1/posts/', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(post),
  });

export const fetchDoctorById = async (doctorId) => request(`/api/v1/doctors/${doctorId}`);

export const fetchUserById = async (userId, token) =>
  request(`/api/v1/users/${userId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const uploadUserProfileImage = (formData, token, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/v1/users/me/profile-image`);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (error) {
          resolve(null);
        }
      } else {
        reject(new Error(`Upload failed with ${xhr.status}: ${xhr.responseText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed due to a network error'));
    xhr.send(formData);
  });

export const fetchFollowers = async (userId, token) => {
  const follows = await request(`/api/v1/follows/followers/${userId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!Array.isArray(follows)) return [];
  // Resolve follower user details
  const users = await Promise.all(
    follows.map(async (f) => {
      try {
        return await fetchUserById(f.follower_id, token);
      } catch (e) {
        return null;
      }
    })
  );
  return users.filter(Boolean);
};

export const fetchFollowing = async (userId, token) => {
  const follows = await request(`/api/v1/follows/following/${userId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!Array.isArray(follows)) return [];
  const users = await Promise.all(
    follows.map(async (f) => {
      try {
        return await fetchUserById(f.following_id, token);
      } catch (e) {
        return null;
      }
    })
  );
  return users.filter(Boolean);
};

export const fetchNotifications = async (userId, token) =>
  request(`/api/v1/notifications/user/${userId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const createFollow = async (payload, token) =>
  request('/api/v1/follows/', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
  });

export const fetchDoctorProfiles = async () => request('/api/v1/doctor-profiles/');

export const createDoctorProfile = async (payload, token) =>
  request('/api/v1/doctor-profiles/', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
  });

export const uploadDoctorLicenseDocument = (formData, token, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/v1/doctor-profiles/license`);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (error) {
          resolve(null);
        }
      } else {
        reject(new Error(`Upload failed with ${xhr.status}: ${xhr.responseText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed due to a network error'));
    xhr.send(formData);
  });

export const uploadDoctorCertificate = (formData, token, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/v1/doctor-profiles/certificate`);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (error) {
          resolve(null);
        }
      } else {
        reject(new Error(`Upload failed with ${xhr.status}: ${xhr.responseText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed due to a network error'));
    xhr.send(formData);
  });

export const fetchDoctorProfileByUserId = async (userId) => {
  const profiles = await fetchDoctorProfiles();
  if (!Array.isArray(profiles)) return null;
  return profiles.find((p) => p.user_id === Number(userId)) || null;
};

export const fetchReviewsForDoctorProfile = async (doctorProfileId) =>
  request(`/api/v1/reviews/doctor/${doctorProfileId}`);

export const likePost = async (postId, token) =>
  request(`/api/v1/posts/${postId}/like`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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
