// src/composables/useApi.ts
// composable for reusing code in fetch functions in components. takes in endpoints and does CRUD.
export const useApi = (endpoint: string) => {
  const baseUrl = `http://localhost:3000/${endpoint}`;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchAll = async () => {
    const res = await fetch(baseUrl, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
  };

  const fetchMy = async () => {
    const res = await fetch(`${baseUrl}/climber/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
  };

  const post = async (payload: Record<string, any>) => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to post data');
    return await res.json();
  };

  const put = async (id: number | string, payload: Record<string, any>) => {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update data');
    return await res.json();
  };

  const del = async (id: number | string) => {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete data');
    return true;
  };

  return { fetchAll, fetchMy, post, put, del };
};