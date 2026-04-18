const BASE_URL =
  typeof import.meta.env.VITE_API_URL === "string" &&
  import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000/api";

const TIMEOUT = 10000;

const request = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let result;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok) {
      throw new Error(
        result?.message || `Request failed with status ${response.status}`,
      );
    }

    // ── Handle both wrapped { success, data } and raw array/object responses
    if (result && typeof result === "object" && "data" in result) {
      return result.data;
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

const buildQuery = (params) => {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
};

export const fetchProjects = async (type) => {
  const params = typeof type === "string" && type.trim() !== "" ? { type } : {};
  const query = buildQuery(params);
  return request(`/projects${query}`);
};

export const fetchProjectBySlug = async (slug) => {
  if (!slug || typeof slug !== "string") {
    throw new Error("Invalid slug provided");
  }
  return request(`/projects/${encodeURIComponent(slug)}`);
};

export const fetchFeaturedProjects = async () => {
  return request("/projects/featured");
};

export const fetchAbout = async () => {
  return request("/about");
};
