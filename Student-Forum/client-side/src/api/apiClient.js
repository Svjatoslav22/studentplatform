import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

// Request interceptor — додаю токен і логую запити
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {}
    // простий лог для демонстрації у DevTools Network/Console
    if (config && config.url) console.log('[api] request', config.method, config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — централізована обробка помилок
apiClient.interceptors.response.use(
  (resp) => {
    if (resp && resp.config && resp.status) console.log('[api] response', resp.status, resp.config.url);
    return resp;
  },
  (err) => {
    console.error('[api] response error', err?.response?.status, err?.config?.url);
    if (err?.response?.status === 401) {
      try { localStorage.removeItem('authToken'); } catch(e){}
      // перенаправлення на логін (демо)
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default apiClient;