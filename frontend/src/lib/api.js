const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

export async function api(path, options) {
  const res = await fetch(`${API_URL}/api${path}`, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw Object.assign(new Error(body.error || res.statusText), {
      status: res.status,
    });
  return body;
}
