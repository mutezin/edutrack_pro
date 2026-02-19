import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data)
};

// Students API
export const studentAPI = {
  getAll: () => apiClient.get('/students'),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (data) => apiClient.post('/students', data),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  delete: (id) => apiClient.delete(`/students/${id}`),
  post: (endpoint, data) => apiClient.post(endpoint, data)
};

// Teachers API
export const teacherAPI = {
  getAll: () => apiClient.get('/teachers'),
  getById: (id) => apiClient.get(`/teachers/${id}`),
  create: (data) => apiClient.post('/teachers', data),
  update: (id, data) => apiClient.put(`/teachers/${id}`, data),
  delete: (id) => apiClient.delete(`/teachers/${id}`)
};

// Performance API
export const performanceAPI = {
  getAll: () => apiClient.get('/performance'),
  getById: (id) => apiClient.get(`/performance/${id}`),
  getByStudentId: (studentId) => apiClient.get(`/performance/student/${studentId}`),
  create: (data) => apiClient.post('/performance', data),
  update: (id, data) => apiClient.put(`/performance/${id}`, data),
  delete: (id) => apiClient.delete(`/performance/${id}`)
};

// Alerts API
export const alertAPI = {
  getAll: () => apiClient.get('/alerts'),
  getById: (id) => apiClient.get(`/alerts/${id}`),
  getByStatus: (status) => apiClient.get(`/alerts/status/${status}`),
  create: (data) => apiClient.post('/alerts', data),
  update: (id, data) => apiClient.put(`/alerts/${id}`, data),
  delete: (id) => apiClient.delete(`/alerts/${id}`)
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats')
};

// Parent API
export const parentAPI = {
  // GET /api/parents/:parentId/dashboard
  getDashboard: (parentId) => apiClient.get(`/parents/${parentId}/dashboard`)
};

export default apiClient;
