const API_BASE = import.meta.env.VITE_API_BASE || '';

function getAuthHeaders() {
  const token = localStorage.getItem('campusnet_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleRes(res) {
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : {}; } catch(e) { data = { text }; }
  if (!res.ok) throw data;
  return data;
}

export async function register(payload) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function getProfile() {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    headers: { ...getAuthHeaders() }
  });
  return handleRes(res);
}

export async function updateProfile(payload) {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function logout() {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: { ...getAuthHeaders() }
  });
  return handleRes(res);
}

export async function listResources(page = 1) {
  const res = await fetch(`${API_BASE}/api/resources?page=${page}`, { headers: {...getAuthHeaders()} });
  return handleRes(res);
}

export async function getResource(id) {
  const res = await fetch(`${API_BASE}/api/resources/${id}`, { headers: {...getAuthHeaders()} });
  return handleRes(res);
}

export async function searchResources(q, opts = {}) {
  const params = new URLSearchParams({ q });
  if (opts.subject) params.set('subject', opts.subject);
  if (opts.year) params.set('year', opts.year);
  const res = await fetch(`${API_BASE}/api/resources/search/query?${params.toString()}`, { headers: {...getAuthHeaders()} });
  return handleRes(res);
}

export async function uploadResource(formData) {
  const res = await fetch(`${API_BASE}/api/resources/upload`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: formData
  });
  return handleRes(res);
}

export async function addComment(resourceId, payload) {
  const res = await fetch(`${API_BASE}/api/resources/${resourceId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function getComments(resourceId) {
  const res = await fetch(`${API_BASE}/api/resources/${resourceId}/comments`, { headers: {...getAuthHeaders()} });
  return handleRes(res);
}

export async function downloadResource(id) {
  const res = await fetch(`${API_BASE}/api/resources/${id}/download`, { headers: {...getAuthHeaders()} });
  return handleRes(res);
}

export async function myUploads() {
  const res = await fetch(`${API_BASE}/api/resources/my-uploads/all`, { headers: {...getAuthHeaders()} });
  return handleRes(res);
}

// Messages
export async function postMessage(formData) {
  const res = await fetch(`${API_BASE}/api/messages/post`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: formData
  });
  return handleRes(res);
}

export async function deleteMessage(id) {
  const res = await fetch(`${API_BASE}/api/messages/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  return handleRes(res);
}

export async function getMessagesByCategory(category, page = 1, limit = 20) {
  const res = await fetch(`${API_BASE}/api/messages/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`, { headers: {...getAuthHeaders()} });
  return handleRes(res);
}

export default {
  register, login, getProfile, updateProfile, logout,
  listResources, getResource, searchResources, uploadResource, addComment, getComments, downloadResource, myUploads,
  postMessage, getMessagesByCategory
};

