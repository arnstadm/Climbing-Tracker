// src/composables/useApi.ts
export const useApi = (endpoint: string) => {
  const baseUrl = `http://localhost:3000/${endpoint}`;

  const fetchAll = async () => {
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
  };

  const fetchMy = async (id: number | string, identifier: string) => {
    const res = await fetch(`${baseUrl}/${identifier}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
  };

  const post = async (payload: Record<string, any>) => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to post data');
    return await res.json();
  };

  const put = async (id: number | string, payload: Record<string, any>) => {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update data');
    return await res.json();
  };

  const del = async (id: number | string) => {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete data');
    return true;
  };

  return { fetchAll, fetchMy, post, put, del };
};