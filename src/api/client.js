const BASE_URL = import.meta.env.VITE_API_URL;

export const api = async (endpoint, { method = 'GET', body = null, token = null } = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
    };

    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong');
    return data;
};