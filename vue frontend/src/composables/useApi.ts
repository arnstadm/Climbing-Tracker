// src/composables/useApi.ts
// composable for reusing code in fetch functions in components. takes in endpoints and does CRUD.
export const useApi = (endpoint: string) => {
  const baseUrl = `http://localhost:3000/${endpoint}`;

  const getAuthHeaders = () => { // takes token from localstorage and formats it for authorization headers
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchAll = async () => { // fetches all objects from tables
    const res = await fetch(baseUrl, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
  };

  const fetchMy = async () => { // fetches only the data that belongs to the signed in climber
    const res = await fetch(`${baseUrl}/climber/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
  };

  const post = async (payload: Record<string, any>) => { // posting data using authorization headers
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to post data');
    return await res.json();
  };

  const put = async (id: number | string, payload: Record<string, any>) => { // updates data using authorization headers
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update data');
    return await res.json();
  };

  const del = async (id: number | string) => { // deletes data using authorization headers
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete data');
    return true;
  };

  return { fetchAll, fetchMy, post, put, del };
};