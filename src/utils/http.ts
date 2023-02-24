const get = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET request failed with ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data as T;
};

const post = async <T>(url: string, body: any): Promise<T | undefined> => {
  const response = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) {
    throw new Error(`POST request failed with ${response.status}: ${response.statusText}`);
  }
  if (!response) {
    return undefined;
  }
  const data = await response.json();
  return data as T;
};

const put = async <T>(url: string, body: any): Promise<T | undefined> => {
  const response = await fetch(url, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) {
    throw new Error(`PUT request failed with ${response.status}: ${response.statusText}`);
  }
  if (!response) {
    return undefined;
  }
  const data = await response.json();
  return data as T;
};

const remove = async (url: string, body: any): Promise<void> => {
  const response = await fetch(url, { method: 'DELETE', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) {
    throw new Error(`DELETE request failed with ${response.status}: ${response.statusText}`);
  }
};

const http = {
  get,
  post,
  put,
  remove,
};

export default http;
