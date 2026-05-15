import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api/v1',

  withCredentials: true,

  timeout: 15000,
});

// ======================================
// REQUEST INTERCEPTOR
// ======================================
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token');

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ======================================
// RESPONSE INTERCEPTOR
// ======================================
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // ==================================
    // UNAUTHORIZED
    // ==================================
    if (
      error.response &&
      error.response.status === 401
    ) {
      localStorage.removeItem('token');

      // optional redirect
      if (
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login';
      }
    }

    // ==================================
    // NETWORK ERROR
    // ==================================
    if (error.code === 'ECONNABORTED') {
      console.error(
        'Request timeout. Server took too long to respond.'
      );
    }

    if (!error.response) {
      console.error(
        'Network error. Backend may be offline.'
      );
    }

    return Promise.reject(error);
  }
);

export default api;