const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const fetchHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/`);
  return response.json();
};
