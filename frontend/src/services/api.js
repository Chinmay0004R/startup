const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const request = async (path, options = {}) => {
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  };

  if (fetchOptions.body && typeof fetchOptions.body === 'object' && !(fetchOptions.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentRole');
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
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

export const fetchDoctors = async (search = '', filters = {}) => {
  const params = new URLSearchParams();
  const query = search?.trim();
  if (query) params.set('search', query);
  if (filters.name) params.set('name', filters.name);
  if (filters.registrationNumber) params.set('registration_number', filters.registrationNumber);
  if (filters.hospital) params.set('hospital', filters.hospital);
  if (filters.city) params.set('city', filters.city);
  if (filters.state) params.set('state', filters.state);
  if (filters.specialization) params.set('specialization', filters.specialization);
  if (filters.verifiedOnly) params.set('verified', 'true');
  if (filters.minExperience) params.set('min_experience', filters.minExperience);
  if (filters.maxExperience) params.set('max_experience', filters.maxExperience);

  const suffix = params.toString() ? `?${params.toString()}` : '';
  return request(`/api/v1/doctors/${suffix}`);
};

export const createDoctor = async (doctor) =>
  request('/api/v1/doctors/', {
    method: 'POST',
    body: doctor,
  });

export const fetchSafetyAlerts = async (token) => 
  request('/api/v1/safety/alerts/', { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const createSafetyAlert = async (alert, token) =>
  request('/api/v1/safety/alerts/', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: alert,
  });

export const fetchSafetyAlertById = async (alertId, token) =>
  request(`/api/v1/safety/alerts/${alertId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const updateSafetyAlert = async (alertId, alert, token) =>
  request(`/api/v1/safety/alerts/${alertId}`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: alert,
  });

export const fetchPosts = async (token, authorId) =>
  request(authorId ? `/api/v1/posts/?author_id=${authorId}` : '/api/v1/posts/', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const createPost = async (post, token) =>
  request('/api/v1/posts/', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: post,
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
    body: payload,
  });

export const fetchDoctorProfiles = async () => request('/api/v1/doctor-profiles/');

export const createDoctorProfile = async (payload, token) =>
  request('/api/v1/doctor-profiles/', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: payload,
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

export const fetchComplaints = async (token) => 
  request('/api/v1/complaints/', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const createComplaint = async (complaint, token) =>
  request('/api/v1/complaints/', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: complaint,
  });

export const registerUser = async (payload) =>
  request('/api/v1/auth/register', {
    method: 'POST',
    body: payload,
  });

export const verifyUser = async (payload) =>
  request('/api/v1/auth/verify', {
    method: 'POST',
    body: payload,
  });

export const loginUser = async (payload) =>
  request('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  });

// Dashboard Statistics APIs

export const fetchDoctorStatistics = async (profileId, token) =>
  request(`/api/v1/doctor-profiles/${profileId}/statistics`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const fetchUserStatistics = async (userId, token) =>
  request(`/api/v1/users/${userId}/statistics`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const fetchUserFollowingDoctors = async (userId, token) =>
  request(`/api/v1/users/${userId}/following-doctors`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const fetchUserComplaintHistory = async (userId, token) =>
  request(`/api/v1/users/${userId}/complaints-history`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const setUserRole = async (role, token) =>
  request('/api/v1/auth/set-role', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: { role },
  });

export const deleteAccount = async (payload, token) =>
  request('/api/v1/users/me', {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: payload,
  });
