const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('passiton_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request('/auth/me'),

  // Products
  getProducts: (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query.set(key, String(value));
    });
    return request(`/products?${query.toString()}`);
  },

  getProduct: (id) => request(`/products/${id}`),

  getRelatedProducts: (id) => request(`/products/${id}/related`),

  createProduct: (data) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id, data) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id) =>
    request(`/products/${id}`, { method: 'DELETE' }),

  getMyProducts: () => request('/products/my'),

  // Orders
  createOrder: (data) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyOrders: () => request('/orders/my'),

  getMySales: () => request('/orders/sales'),

  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // User
  updateProfile: (data) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getUserStats: () => request('/users/stats'),
};
