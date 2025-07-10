import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'token'; // Cambiar para que coincida con el frontend

export const tokenManager = {
  getToken: () => localStorage.getItem(TOKEN_KEY) || localStorage.getItem('pilgrimage_token'),
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('pilgrimage_token', token); // Mantener ambos por compatibilidad
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('pilgrimage_token');
  },
};

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      tokenManager.setToken(response.data.access_token);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    tokenManager.removeToken();
  },
};

// Groups API
export const groupsAPI = {
  getAll: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  getById: async (groupId) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },

  create: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  update: async (groupId, groupData) => {
    const response = await api.put(`/groups/${groupId}`, groupData);
    return response.data;
  },

  delete: async (groupId) => {
    const response = await api.delete(`/groups/${groupId}`);
    return response.data;
  },
};

// Itineraries API
export const itinerariesAPI = {
  getAll: async () => {
    const response = await api.get('/itineraries');
    return response.data;
  },

  getByGroupId: async (groupId) => {
    const response = await api.get(`/itineraries/group/${groupId}`);
    return response.data;
  },

  create: async (itineraryData) => {
    const response = await api.post('/itineraries', itineraryData);
    return response.data;
  },

  update: async (itineraryId, itineraryData) => {
    const response = await api.put(`/itineraries/${itineraryId}`, itineraryData);
    return response.data;
  },

  delete: async (itineraryId) => {
    const response = await api.delete(`/itineraries/${itineraryId}`);
    return response.data;
  },
};

// Destinations API
export const destinationsAPI = {
  getAll: async () => {
    const response = await api.get('/destinations');
    return response.data;
  },

  getById: async (destinationId) => {
    const response = await api.get(`/destinations/${destinationId}`);
    return response.data;
  },

  create: async (destinationData) => {
    const response = await api.post('/destinations', destinationData);
    return response.data;
  },

  update: async (destinationId, destinationData) => {
    const response = await api.put(`/destinations/${destinationId}`, destinationData);
    return response.data;
  },

  delete: async (destinationId) => {
    const response = await api.delete(`/destinations/${destinationId}`);
    return response.data;
  },
};

// Spiritual Content API
export const spiritualAPI = {
  getAll: async () => {
    const response = await api.get('/spiritual-content');
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`/spiritual-content/category/${category}`);
    return response.data;
  },

  create: async (contentData) => {
    const response = await api.post('/spiritual-content', contentData);
    return response.data;
  },

  update: async (contentId, contentData) => {
    const response = await api.put(`/spiritual-content/${contentId}`, contentData);
    return response.data;
  },

  delete: async (contentId) => {
    const response = await api.delete(`/spiritual-content/${contentId}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getByGroup: async (groupId) => {
    const response = await api.get(`/users/group/${groupId}`);
    return response.data;
  },
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    if (status === 401) {
      return 'No autorizado. Por favor, inicia sesión nuevamente.';
    } else if (status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    } else if (status === 404) {
      return 'Recurso no encontrado.';
    } else if (status === 422) {
      // Handle Pydantic validation errors
      if (Array.isArray(data)) {
        // Multiple validation errors
        return data.map(err => `${err.loc ? err.loc.join('.') : 'Campo'}: ${err.msg}`).join(', ');
      } else if (data.detail) {
        // Single validation error or FastAPI HTTPException
        if (Array.isArray(data.detail)) {
          return data.detail.map(err => `${err.loc ? err.loc.join('.') : 'Campo'}: ${err.msg}`).join(', ');
        } else {
          return typeof data.detail === 'string' ? data.detail : 'Error de validación.';
        }
      } else {
        return 'Error de validación de datos.';
      }
    } else if (status === 500) {
      return 'Error interno del servidor. Por favor, inténtalo más tarde.';
    } else {
      return data.detail || data.message || 'Error desconocido.';
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  } else {
    // Something else happened
    return 'Error inesperado. Por favor, inténtalo de nuevo.';
  }
};

export default api;